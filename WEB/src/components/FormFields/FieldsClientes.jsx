export default function FieldsClientes({data}){
    return (
        <>
            <label>Cif</label><br/>
            <input name="cif"
                   defaultValue={data? data["cif"]:""}
            />
            <br/><br/>
            <label>Nombre</label><br/>
            <input name="nombre"
                   defaultValue={data? data["nombre"]:""}
            />
            <br/><br/>
        </>
    )
}