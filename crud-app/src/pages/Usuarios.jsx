import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { usuariosApi } from '../services/api'
import FormModal from '../components/FormModal'

const EMPTY = {
    cif: '',
    nombre: '',
    email: '',
    password: '',
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null) // null = create, obj = edit
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const res = await usuariosApi.getAll()
            setUsuarios(res.data??null)
        } catch (e) {
            toast.error(`Error al cargar usuarios: ${e.message}`)
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

    const openEdit = (usuario) => {
        setEditing(usuario)
        setForm({
            cif: usuario.cif,
            nombre: usuario.nombre,
            email: usuario.email,
            password: usuario.password,
        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        cif: form.cif,
        nombre: form.nombre,
        email: form.email,
        password: form.password,
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await usuariosApi.update(editing.cif, buildBody())
                toast.success(`Usuario "${form.nombre}" actualizado`)
            } else {
                await usuariosApi.create(buildBody())
                toast.success(`Usuario "${form.nombre}" creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (usuario) => {
        if (!confirm(`¿Eliminar usuario "${usuario.nombre}" (${usuario.cif})?`)) return
        try {
            await usuariosApi.delete(usuario.cif)
            toast.success(`Usuario "${usuario.nombre}" eliminado`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>usuarios</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nuevo Usuario</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>CIF</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : usuarios.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : usuarios.map((u) => (
                        <tr key={u.cif}>
                            <td className="td-id">{u.cif}</td>
                            <td>{u.nombre}</td>
                            <td>{u.email}</td>
                            <td>{u.password}</td>
                            <td className="td-actions">
                                <button className="btn btn-edit" onClick={() => openEdit(u)}>[edit]</button>
                                <button className="btn btn-del" onClick={() => handleDelete(u)}>[del]</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar usuario: ${editing.cif}` : 'Nuevo <Cliente>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>CIF</label>
                    <input
                        type="text"
                        maxLength={8}
                        value={form.cif}
                        onChange={(e) => setForm({ ...form, cif: e.target.value })}
                        disabled={!!editing}
                        required
                        placeholder="1234567A"
                    />
                </div>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        maxLength={64}
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                        placeholder="Nombre del usuario"
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        maxLength={64}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="Email del usuario"
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        maxLength={64}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        placeholder="Contraseña"
                    />
                </div>
            </FormModal>
        </div>
    )
}