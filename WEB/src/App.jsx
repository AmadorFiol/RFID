import Navbar from "./components/Navbar.jsx";
import {createContext, useState} from "react";
import Body from "./components/Body.jsx";
import {ToastContainer} from "react-toastify";

const PageContext = createContext(null)

export default function App() {
    const [page,setPage] = useState()

    return(
        <>
            <Navbar setPage={setPage} />
            {page &&
                <PageContext value={page}>
                    <Body />
                </PageContext>
            }
            <ToastContainer theme="dark"/>
        </>
    )
}

export {PageContext}

/* Llamadas Ejemplo
let data
    // Ejemplo GET

    data = Get({
        url:"clientes",
        id:"TestWeb"
    })

    return(
        <PageContext value={""}>
            {data.length>1 ?
                <ol>
                    {data.map(line => (
                        <li key={line.cif}>{line.nombre}</li>
                    ))}
                </ol> :
                <pre>{JSON.stringify(data, null, 2)}</pre>
            }
        </PageContext>
    );

    //Ejemplo POST

    data = Post({
        url:"clientes",
        body:{"cif":"TestWeb","nombre":"WebPost"}
    })

    return (
        <PageContext value={""}>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </PageContext>
    );

    //Ejemplo PUT

    data = Put({
        url:"clientes",
        id:"TestWeb2",
        body:{"nombre":"WebPut"}
    })

    return (
        <PageContext value={""}>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </PageContext>
    );

    //Ejemplo Delete

    data = Delete({
        url:"clientes",
        id:"TestWeb"
    })
    return (
        <PageContext value={""}>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </PageContext>
    );

*/