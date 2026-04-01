import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {pedidosApi} from '../../services/api.js'
import Label from "../../components/Label.jsx"
import {printLabels} from "../../utils/printLabels.js";


export default function Pedidos() {
    const [pedidos, setPedidos] = useState([])
    const [checkeds, setCheckeds] = useState([])

    const load = async () => {
        try {
            const res = await pedidosApi.getAll()
            setPedidos(res.data??[])
        } catch (e) {
            toast.error(`Error al cargar pedidos: ${e.message}`)
        }
    }
    useEffect(() => { load() }, [])

    const onClick = (p) => {
        checkeds.includes(p) ?
            setCheckeds(checkeds.filter(c => c !== p))
            : setCheckeds([...checkeds, p])
    }

    const print = () => {
        checkeds.length<1?
            toast.error("No se ha seleccionado ninguna label"):
            printLabels(checkeds)
    }
    return (
        <>
            <div className="grid-labels">
                {pedidos.map((p)=><Label pedido={p} checked={checkeds.includes(p)} onClick={()=>onClick(p)}/>)}
            </div>
            <button className="btn-print" onClick={print}>Imprimir seleccion</button>
        </>
    )
}
