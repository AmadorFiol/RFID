import Get from "../services/Get.jsx";
import Table from "../components/Table.jsx";

export default function Clientes() {
    console.log("CRUD Clientes")
    let data = Get({
        url:"clientes",
        id:""
    })

    if (!(data instanceof Array)) {data=[data]}

    return(
        <>
            <Table
                data={data}
                atribs={Object.keys(data[0])}
                class="cliente"
            />
        </>
    );
}