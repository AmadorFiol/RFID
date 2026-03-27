import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {plantillasApi, usuariosApi} from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'

const EMPTY = {
    usuarioCif: '',
    zpl_code: ''
}

export default function Plantillas() {
    const [plantillas, setPlantillas] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const [pl, us] = await Promise.all([
                plantillasApi.getAll(),
                usuariosApi.getAll()
            ])
            setPlantillas(pl.data??null)
            setUsuarios(us.data??null)
        } catch (e) {
            toast.error(`Error al cargar plantillas: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const openCreate = () => {
        setEditing(null)
        setForm(EMPTY)
        setModalOpen(true)
    }

    const openEdit = (plantilla) => {
        setEditing(plantilla)
        setForm({ usuarioCif: plantilla.usuario.cif, zpl_code: plantilla.zpl_code })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        usuario: { cif: form.usuarioCif },
        zpl_code: form.zpl_code
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await plantillasApi.update(editing.id, buildBody())
                toast.success(`Plantilla #${editing.id} actualizada`)
            } else {
                const created = await plantillasApi.create(buildBody())
                toast.success(`Plantilla #${created.data.id} creada`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (plantilla) => {
        if (!confirm(`¿Eliminar plantilla #${plantilla.id}?`)) return
        try {
            await plantillasApi.delete(plantilla.id)
            toast.success(`Plantilla #${plantilla.id} eliminada`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>plantillas</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nueva Plantilla</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Codigo ZPL</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : plantillas.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : plantillas.map((p) => (
                        <tr key={p.id}>
                            <td className="td-id">#{p.id}</td>
                            <td>
                              <span className="nested">
                                <strong>{p.usuario.nombre}</strong> &nbsp;
                                  <span className="badge">{p.usuario.cif}</span>
                              </span>
                            </td>
                            <td>{p.zpl_code}</td>
                            <td className="td-actions">
                                <button className="btn btn-edit" onClick={() => openEdit(p)}>[edit]</button>
                                <button className="btn btn-del" onClick={() => handleDelete(p)}>[del]</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar plantilla #${editing.id}` : 'Nueva <Plantilla>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Usuario</label>
                    <select
                        value={form.usuarioCif}
                        onChange={(e) => setForm({ ...form, usuarioCif: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona usuario --</option>
                        {usuarios.map((u) => (
                            <option key={u.cif} value={u.cif}>{u.nombre} ({u.cif})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Codigo ZPL</label>
                    <input
                        type="text"
                        value={form.zpl_code}
                        onChange={(e) => setForm({ ...form, zpl_code: e.target.value })}
                        required
                    />
                </div>
            </FormModal>
        </div>
    )
}
