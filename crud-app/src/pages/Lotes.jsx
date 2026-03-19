import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { lotesApi } from '../services/api'
import FormModal from '../components/FormModal'

const EMPTY = {
    fechaImpresion: '',
}

export default function Lotes() {
    const [lotes, setLotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const res = await lotesApi.getAll()
            setLotes(res.data??null)
        } catch (e) {
            toast.error(`Error al cargar lotes: ${e.message}`)
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

    const openEdit = (lote) => {
        setEditing(lote)
        setForm({ fechaImpresion: lote.fechaImpresion })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        fechaImpresion: form.fechaImpresion,
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await lotesApi.update(editing.id, buildBody())
                toast.success(`Lote #${editing.id} actualizado`)
            } else {
                const created = await lotesApi.create(buildBody())
                toast.success(`Lote #${created.id} creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (lote) => {
        if (!confirm(`¿Eliminar lote #${lote.id} (${lote.fechaImpresion})?`)) return
        try {
            await lotesApi.delete(lote.id)
            toast.success(`Lote #${lote.id} eliminado`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>lotes</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nuevo Lote</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha de Impresión</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : lotes.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : lotes.map((l) => (
                        <tr key={l.id}>
                            <td className="td-id">#{l.id}</td>
                            <td>{l.fechaImpresion}</td>
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
                title={editing ? `Editar lote #${editing.id}` : 'Nuevo <Lote>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Fecha de Impresión</label>
                    <input
                        type="date"
                        value={form.fechaImpresion}
                        onChange={(e) => setForm({ ...form, fechaImpresion: e.target.value })}
                        required
                    />
                </div>
            </FormModal>
        </div>
    )
}
