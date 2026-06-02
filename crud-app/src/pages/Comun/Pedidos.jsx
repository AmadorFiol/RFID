import {useState, useEffect, useContext} from 'react'
import { toast } from 'react-toastify'
import {infoApi, pedidosApi, plantillasApi} from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'
import * as Papa from 'papaparse'
import {UserContext} from "../../App.jsx";

const EMPTY = {
    plantillaId: '',
    cantidad: '',
    info: {}
}

export default function Pedidos() {
    const [pedidos, setPedidos] = useState([])
    const [plantillas, setPlantillas] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const user = useContext(UserContext);

    const load = async () => {
        setLoading(true)
        try {
            const [pe, pl] = await Promise.all([
                pedidosApi.getByUsuario(user.cif),
                plantillasApi.getByUsuario(user.cif)
            ])
            setPedidos(pe.data??null)
            setPlantillas(pl.data??null)
        } catch (e) {
            toast.error(`Error al cargar pedidos: ${e.message}`)
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

    const openEdit = (pedido) => {
        setEditing(pedido)
        setForm({ plantillaId: pedido.plantilla.id, cantidad: pedido.cantidad, info:{} })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        plantilla: { id: form.plantillaId },
        cantidad: form.cantidad,
    })

    const saveInfo = async (pedidoId) => {
        Papa.parse(form.info,{
            complete: (results)=>{
                results.data.map((row)=> {
                    let info="^XA^XFE:SAMPLE.ZPL"
                    row.map((r,i)=>{
                        info+=`^FN${i+1}^FD${r}^FS`
                    })
                    info+="^XZ"
                    infoApi.create({
                        pedido: { id: pedidoId },
                        data:info
                    })
                })
            }
        })
    }

    const handleSubmit = async () => {
        try {
            if (editing) {
                await pedidosApi.update(editing.id, buildBody())
                await saveInfo(editing.id)
                toast.success(`Pedido #${editing.id} actualizado`)
            } else {
                const created = await pedidosApi.create(buildBody())
                await saveInfo(created.id)
                toast.success(`Pedido #${created.data.id} creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (pedido) => {
        if (!confirm(`¿Eliminar pedido #${pedido.id}?`)) return
        try {
            await pedidosApi.delete(pedido.id)
            toast.success(`Pedido #${pedido.id} eliminado`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>pedidos</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nueva Pedido</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Plantilla</th>
                        <th>Cantidad</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : pedidos.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : pedidos.map((p) => (
                        <tr key={p.id}>
                            <td className="td-id">#{p.id}</td>
                            <td>{p.plantilla.id}</td>
                            <td>{p.cantidad}</td>
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
                title={editing ? `Editar pedido #${editing.id}` : 'Nuevo <Pedido>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Plantilla</label>
                    <select
                        value={form.plantillaId}
                        onChange={(e) => setForm({ ...form, plantillaId: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona plantilla --</option>
                        {plantillas.map((pl) => (
                            <option key={pl.id} value={pl.id}>{pl.id}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Cantidad</label>
                    <input
                        type="number"
                        value={form.cantidad}
                        onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                        min={1}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>CSV</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e)=>setForm({ ...form, info:e.target.files[0] })}
                        required
                    />
                </div>
            </FormModal>
        </div>
    )
}
