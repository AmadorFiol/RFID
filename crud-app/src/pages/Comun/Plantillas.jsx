import {useState, useEffect, useContext} from 'react'
import { toast } from 'react-toastify'
import {plantillasApi, usuariosApi} from '../../services/api.js'
import FormModal from '../../components/FormModal.jsx'
import {UserContext} from "../../App.jsx";
import {Label} from "jszpl";
import LabelPreviewer from "../../components/LabelPreviewer.jsx";

const INITIAL_ZPL =`^XA

^FX Top section with logo, name and address.
^CF0,60
^FO50,50^GB100,100,100^FS
^FO75,75^FR^GB100,100,100^FS
^FO93,93^GB40,40,40^FS
^FO220,50^FDIntershipping, Inc.^FS
^CF0,30
^FO220,115^FD1000 Shipping Lane^FS
^FO220,155^FDShelbyville TN 38102^FS
^FO220,195^FDUnited States (USA)^FS
^FO50,250^GB700,3,3^FS

^FX Second section with recipient address and permit information.
^CFA,30
^FO50,300^FDJohn Doe^FS
^FO50,340^FD100 Main Street^FS
^FO50,380^FDSpringfield TN 39021^FS
^FO50,420^FDUnited States (USA)^FS
^CFA,15
^FO600,300^GB150,150,3^FS
^FO638,340^FDPermit^FS
^FO638,390^FD123456^FS
^FO50,500^GB700,3,3^FS

^FX Third section with bar code.
^BY5,2,200
^FO100,525^BC^FD12345678^FS

^XZ`

const EMPTY = {
    nombre: '',
    zplCode: INITIAL_ZPL
}

export default function Plantillas() {
    const [plantillas, setPlantillas] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const user = useContext(UserContext)

    const load = async () => {
        setLoading(true)
        try {
            const res = await plantillasApi.getByUsuario(user.cif)
            setPlantillas(res.data??null)
        } catch (e) {
            toast.error(`Error al cargar plantillas: ${e.message}`)
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

    const openEdit = (plantilla) => {
        setEditing(plantilla)
        setForm({ nombre: plantilla.nombre, zplCode: plantilla.zplCode })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY)
    }

    const buildBody = () => ({
        usuario: { cif: user.cif },
        nombre: form.nombre,
        zplCode: form.zplCode
    })

    const handleSubmit = async () => {
        console.log(form.zplCode)
        try {
            if (editing) {
                await plantillasApi.update(editing.id, buildBody())
                toast.success(`Plantilla #${editing.id} actualizada`)
            } else {
                const created = await plantillasApi.create(buildBody())
                toast.success(`Plantilla #${created.data.id} creada`)
            }
            closeModal()
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    const handleDelete = async (plantilla) => {
        if (!confirm(`¿Eliminar plantilla #${plantilla.id}?`)) return
        try {
            await plantillasApi.delete(plantilla.id)
            toast.success(`Plantilla #${plantilla.id} eliminada`)
            await load()
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <p className="page-title">/ <span>plantillas</span></p>
                <button className="btn btn-primary" onClick={openCreate}>[+] Nueva Plantilla</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Codigo ZPL</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr className="state-row"><td colSpan={3}>Cargando...</td></tr>
                    ) : plantillas.length === 0 ? (
                        <tr className="state-row"><td colSpan={3}>Sin datos</td></tr>
                    ) : plantillas.map((p) => (
                        <tr key={p.id}>
                            <td className="td-id">#{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>--- Pulse editar para ver ---</td>
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
                title={editing ? `Editar plantilla #${editing.id}` : 'Nueva <Plantilla>'}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        maxLength={64}
                        required
                    />
                </div>
                <LabelPreviewer form={form} setForm={setForm}/>
            </FormModal>
        </div>
    )
}
