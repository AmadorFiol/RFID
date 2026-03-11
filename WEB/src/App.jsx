import Navbar from "./components/Navbar.jsx";
import {useState} from "react";
import Body from "./components/Body.jsx";

export default function App() {
    const [page,setPage] = useState()

    return(
        <>
            <Navbar pageChanger={setPage} />
            {page && <Body/>}
        </>
    )
}

/* Llamadas Ejemplo
let data
    // Ejemplo GET

    data = Get({
        url:"clientes",
        id:"TestWeb2"
    })

    return(
        <>
            {data.length>1 ?
                <ol>
                    {data.map(line => (
                        <li key={line.cif}>{line.nombre}</li>
                    ))}
                </ol> :
                <pre>{JSON.stringify(data, null, 2)}</pre>
            }
        </>
    );

    //Ejemplo POST

    data = Post({
        url:"clientes",
        body:{"cif":"TestWeb2","nombre":"TestPortalWebPost"}
    })

    return (
        <>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );

    //Ejemplo PUT

    data = Put({
        url:"clientes",
        id:"TestWeb2",
        body:{"nombre":"CambioConPut"}
    })

    return (
        <>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );

    //Ejemplo Delete

    data = Delete({
        url:"clientes",
        id:"TestWeb2"
    })
    return (
        <>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );*/