import {useEffect, useState} from "react";
import {rolesApi, paginasApi, usuariosApi, lotesApi, clientesApi} from '../services/api'
import {toast} from "react-toastify";
import FormModal from "../components/FormModal.jsx";

const EMPTY = {
    nombre:'',
    rolId:''
}

export default function Paginas(){
    const [paginas, setPaginas] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null) // null = create, obj = edit
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const [rl, pg] = await Promise.all([
                rolesApi.getAll(),
                paginasApi.getAll()
            ])
            setRoles(rl.data??null)
            setPaginas(pg.data??null)
        } catch (e) {
            toast.error(`Error al cargar las páginas: ${e.message}`)
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

    const openEdit = (pagina) => {
        setEditing(pagina)
        setForm({
            nombre: pagina.nombre,
            rolId: pagina.rolId

        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }


    const buildBody = () => ({
        nombre: form.nombre,
        rol: { id : form.rolId }
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await paginasApi.update(editing.id, buildBody())
                toast.success(`Página #${editing.id} actualizada`)
            } else {
                const created = await paginasApi.create(buildBody())
                toast.success(`Página #${created.id} creada`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (pagina) => {
        if (!confirm(`¿Eliminar #${pagina.id} (${pagina.nombre})?`)) return
        try {
            await paginasApi.delete(pagina.id)
            toast.success(`Página #${pagina.id} eliminada`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }


    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>páginas</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nueva Página</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Rol</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : paginas.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : paginas.map((l) => (
                        <tr key={l.id}>
                            <td className="td-id">#{l.id}</td>
                            <td>{l.nombre}</td>
                            <td>
                                <span className="nested">
                                    <strong>{l.rol.nombre}</strong> &nbsp;
                                    <span className="badge">{l.rol.id}</span>
                                </span>
                            </td>
                            <td className="td-actions">
                                <button className="btn btn-edit" onClick={() => openEdit(l)}>[edit]</button>
                                <button className="btn btn-del" onClick={() => handleDelete(l)}>[del]</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar página #${editing.id}` : 'Nueva <Página>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Nombre de la página</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Elegir el rol</label>
                    <select
                        value={form.rolId}
                        onChange={(e) => setForm({ ...form, rolId: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona Rol --</option>
                        {roles.map((u) => (
                            <option key={u.id} value={u.id}>{u.nombre} ({u.id})</option>
                        ))}
                    </select>
                </div>
            </FormModal>
        </div>
    )
}