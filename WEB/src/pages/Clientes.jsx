import Get from "../services/Get.jsx";
import Table from "../components/Table.jsx";

export default function Clientes() {
    console.log("CRUD Clientes")
    let data = Get({
        url:"http://127.0.0.1:8080/api/clientes",
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
/* Ex App.jsx
let data
    // Ejemplo GET

    data = Get({
        url:"http://127.0.0.1:8080/api/clientes",
        id:"/TestWeb2"
    })

    return(
        <>
            <Navbar/>

            {data.length>1 ?
                <ol>
                    {data.map(line => (
                        <li key={line.cif}>{line.nombre}</li>
                    ))}
                </ol> :
                <pre>{JSON.stringify(data, null, 2)}</pre>}
        </>
    );

    //Ejemplo POST

    data = Post({
        url:"http://127.0.0.1:8080/api/clientes",
        body:{"cif":"TestWeb2","nombre":"TestPortalWebPost"}
    })

    return (
        <>
            <Navbar />
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );

    //Ejemplo PUT

    data = Put({
        url:"http://127.0.0.1:8080/api/clientes",
        id:"/TestWeb2",
        body:{"nombre":"CambioConPut"}
    })

    return (
        <>
            <Navbar />
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );

    //Ejemplo Delete

    data = Delete({
        url:"http://127.0.0.1:8080/api/clientes",
        id:"/TestWeb2"
    })
    return (
        <>
            <Navbar />
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );*/