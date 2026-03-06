import { useEffect } from 'react';
import { useState } from "react";
import axios from 'axios'

function App() {

    const [data, setData] = useState([{info:"Default"}]);

    useEffect(() => {
        const url="http://127.0.0.1:8080/api/clientes"
        axios.get(url)
            .then(res => {
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);


    return (
        <ol>
            {data.map(line => (
            <li key={line.cif}>{line.nombre}</li>
            ))}
        </ol>
    );
}

export default App