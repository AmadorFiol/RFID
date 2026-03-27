import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { rolesApi } from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'

const EMPTY = {
    nombre: '',
}

export default function Roles() {
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const res = await rolesApi.getAll()
            setRoles(res.data??null)
        } catch (e) {
            toast.error(`Error al cargar roles: ${e.message}`)
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

    const openEdit = (rol) => {
        setEditing(rol)
        setForm({ nombre: rol.nombre })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        nombre: form.nombre,
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await rolesApi.update(editing.id, buildBody())
                toast.success(`Rol #${editing.id} actualizado`)
            } else {
                const created = await rolesApi.create(buildBody())
                toast.success(`Rol #${created.data.id} creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (rol) => {
        if (!confirm(`¿Eliminar rol #${rol.id} (${rol.nombre})?`)) return
        try {
            await rolesApi.delete(rol.id)
            toast.success(`Rol #${rol.id} eliminado`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>roles</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nuevo Rol</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : roles.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : roles.map((r) => (
                        <tr key={r.id}>
                            <td className="td-id">#{r.id}</td>
                            <td>{r.nombre}</td>
                            <td className="td-actions">
                                <button className="btn btn-edit" onClick={() => openEdit(r)}>[edit]</button>
                                <button className="btn btn-del" onClick={() => handleDelete(r)}>[del]</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar rol #${editing.id}` : 'Nuevo <Rol>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                    />
                </div>
            </FormModal>
        </div>
    )
}
