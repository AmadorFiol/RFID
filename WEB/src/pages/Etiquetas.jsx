import Get from "../services/Get.jsx";
import Table from "../components/Table.jsx";

export default function Etiquetas() {
    console.log("CRUD Etiquetas")
    let data = Get({
        url:"http://127.0.0.1:8080/api/etiquetas",
        id:""
    })

    if (!(data instanceof Array)) {data=[data]}

    return(
        <>
            <Table
                data={data}
                atribs={Object.keys(data[0])}
                class="etiqueta"
            />
        </>
    );
}