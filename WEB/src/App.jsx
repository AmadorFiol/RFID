import Navbar from "./components/Navbar.jsx";
import Get from "./services/Get.jsx";
import Post from "./services/Post.jsx";
import Put from "./services/Put.jsx";
import Delete from "./services/Delete.jsx";

export default function App() {
    let data
/*    // Ejemplo GET

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
    );*/

/*    //Ejemplo POST

    data = Post({
        url:"http://127.0.0.1:8080/api/clientes",
        body:{"cif":"TestWeb2","nombre":"TestPortalWebPost"}
    })

    return (
        <>
            <Navbar />
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );*/

/*    //Ejemplo PUT

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
    );*/

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
    );
}