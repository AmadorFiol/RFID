import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper"
import {useEffect, useState} from "react";
import {pedidosApi, infoApi} from "../../services/api.js";
import {toast} from "react-toastify";
import getZpl from "../../services/zpl.js";

export default function Pruebas(){
    const [pedidos,setPedidos] = useState([])

    const prueba = async () => {
        console.log("Effect 2")
        try {
            // Creamos nueva instancia del objeto
            const browserPrint = new ZebraBrowserPrintWrapper();

            // Obtenemos la impresora predeterminada
            const defaultPrinter= await browserPrint.getDefaultPrinter();
            console.log("Printer",defaultPrinter.name)

            // Setteamos la impresora
            browserPrint.setPrinter(defaultPrinter);

            // Obtenemos el estado de la impresora
            const printerStatus = await browserPrint.checkPrinterStatus();

            // Y comprobamos si esta preparada
            if(printerStatus.isReadyToPrint) {

                // Establecemos el código ZPL a enviar
                let fullZPL = ""

                for(const p in pedidos) {
                    console.log(p)
                    const res = await infoApi.getByPedido(pedidos[p].id)
                    const info = res.data

                    console.log("Info",info)
                    info.map((i)=>{

                        fullZPL+=pedidos[p].plantilla.zplCode+i.data

                    })
                }

                console.log("Código final",fullZPL)

                // Enviamos código ZPL a la impresora
                //await browserPrint.print(fullZPL);

            } else {
                console.log("Error/s", printerStatus.errors);
            }

        } catch (error) {
            toast.error(error)
            throw new Error(error);
        }
    };

    const load = async () =>{
        try {
            const res = await pedidosApi.getAll()
            setPedidos(res.data??null)
        }catch (e){
            toast.error(`Error al cargar: ${e.message}`)
        }
    }

    useEffect(()=>{ load() },[])
    useEffect(()=>{ pedidos.length>0? prueba():console.log("No hay pedidos") },[pedidos.length])

/*    //Test JSZPL
    console.log(getZpl({
        width: 200,
        height: 300,
        text: "pepito palotes"
    }))*/
}