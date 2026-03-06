import Get from "../services/Get.jsx";

export default function Clientes() {
    console.log("Estas en clientes")
    let data
    data = Get({
        url:"http://127.0.0.1:8080/api/clientes",
        id:""
    })

    return(
        <>
            {data.length>1 ?
                <ol>
                    {data.map(line => (
                        <li key={line.cif}>{line.nombre}</li>
                    ))}
                </ol> :
                <pre>{JSON.stringify(data, null, 2)}</pre>}
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