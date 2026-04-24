import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {etiquetasApi, clientesApi, inventariosApi} from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'

const EMPTY = {
    clienteId: '',
    inventarioId: '',
    alias: '',
    epc: '',
    tid: '',
}

export default function Etiquetas() {
    const [etiquetas, setEtiquetas] = useState([])
    const [clientes, setClientes] = useState([])
    const [inventarios, setInventarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const [et,cl,iv] = await Promise.all([
                etiquetasApi.getAll(),
                clientesApi.getAll(),
                inventariosApi.getAll(),
            ])
            setEtiquetas(et.data??null)
            setClientes(cl.data??null)
            setInventarios(iv.data??null)
        } catch (e) {
            toast.error(`Error al cargar datos: ${e.message}`)
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

    const openEdit = (etiqueta) => {
        setEditing(etiqueta)
        setForm({
            clienteId: etiqueta.cliente.id,
            inventarioId: etiqueta.inventario.id,
            alias: etiqueta.alias??'',
            epc: etiqueta.epc,
            tid: etiqueta.tid??'',
        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        cliente: { id: form.clienteId },
        inventario: { id: form.inventarioId },
        alias: form.alias,
        epc: form.epc,
        tid: form.tid,
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await etiquetasApi.update(editing.id, buildBody())
                toast.success(`Etiqueta #${editing.id} actualizada`)
            } else {
                const created = await etiquetasApi.create(buildBody())
                toast.success(`Etiqueta #${created.data.id} creada`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (etiqueta) => {
        if (!confirm(`¿Eliminar etiqueta #${etiqueta.id}?`)) return
        try {
            await etiquetasApi.delete(etiqueta.id)
            toast.success(`Etiqueta #${etiqueta.id} eliminada`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>etiquetas</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nueva Etiqueta</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Cliente</th>
                        <th>Inventario</th>
                        <th>Alias</th>
                        <th>EPC</th>
                        <th>TID</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={8}>Cargando...</td></tr>
                    ) : etiquetas.length === 0 ? (
                        <tr className="state-row"><td colSpan={8}>Sin datos</td></tr>
                    ) : etiquetas.map((e) => (
                        <tr key={e.id}>
                            <td className="td-id">#{e.id}</td>
                            <td>
                                <span className="nested">
                                    <strong>{e.cliente.usuario.nombre}</strong> &nbsp;
                                    <span className="badge">{e.cliente.usuario.cif}</span>
                                </span>
                            </td>
                            <td>
                                {e.cliente?
                                    <span className="nested">
                                        <strong>{e.cliente.nombre}</strong> &nbsp;
                                            <span className="badge">{e.cliente.id}</span>
                                    </span>:
                                    null
                                }
                            </td>
                            <td>
                              <span className="nested">
                                Inventario <strong>#{e.inventario.id}</strong> &nbsp;
                                  <span className="badge">{e.inventario.nombre}</span>
                              </span>
                            </td>
                            <td>{e.alias}</td>
                            <td>{e.epc}</td>
                            <td>{e.tid}</td>
                            <td className="td-actions">
                                <button className="btn btn-edit" onClick={() => openEdit(e)}>[edit]</button>
                                <button className="btn btn-del" onClick={() => handleDelete(e)}>[del]</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar etiqueta #${editing.id}` : 'Nueva <Etiqueta>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Cliente</label>
                    <select
                        value={form.clienteId}
                        onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona cliente --</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre} ({c.id})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Inventario</label>
                    <select
                        value={form.inventarioId}
                        onChange={(e) => setForm({ ...form, inventarioId: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona inventario --</option>
                        {inventarios.map((i) => (
                            <option key={i.id} value={i.id}>#{i.id}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Alias</label>
                    <input
                        type="text"
                        maxLength={16}
                        value={form.alias}
                        onChange={(e) => setForm({ ...form, alias: e.target.value })}
                        placeholder="Alias de la etiqueta"
                    />
                </div>
                <div className="form-group">
                    <label>EPC</label>
                    <input
                        type="text"
                        maxLength={32}
                        value={form.epc}
                        onChange={(e) => setForm({ ...form, epc: e.target.value })}
                        placeholder="EPC de la etiqueta"
                    />
                </div>
                <div className="form-group">
                    <label>TID</label>
                    <input
                        type="text"
                        maxLength={32}
                        value={form.tid}
                        onChange={(e) => setForm({ ...form, tid: e.target.value })}
                        placeholder="TID de la etiqueta"
                    />
                </div>
            </FormModal>
        </div>
    )
}
