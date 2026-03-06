import Get from "../services/Get.jsx";

export default function Lotes() {
    console.log("CRUD Lotes")
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
                <pre>{JSON.stringify(data, null, 2)}</pre>
            }
        </>
    );
}