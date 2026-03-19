import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { inventariosApi } from '../services/api'
import FormModal from '../components/FormModal'

const EMPTY = {
    nombre: '',
}

export default function Inventarios() {
    const [inventarios, setInventarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null) // null = create, obj = edit
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const res = await inventariosApi.getAll()
            setInventarios(res.data??null)
        } catch (e) {
            toast.error(`Error al cargar inventarios: ${e.message}`)
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

    const openEdit = (inventario) => {
        setEditing(inventario)
        setForm({ id: inventario.id , nombre:inventario.nombre??''})
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
                await inventariosApi.update(editing.id, buildBody())
                toast.success(`Inventario "${form.nombre}" actualizado`)
            } else {
                await inventariosApi.create(buildBody())
                toast.success(`Inventario "${form.nombre}" creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (inventario) => {
        if (!confirm(`¿Eliminar inventario #${inventario.id}?`)) return
        try {
            await inventariosApi.delete(inventario.id)
            toast.success(`Inventario #${inventario.id} eliminado`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>inventarios</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nuevo Inventario</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : inventarios.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : inventarios.map((i) => (
                        <tr key={i.id}>
                            <td className="td-id">{i.id}</td>
                            <td>{i.nombre??'[Sin nombre]'}</td>
                            <td className="td-actions">
                                <button className="btn btn-edit" onClick={() => openEdit(i)}>[edit]</button>
                                <button className="btn btn-del" onClick={() => handleDelete(i)}>[del]</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar inventario: ${editing.id}` : 'Nuevo <Inventario>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e)=>setForm({ ...form, nombre: e.target.value })}
                        required
                    />
                </div>
            </FormModal>
        </div>
    )
}
