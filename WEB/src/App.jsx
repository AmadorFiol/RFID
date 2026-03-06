import { useEffect } from 'react';
import { useState } from "react";
import axios from 'axios'

export default function App() {

    const [data, setData] = useState({info:"Default"});

    // Ejemplo GET
/*    useEffect(() => {
        const url="http://127.0.0.1:8080/api/clientes"
        const cif = "/TestWeb2"
        axios.get(url+cif)
            .then(res => {
                console.log("ResData:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return(
        <>
            <p>{data.length}</p>
            {data.length>1 ?
                <ol>
                    {data.map(line => (
                        <li key={line.cif}>{line.nombre}</li>
                    ))}
                </ol> :
                <pre>{JSON.stringify(data, null, 2)}</pre>}
        </>
    );*/

    //Ejemplo POST
/*    useEffect(() => {
        const url="http://127.0.0.1:8080/api/clientes"
        axios.post(url,{"cif":"TestWeb2","nombre":"TestPortalWebPost"})
            .then(res => {
                console.log("ResData:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return (
        <>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );*/

    //Ejemplo PUT
/*    useEffect(() => {
        const url="http://127.0.0.1:8080/api/clientes"
        const cif = "/TestWeb2"
        axios.put(url+cif,{"nombre":"CambioConPut"})
            .then(res => {
                console.log("ResData:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return (
        <>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );*/

    //Ejemplo Delete
/*    useEffect(() => {
        const url="http://127.0.0.1:8080/api/clientes"
        const cif = "/TestWeb1"
        axios.delete(url+cif)
            .then(res => {
                console.log("ResData:",res.status)
                setData(res.status)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return (
        <>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </>
    );*/
}