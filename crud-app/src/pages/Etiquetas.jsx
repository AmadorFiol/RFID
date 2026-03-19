import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {etiquetasApi, clientesApi, lotesApi, inventariosApi, usuariosApi} from '../services/api'
import FormModal from '../components/FormModal'

const EMPTY = {
    usuarioCif: '',
    loteId: '',
    clienteId: '',
    inventarioId: '',
    codigo: '',
    estado: '',
}

export default function Etiquetas() {
    const [etiquetas, setEtiquetas] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [lotes, setLotes] = useState([])
    const [clientes, setClientes] = useState([])
    const [inventarios, setInventarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const load = async () => {
        setLoading(true)
        try {
            const [et, us, lo,cl,iv] = await Promise.all([
                etiquetasApi.getAll(),
                usuariosApi.getAll(),
                lotesApi.getAll(),
                clientesApi.getAll(),
                inventariosApi.getAll(),
            ])
            setEtiquetas(et.data??null)
            setUsuarios(us.data??null)
            setLotes(lo.data??null)
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
            usuarioCif: etiqueta.usuario.cif,
            loteId: etiqueta.lote.id,
            clienteId: etiqueta.cliente.id,
            inventarioId: etiqueta.inventario.id,
            codigo: etiqueta.codigo??'',
            estado: etiqueta.estado,
        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        usuario: { cif: form.usuarioCif },
        lote: { id: form.loteId },
        cliente: { id: form.clienteId },
        inventario: { id: form.inventarioId },
        codigo: form.codigo,
        estado: form.estado
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await etiquetasApi.update(editing.id, buildBody())
                toast.success(`Etiqueta #${editing.id} actualizada`)
            } else {
                const created = await etiquetasApi.create(buildBody())
                toast.success(`Etiqueta #${created.id} creada`)
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
                        <th>Lote</th>
                        <th>Cliente</th>
                        <th>Inventario</th>
                        <th>Codigo</th>
                        <th>Estado</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={4}>Cargando...</td></tr>
                    ) : etiquetas.length === 0 ? (
                        <tr className="state-row"><td colSpan={4}>Sin datos</td></tr>
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
                                <span className="nested">
                                Lote <strong>#{e.lote.id}</strong> &nbsp;
                                  <span className="badge">{e.lote.fechaImpresion}</span>
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
                            <td>{e.codigo??''}</td>
                            <td>{e.estado}</td>
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
                    <label>Lote</label>
                    <select
                        value={form.loteId}
                        onChange={(e) => setForm({ ...form, loteId: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona lote --</option>
                        {lotes.map((l) => (
                            <option key={l.id} value={l.id}>#{l.id} — {l.fechaImpresion}</option>
                        ))}
                    </select>
                </div>
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
                    <label>Codigo</label>
                    <input
                        type="text"
                        maxLength={32}
                        value={form.codigo}
                        onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                        placeholder="Codigo de la etiqueta"
                    />
                </div>
                <div className="form-group">
                    <label>Estado</label>
                    <select
                        value={form.estado}
                        onChange={(e) => setForm({ ...form, estado: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona estado --</option>
                        <option value="EN_USO">En uso</option>
                        <option value="LIBRE">Libre</option>
                        <option value="ROTA">Rota</option>
                        <option value="DESECHADA">Desechada</option>
                    </select>
                </div>
            </FormModal>
        </div>
    )
}
