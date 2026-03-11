import Get from "../../services/Get.jsx";
import Put from "../../services/Put.jsx";
import Post from "../../services/Post.jsx";

export default function FormEtiquetas(props){

    let clientes = Get({url:"clientes"})

    if (!(clientes instanceof Array)) {clientes=[clientes]}

    let lotes = Get({url:"lotes"})

    if (!(lotes instanceof Array)) {lotes=[lotes]}

    function submitForm(formData){
        const body = {
            id:formData.get("id"),
            cliente:formData.get("cliente"),
            lote:formData.get("lote")
        }
        let status

        props.data? status=sendPut({id:props.data["id"],body:body})
            : status=sendPost({body:body})

        console.log(status) //200 Put, 201 Post
    }

    function sendPut(props){
        return Put({
            url: "etiquetas",
            id: props.id,
            body: props.body
        })
    }

    function sendPost(props){
        // Component Call
        return <Post
            url="etiquetas"
            body={props.body}
        />

        /*        // Function call
                return Post({
                    url: "etiquetas",
                    body: props.body
                })*/
    }

    function fieldsForm(){
        return (
            <>
                <label>Id</label>
                <input disabled={true} value={null}></input>
                <br/><br/>
                <label>Cliente</label>
                <select name="cliente" defaultValue="default">
                    <option value="default">--Seleccione un Cliente--</option>
                    {
                        clientes.map(cliente=>(
                            <option value={cliente.cif}>{cliente.nombre}</option>
                        ))
                    }
                </select>
                <br/><br/>
                <label>Lote</label>
                <select name="lote" defaultValue="default">
                    <option value="default">--Seleccione un Lote--</option>
                    {
                        lotes.map(lote=>(
                            <option value={lote.id}>{lote.id}</option>
                        ))
                    }
                </select>

                <br/><br/>
            </>
        )
    }


    return (
        <form action={submitForm}>
            {fieldsForm()}
            <button>Enviar</button>
        </form>
    )
}