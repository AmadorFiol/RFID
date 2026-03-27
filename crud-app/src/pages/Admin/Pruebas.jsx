import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper"
import {useEffect} from "react";

export default function Pruebas(){

    const prueba = async (code_zplFull) => {
        try {

            // Create a new instance of the object
            const browserPrint = new ZebraBrowserPrintWrapper();

            // Select default printer
            const defaultPrinter= await browserPrint.getDefaultPrinter();

            // Set the printer
            browserPrint.setPrinter(defaultPrinter);

            // Check printer status
            const printerStatus = await browserPrint.checkPrinterStatus();

            // Check if the printer is ready
            if(printerStatus.isReadyToPrint) {

                // Send ZPL to printer
                await browserPrint.print(code_zplFull);

            } else {
                console.log("Error/s", printerStatus.errors);
            }

        } catch (error) {
            throw new Error(error);
        }
    };

    const labels=[
        `^XA
        ^DFE:SAMPLE.ZPL^FS
        ^BY2,2,100
        ^FO20,20^BC^FN1^FS
        ^XZ
        ^XA
        ^XFE:SAMPLE.ZPL
        ^FN1^FD123456789^FS
        ^XZ`,

        `^XA
        ^DFE:SAMPLE.ZPL^FS
        ^BY2,2,100
        ^FO20,20^BC^FN1^FS
        ^XZ
        ^XA
        ^XFE:SAMPLE.ZPL
        ^FN1^FD24032006^FS
        ^XZ`
    ]

    let code_zplFull=``
    for (let i=0;i<labels.length;i++){
        code_zplFull+=labels[i]
    }

    useEffect(()=>{prueba(code_zplFull)},[]);
}