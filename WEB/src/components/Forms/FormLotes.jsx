import Put from "../../services/Put.jsx";
import Post from "../../services/Post.jsx";

export default function FormLotes(props){

    function submitForm(formData){
        const body = {
            id:formData.get("id"),
            fechaImpresion:formData.get("fechaImpresion")
        }
        let status

        props.data? status=sendPut({id:props.data["id"],body:body})
            : status=sendPost({body:body})

        console.log(status) //200 Put, 201 Post
    }

    function sendPut(props){
        return Put({
            url: "lotes",
            id: props.id,
            body: props.body
        })
    }

    function sendPost(props){
        // Component Call
        // (return Symbol(react.transitional.element), eso que es??)
        return <Post
            url="lotes"
            body={props.body}
        />

        /*        // Function call
                return Post({
                    url: "lotes",
                    body: props.body
                })*/
    }

    function fieldsForm(){
        return (
            <>
                <label>Id</label><br/>
                <input name="id"
                       defaultValue={props.data? props.data["id"]:""}
                       disabled={true}
                />
                <br/><br/>
                <label>Fecha de impresion</label><br/>
                <input name="fechaImpresion"
                       defaultValue={props.data? props.data["fechaImpresion"]:""}
                       type="date"
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