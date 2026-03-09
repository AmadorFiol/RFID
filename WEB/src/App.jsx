import Navbar from "./components/Navbar.jsx";
import {useState} from "react";
import Clientes from "./pages/Clientes.jsx";
import Lotes from "./pages/Lotes.jsx";
import Etiquetas from "./pages/Etiquetas.jsx";

export default function App() {
    const [page,setPage] = useState()

    return(
        <>
            <Navbar
                pageChanger={setPage}
            />
            {//Funcion implicita con dependencia a page
                {
                    "clientes":<Clientes />,
                    "etiquetas":<Etiquetas />,
                    "lotes":<Lotes />
                }[page]
            }
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