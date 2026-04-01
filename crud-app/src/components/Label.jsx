import {ready} from "zpl-renderer-js";
import {useState} from "react";
import {infoApi} from "../services/api.js";

export default function Label({pedido, checked, onClick}){
    const [img,setImg] = useState('')

    const getImg = async ()=> {
        let res
        try {
            res = await infoApi.getByPedido(pedido.id)
        } catch (e) {
            res = {data: [{data:""}]}
        }
        const info = res.data

        const zplCode = pedido.plantilla.zplCode + info[0].data

        const {api} = await ready;
        const label = await api.zplToBase64Async(zplCode,100,100,8);
        setImg(label)
    }

    getImg()

    return(
        <div
            key={pedido.id}
            onClick={onClick}
            className="label"
            style={{backgroundImage: `url(data:image/png;base64,${img})`,backgroundSize:"cover"}}
        >
            <input type="checkbox" checked={checked} readOnly/>
            <p>Cantidad a imprimir: {pedido.cantidad}</p>
        </div>
    )
}