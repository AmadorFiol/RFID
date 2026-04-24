import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper"
import {useEffect, useState} from "react";
import {pedidosApi, infoApi} from "../../services/api.js";
import {toast} from "react-toastify";
import getZpl from "../../services/zpl.js";
import {ready} from "zpl-renderer-js";
import Papa from "papaparse";

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

const zpl_template = `^XA^DFE:SAMPLE.ZPL^FS^BY2,2,100^FO20,20^BC^FN1^FS^XZ`
const zpl_vars = `^XA^XFE:SAMPLE.ZPL^FN1^FD12346754^FS^XZ`

export default function Pruebas(){
/*    // Test Papaparse
    const [form, setForm] = useState({info:{}})

    const handleSubmit = (e) => {
        e.preventDefault()
        Papa.parse(form.info,{
            complete: (results)=>{
                results.data.map((row)=> {
                    let info="^XA^XFE:SAMPLE.ZPL"
                    row.map((r,i)=>{
                        info+=`^FN${i}^FD${r}^FS`
                    })
                    info+="^XZ"
                    console.log(info)
                })
            }
        })
    }

    return(
        <form
            onSubmit={handleSubmit}
        >
            <input
                type="file"
                accept=".csv"
                onChange={(e)=>setForm({ ...form, info:e.target.files[0] })}
                required
            />
            <br/>
            <button type="submit">Guardar</button>
        </form>
    )
    /**/

/*    // Test ZPL-Renderer
    const [zpl,setZpl] = useState(INITIAL_ZPL)
    const [myImg, setImg] = useState('')

    const prueba = async ()=> {

        const {api} = await ready;
        const label = await api.zplToBase64Async(zpl,100,100,8);
        setImg(label)
    }

    prueba()

    return (
        <>
            <div style={{display: "flex", gap: "2rem", marginLeft:"5rem"}}>
                <textarea
                    value={zpl}
                    onChange={(e) => setZpl(e.target.value)}
                    cols={100}
                />
                {
                    myImg && <img
                        src={`data:image/png;base64,${myImg}`}
                    />
                }
            </div>
        </>
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
                await browserPrint.print(fullZPL);

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