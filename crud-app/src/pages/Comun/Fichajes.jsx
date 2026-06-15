import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../App.jsx";
import {empleadosApi, fichajesApi} from "../../services/api.js";
import {toast} from "react-toastify";
import FormModal from "../../components/FormModal.jsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction"

const EMPTY = {
    id: '',
    empDni: '',
    entrada: false,
    fecha: '',
    hora: '',
}

export default function Fichajes() {
    const [fichajes, setFichajes] = useState([])
    const [empleados, setEmpleados] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null) // null = create, obj = edit
    const [form, setForm] = useState(EMPTY)
    const user = useContext(UserContext)

    const load = async () => {
        try {
            const [em, fi] = await Promise.all([
                empleadosApi.getByUsuario(user.cif),
                fichajesApi.getAll()
            ])
            setEmpleados(em.data??null)
            setFichajes(fi.data??null)
        } catch (e) {
            toast.error(`Error al cargar fichajes: ${e.message}`)
        }
    }

    useEffect( () => { load() }, [])

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        id: form.id,
        empleado: {dni: form.empDni},
        entrada: form.entrada,
        timestamp: `${form.fecha}T${form.hora}.000Z`
    })

    const handleSubmit = async () => {
        try {
            if (editing) {
                await fichajesApi.update(editing.id, buildBody())
                toast.success(`Fichaje "${editing.id}" actualizado`)
            } else {
                const res =  await fichajesApi.create(buildBody())
                toast.success(`Fichaje "${res.data.id}" creado`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (fichaje) => {
        if (!confirm(`¿Eliminar fichaje #${fichaje.id}?`)) return
        try {
            await fichajesApi.delete(fichaje.id)
            toast.success(`fichaje #${fichaje.id} eliminado`)
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const getCalendarContent = () => {
        let a = []
        fichajes.map((f)=> a.push({
            title: `${f.entrada? `Entrada`:"Salida"}: ${f.timestamp.slice(11,19)}`,
            date: `${f.timestamp.slice(0,10)}`,
            extendedProps: f
        }))
        return a
    }

    const handleDateClick = (arg) => {
        setForm((prev)=> {
            return {
                ...prev,
                fecha: arg.dateStr
            }
        })
        setModalOpen(true)
    }

    const handleEventClick = (arg) => {
        /*
        console.log(arg.event.startStr)                 // Fecha (YY-MM-DD)
        console.log(arg.el.text.slice(-8))              // Hora
        console.log(arg.event._def.extendedProps)       // ExtraProps/Fichaje
        */
        const fichaje= arg.event._def.extendedProps
        setEditing(fichaje)
        setForm({
            id: fichaje.id,
            empDni: fichaje.empleado.dni,
            fecha: arg.event.startStr,
            hora: arg.el.text.slice(-8),
            entrada: fichaje.entrada
        })
        setModalOpen(true)
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>fichajes</span></p>
                {/* Cambiar este button por filtro de usuarios*/}
                <button className="btn btn-primary">[+] Nuevo Fichaje</button>
            </div>
            <div className="table-wrapper">
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    initialView="dayGridMonth"
                    events={getCalendarContent()}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                />
            </div>

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? `Editar fichaje` : 'Nuevo <Fichaje>'}
                onSubmit={handleSubmit}
                onDelete={editing? handleDelete : null}
            >
                <input type="hidden" value={form.id} />
                <div className="form-group">
                    <label>Empleado</label>
                    <select
                        value={form.empDni}
                        onChange={(e) => setForm({ ...form, empDni: e.target.value })}
                        required
                    >
                        <option value="" disabled={true}>-- Selecciona empleado --</option>
                        {empleados.map((e) => (
                            <option key={e.dni} value={e.dni}>{e.nombre} ({e.dni})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Fecha</label>
                    <input
                        type="date"
                        value={form.fecha}
                        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Hora</label>
                    <input
                        type="text"
                        value={form.hora}
                        onChange={(e) => setForm({ ...form, hora: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Entrada?</label>
                    <input
                        type="checkbox"
                        defaultChecked={form.entrada}
                        onChange={(e) => setForm({ ...form, entrada: e.target.value })}
                    />
                </div>
            </FormModal>
        </div>
    )
}