import Get from "../../services/Get.jsx";

export default function FieldsEtiquetas({data}){

    let clientes = Get({url: "clientes"})

    if (!(clientes instanceof Array) && clientes instanceof Object) {clientes=[clientes]}
    else if (!(clientes instanceof Array)){clientes=[{"cif":"","nombre":""}]} //No quitar

    let lotes = Get({url: "lotes"})

    if (!(lotes instanceof Array) && lotes instanceof Object) {lotes=[lotes]}
    else if (!(lotes instanceof Array)) {lotes=[{"id":"","fechaImpresion":""}]} //No quitar

    return (
        <>
            <label>Id</label>
            <input disabled={true} defaultValue={data? data["id"]:""}></input>
            <br/><br/>
            <label>Cliente</label>
            <select name="cliente" defaultValue={data? data["cliente"]:"default"}>
                <option value="default">--Seleccione un Cliente--</option>
                {
                    clientes.map(cliente=>(
                        <option value={cliente}>{cliente["nombre"]}</option>
                    ))
                }
            </select>
            <br/><br/>
            <label>Lote</label>
            <select name="lote" defaultValue={data? data["lote"]:"default"}>
                <option value="default">--Seleccione un Lote--</option>
                {
                    lotes.map(lote=>(
                        <option value={lote}>{lote["id"]}</option>
                    ))
                }
            </select>

            <br/><br/>
        </>
    )
}