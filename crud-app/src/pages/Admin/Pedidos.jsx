import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {pedidosApi} from '../../services/api.js'
import Label from "../../components/Label.jsx";


export default function Pedidos() {
    const [pedidos, setPedidos] = useState([])
    const [checkeds, setCheckeds] = useState([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setLoading(true)
        try {
            const res = pedidosApi.getAll()
            setPedidos(res.data??null)
        } catch (e) {
            toast.error(`Error al cargar pedidos: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])


    return (
        <>
            {pedidos.map((p)=>{<Label pedido={p} checked={p in checkeds} />})}
        </>
    )
}
