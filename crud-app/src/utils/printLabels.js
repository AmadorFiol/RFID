import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper";
import {toast} from "react-toastify";
import {infoApi} from "../services/api.js";

export const printLabels = async (pedidos) => {
    try {
        // Creamos nueva instancia del objeto
        const browserPrint = new ZebraBrowserPrintWrapper();

        // Obtenemos la impresora predeterminada
        const defaultPrinter= await browserPrint.getDefaultPrinter();

        // Setteamos la impresora
        browserPrint.setPrinter(defaultPrinter);

        // Obtenemos el estado de la impresora
        const printerStatus = await browserPrint.checkPrinterStatus();

        // Y comprobamos si esta preparada
        if(printerStatus.isReadyToPrint) {

            // Establecemos el código ZPL a enviar
            let fullZPL = ""

            for(const p in pedidos) {
                let info = []
                try {
                    const res = await infoApi.getByPedido(pedidos[p].id)
                    info = res.data
                } catch (e) {
                    console.log(e)
                }

                fullZPL+=pedidos[p].plantilla.zplCode

                info.length>0? info.map((i)=>{

                    fullZPL+=i.data

                }):null
            }

            // Enviamos código ZPL a la impresora
            await browserPrint.print(fullZPL);

        } else {
            console.log("Error/s", printerStatus.errors);
        }

    } catch (error) {
        toast.error(error)
        throw new Error(error);
    }
};