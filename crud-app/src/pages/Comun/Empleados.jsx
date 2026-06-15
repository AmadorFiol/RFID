import {useState, useEffect, useContext} from 'react'
import { toast } from 'react-toastify'
import {empleadosApi, etiquetasApi,fichajesApi} from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'
import {UserContext} from "../../App.jsx";
import useRfidFichaje from "../../hooks/useRfidFichaje.js";

const EMPTY = {
    idEtiqueta: '',
    idUsuario: '',
    dni: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
}

export default function Empleados() {
    const [empleados, setEmpleados] = useState([])
    const [etiquetas, setEtiquetas] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null) // null = create, obj = edit
    const [form, setForm] = useState(EMPTY)
    const user = useContext(UserContext)

    const {reading, connected, start, stop} = useRfidFichaje();

    const load = async () => {
        setLoading(true)
        try {
            const [em, et] = await Promise.all([
                empleadosApi.getByUsuario(user.cif),
                etiquetasApi.getByUsuario(user.cif)
            ])
            setEmpleados(em.data??null)
            setEtiquetas(et.data??null)
        } catch (e) {
            toast.error(`Error al cargar empleados: ${e.message}`)
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

    const openEdit = (empleado) => {
        setEditing(empleado)
        setForm({
            idEtiqueta: empleado.etiqueta.iid,
            idUsuario: user.cif,
            dni: empleado.dni,
            nombre:empleado.nombre,
            apellido1: empleado.apellido1,
            apellido2: empleado.apellido2,
        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        etiqueta: {iid: form.idEtiqueta},
        usuario: {cif: user.cif},
        dni: form.dni,
        nombre: form.nombre,
        apellido1: form.apellido1,
        apellido2: form.apellido2,
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await empleadosApi.update(editing.id, buildBody())
                toast.success(`Empleado "${form.nombre}" actualizado`)
            } else {
                await empleadosApi.create(buildBody())
                toast.success(`Empleado "${form.nombre}" creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (empleado) => {
        if (!confirm(`¿Eliminar empleado #${empleado.id}?`)) return
        try {
            await empleadosApi.delete(empleado.id)
            toast.success(`Empleado #${empleado.id} eliminado`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="ws-section">
                {!reading?
                    <button
                        onClick={start}
                        style={{ padding: '.5rem 1rem', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        ▶ Iniciar lectura
                    </button>
                    :
                    <button
                        onClick={stop}
                        style={{ padding: '.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        ■ Parar lectura
                    </button>
                }

                <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: reading ? '#2ecc71' : '#7f8c8d' }}>
                    {reading ? 'LEYENDO' : 'Parado'}
                </span>
                <span style={{ marginLeft: '1rem', color: connected ? '#2ecc71' : '#e74c3c' }}>
                    {connected ? '● WS conectado' : '○ WS desconectado'}
                </span>
            </div>
            <br/>
            <div className="page-header">
                <p className="page-title">/ <span>empleados</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nuevo Empleado</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Etiqueta</th>
                        <th>Nombre</th>
                        <th>Apellido 1</th>
                        <th>Apellido 2</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : empleados.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : empleados.map((e) => (
                        <tr key={e.dni}>
                            <td className="td-id">{e.dni}</td>
                            <td>{e.etiqueta.iid}</td>
                            <td>{e.nombre}</td>
                            <td>{e.apellido1}</td>
                            <td>{e.apellido2}</td>
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
                title={editing ? `Editar empleado: ${editing.dni}` : 'Nuevo <Empleado>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>DNI</label>
                    <input
                        type="text"
                        value={form.dni}
                        onChange={(e)=>setForm({ ...form, dni: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Etiqueta</label>
                    <select
                        value={form.idEtiqueta}
                        onChange={(e) => setForm({ ...form, idEtiqueta: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona etiqueta --</option>
                        {etiquetas.map((e) => (
                            <option key={e.iid} value={e.iid}>{e.alias} ({e.epc})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e)=>setForm({ ...form, nombre: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Primer apellido</label>
                    <input
                        type="text"
                        value={form.apellido1}
                        onChange={(e)=>setForm({ ...form, apellido1: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Segundo apellido</label>
                    <input
                        type="text"
                        value={form.apellido2}
                        onChange={(e)=>setForm({ ...form, apellido2: e.target.value })}
                    />
                </div>
            </FormModal>
        </div>
    )
}
