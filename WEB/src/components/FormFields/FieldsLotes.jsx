export default function FieldsLotes({data}){
    return(
        <>
            <label>Id</label><br/>
            <input name="id"
                   defaultValue={data? data["id"]:""}
                   disabled={true}
            />
            <br/><br/>
            <label>Fecha de impresion</label><br/>
            <input name="fechaImpresion"
                   defaultValue={data? data["fechaImpresion"]:""}
                   type="date"
            />
            <br/><br/>
        </>
    )
}