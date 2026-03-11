import Put from "../../services/Put.jsx";
import Post from "../../services/Post.jsx";

export default function FormClientes(props){

    function submitForm(formData){
        const body = {
            cif:formData.get("id"),
            nombre:formData.get("nombre")
        }
        let status

        props.data? status=sendPut({id:props.data["cif"],body:body})
            : status=sendPost({body:body})

        console.log(status) //200 Put, 201 Post
    }

    function sendPut(props){
        //Component call
        return <Put
            url="clientes"
            id={props.id}
            body={props.body}
        />

/*        //Function call
        return Put({
            url: "clientes",
            id: props.id,
            body: props.body
        })*/
    }

    function sendPost(props){
        // Component call
        return <Post
            url="clientes"
            body={props.body}
        />

/*        // Function call
        return Post({
            url: "clientes",
            body: props.body
        })*/
    }

    function fieldsForm(){
        return (
            <>
                <label>Cif</label><br/>
                <input name="id"
                       defaultValue={props.data? props.data["cif"]:""}
                />
                <br/><br/>
                <label>Nombre</label><br/>
                <input name="nombre"
                       defaultValue={props.data? props.data["nombre"]:""}
                />
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