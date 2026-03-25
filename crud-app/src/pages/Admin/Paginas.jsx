import {useEffect, useState} from "react";
import {rolesApi, paginasApi} from '../../services/api.js'
import {toast} from "react-toastify";
import FormModal from "../../components/FormModal.jsx";

const EMPTY = {
    rolId:'',
    nombre:''
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
            const [pg, rl] = await Promise.all([
                paginasApi.getAll(),
                rolesApi.getAll()
            ])
            setPaginas(pg.data??null)
            setRoles(rl.data??null)
        } catch (e) {
            toast.error(`Error al cargar páginas: ${e.message}`)
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
            rolId: pagina.rol.id,
            nombre: pagina.nombre

        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }


    const buildBody = () => ({
        rol: { id : form.rolId },
        nombre: form.nombre
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await paginasApi.update(editing.id, buildBody())
                toast.success(`Pagina #${editing.id} actualizada`)
            } else {
                const created = await paginasApi.create(buildBody())
                toast.success(`Pagina #${created.data.id} creada`)
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
            toast.success(`Pagina #${pagina.id} eliminada`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }


    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>paginas</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nueva Pagina</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Rol</th>
                        <th>Nombre</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : paginas.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : paginas.map((p) => (
                        <tr key={p.id}>
                            <td className="td-id">#{p.id}</td>
                            <td>
                                <span className="nested">
                                    <strong>{p.rol.nombre}</strong> &nbsp;
                                    <span className="badge">{p.rol.id}</span>
                                </span>
                            </td>
                            <td>{p.nombre}</td>
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
                title={editing ? `Editar página #${editing.id}` : 'Nueva <Página>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Rol</label>
                    <select
                        value={form.rolId}
                        onChange={(e) => setForm({ ...form, rolId: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona Rol --</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.nombre} ({r.id})</option>
                        ))}
                    </select>
                </div>
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