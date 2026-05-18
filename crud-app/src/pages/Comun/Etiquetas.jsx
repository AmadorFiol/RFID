import {useState, useEffect, useContext} from 'react'
import { toast } from 'react-toastify'
import {etiquetasApi, clientesApi, inventariosApi} from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'
import {UserContext} from "../../App.jsx";

const EMPTY = {
    epc: '',
    tid: '',
    clienteId: '',
    inventarioId: '',
    alias: '',
    tagModel: '',
    alertar: false,
}

export default function Etiquetas() {
    const [etiquetas, setEtiquetas] = useState([])
    const [clientes, setClientes] = useState([])
    const [inventarios, setInventarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const user = useContext(UserContext)

    const load = async () => {
        setLoading(true)
        try {
            const [et,cl,iv] = await Promise.all([
                etiquetasApi.getByUsuario(user.cif),
                clientesApi.getByUsuario(user.cif),
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
            epc: etiqueta.epc,
            tid: etiqueta.tid,
            clienteId: etiqueta.cliente.id,
            inventarioId: etiqueta.inventario.id,
            alias: etiqueta.alias??'',
            tagModel: etiqueta.tagModel??'',
            alertar: etiqueta.alertar,
        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        epc: form.epc,
        tid: form.tid,
        cliente: { id: form.clienteId },
        inventario: { id: form.inventarioId },
        alias: form.alias,
        tagModel: form.tagModel,
        alertar: form.alertar,
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await etiquetasApi.update(editing.epc, buildBody())
                toast.success(`Etiqueta ${editing.epc} actualizada`)
            } else {
                const created = await etiquetasApi.create(buildBody())
                toast.success(`Etiqueta ${created.data.epc} creada`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (etiqueta) => {
        if (!confirm(`¿Eliminar etiqueta ${etiqueta.epc}?`)) return
        try {
            await etiquetasApi.delete(etiqueta.epc)
            toast.success(`Etiqueta ${etiqueta.epc} eliminada`)
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
                        <th>EPC</th>
                        <th>TID</th>
                        <th>Alias</th>
                        <th>Cliente</th>
                        <th>Inventario</th>
                        <th>Modelo del Tag</th>
                        <th>Alertar?</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={8}>Cargando...</td></tr>
                    ) : etiquetas.length === 0 ? (
                        <tr className="state-row"><td colSpan={8}>Sin datos</td></tr>
                    ) : etiquetas.map((e) => (
                        <tr key={e.epc}>
                            <td>{e.epc}</td>
                            <td>{e.tid}</td>
                            <td>{e.alias}</td>
                            <td>
                                <span className="nested">
                                    <strong>{e.cliente.nombre}</strong> &nbsp;
                                    <span className="badge">#{e.cliente.id}</span>
                                </span>
                            </td>
                            <td>
                              <span className="nested">
                                  <strong>{e.inventario.nombre}</strong> &nbsp;
                                  <span className="badge">#{e.inventario.id}</span>
                              </span>
                            </td>
                            <td>{e.tagModel}</td>
                            <td>{e.alertar? "Si":"No"}</td>
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
                title={editing ? `Editar etiqueta ${editing.epc}` : 'Nueva <Etiqueta>'}
                onSubmit={handleSubmit}
            >
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
                    <label>Cliente</label>
                    <select
                        value={form.clienteId}
                        onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona cliente --</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre} (#{c.id})</option>
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
                            <option key={i.id} value={i.id}>{i.nombre} (#{i.id})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Modelo del Tag</label>
                    <input
                        type="text"
                        maxLength={16}
                        value={form.tagModel}
                        disabled={true}
                        onChange={(e) => setForm({ ...form, tagModel: e.target.value })}
                        placeholder="Modelo del chip de la etiqueta"
                    />
                </div>
                <div className="form-group">
                    <label>Alertar si se encuentra?</label>
                    <input
                        type="checkbox"
                        checked={form.alertar}
                        onChange={(e) => setForm({...form,alertar: e.target.checked})}
                    />
                </div>
            </FormModal>
        </div>
    )
}
