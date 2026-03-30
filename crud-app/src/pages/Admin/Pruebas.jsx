import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper"
import {useEffect, useState} from "react";
import {pedidosApi, infoApi} from "../../services/api.js";
import {toast} from "react-toastify";
import getZpl from "../../services/zpl.js";
import {ready} from "zpl-renderer-js";

export default function Pruebas(){
    // Test ZPL-Renderer
    const [zpl,setZpl] = useState("^XA\n" +
        "\n" +
        "^FX Top section with logo, name and address.\n" +
        "^CF0,60\n" +
        "^FO50,50^GB100,100,100^FS\n" +
        "^FO75,75^FR^GB100,100,100^FS\n" +
        "^FO93,93^GB40,40,40^FS\n" +
        "^FO220,50^FDIntershipping, Inc.^FS\n" +
        "^CF0,30\n" +
        "^FO220,115^FD1000 Shipping Lane^FS\n" +
        "^FO220,155^FDShelbyville TN 38102^FS\n" +
        "^FO220,195^FDUnited States (USA)^FS\n" +
        "^FO50,250^GB700,3,3^FS\n" +
        "\n" +
        "^FX Second section with recipient address and permit information.\n" +
        "^CFA,30\n" +
        "^FO50,300^FDJohn Doe^FS\n" +
        "^FO50,340^FD100 Main Street^FS\n" +
        "^FO50,380^FDSpringfield TN 39021^FS\n" +
        "^FO50,420^FDUnited States (USA)^FS\n" +
        "^CFA,15\n" +
        "^FO600,300^GB150,150,3^FS\n" +
        "^FO638,340^FDPermit^FS\n" +
        "^FO638,390^FD123456^FS\n" +
        "^FO50,500^GB700,3,3^FS\n" +
        "\n" +
        "^FX Third section with bar code.\n" +
        "^BY5,2,270\n" +
        "^FO100,550^BC^FD12345678^FS\n" +
        "\n" +
        "^FX Fourth section (the two boxes on the bottom).\n" +
        "^FO50,900^GB700,250,3^FS\n" +
        "^FO400,900^GB3,250,3^FS\n" +
        "^CF0,40\n" +
        "^FO100,960^FDCtr. X34B-1^FS\n" +
        "^FO100,1010^FDREF1 F00B47^FS\n" +
        "^FO100,1060^FDREF2 BL4H8^FS\n" +
        "^CF0,190\n" +
        "^FO470,955^FDCA^FS\n" +
        "\n" +
        "^XZ")
    const [myImg, setImg] = useState('')

    const prueba = async ()=> {

        const {api} = await ready;
        const label = await api.zplToBase64Async(zpl,101.6,152.4,8);
        setImg(label)
    }

    prueba()

    return (
        <>{
            myImg && <img
                src={`data:image/png;base64,${myImg}`}
            />
        }</>
    )

    /**/
/*    // Test ZBPW
    const [pedidos,setPedidos] = useState([])

    const prueba = async () => {
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
                    const res = await infoApi.getByPedido(pedidos[p].id)
                    const info = res.data

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
    /**/

/*    //Test JSZPL
    console.log(getZpl({
        width: 200,
        height: 300,
        text: "pepito palotes"
    }))
    /**/
}