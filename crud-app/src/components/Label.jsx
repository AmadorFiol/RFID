import {ready} from "zpl-renderer-js";

export default function Label({pedido, checked}){
    let label=""

    const getImg = async ()=> {
        const {api} = await ready;
        const label = await api.zplToBase64Async(pedido.plantilla.zplCode,100,100,8);
    }

    getImg()

    return(
        <>
            <input type="checkbox" checked={checked}/>
            <img
                src={`data:image/png;base64,${label}`}
            />
            <p>{pedido.cantidad}</p>
        </>
    )
}