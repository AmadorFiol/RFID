import {useState, useEffect, useContext} from 'react'
import { toast } from 'react-toastify'
import {clientesApi} from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'
import {UserContext} from "../../App.jsx";

const EMPTY = {
    nombre: '',
    usuarioCif: '',
}

export default function Clientes() {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null) // null = create, obj = edit
    const [form, setForm] = useState(EMPTY)
    const user = useContext(UserContext)

    const load = async () => {
        setLoading(true)
        try {
            const res = await clientesApi.getByUsuario(user.cif)
            setClientes(res.data??null)
        } catch (e) {
            toast.error(`Error al cargar clientes: ${e.message}`)
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

    const openEdit = (cliente) => {
        setEditing(cliente)
        setForm({
            nombre: cliente.nombre,
            usuarioCif: cliente.usuario.cif,
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
        usuario: { cif: user.cif },
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await clientesApi.update(editing.id, buildBody())
                toast.success(`Cliente "${form.nombre}" actualizado`)
            } else {
                await clientesApi.create(buildBody())
                toast.success(`Cliente "${form.nombre}" creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (cliente) => {
        if (!confirm(`¿Eliminar cliente "${cliente.nombre}" (${cliente.id})?`)) return
        try {
            await clientesApi.delete(cliente.id)
            toast.success(`Cliente "${cliente.nombre}" eliminado`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>clientes</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nuevo Cliente</button>
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
                    ) : clientes.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : clientes.map((c) => (
                        <tr key={c.id}>
                            <td className="td-id">{c.id}</td>
                            <td>{c.nombre}</td>
                            <td className="td-actions">
                                <button className="btn btn-edit" onClick={() => openEdit(c)}>[edit]</button>
                                <button className="btn btn-del" onClick={() => handleDelete(c)}>[del]</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar cliente: ${editing.id}` : 'Nuevo <Cliente>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Usuario</label>
                    <select
                        value={form.usuarioCif}
                        onChange={(e) => setForm({ ...form, usuarioCif: e.target.value })}
                        disabled={true}
                        required
                    >
                        <option key={user.cif} value={user.cif}>{user.nombre} ({user.cif})</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        maxLength={64}
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                        placeholder="Nombre"
                    />
                </div>
            </FormModal>
        </div>
    )
}
