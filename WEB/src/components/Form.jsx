import {useContext} from "react";
import {PageContext} from "../App.jsx";
import Put from "../services/Put.jsx";
import Post from "../services/Post.jsx";
import FieldsClientes from "./FormFields/FieldsClientes.jsx";
import FieldsEtiquetas from "./FormFields/FieldsEtiquetas.jsx";
import FieldsLotes from "./FormFields/FieldsLotes.jsx";
import BodyConstructor from "../utils/BodyConstructor.jsx";
import IdGetter from "../utils/IdGetter.jsx";

/* TODO: ✖ ✔
*   Averiguar como hacer las llamadas a Post() o Put() según bool
* */
export function Form({data}) {

    const page = useContext(PageContext)

    function SubmitForm(formData){
        const hookCall = data? Put : Post
        const body = BodyConstructor(formData, page)
        const props = data? {url:page,id:IdGetter(data,page),body:body}:{url:page,body:body}

        const status = hookCall(props)
        console.log("Status",status) //200 Put, 201 Post
        return status
    }

    return (
        <form action={SubmitForm}>
            {
                {
                    "clientes": <FieldsClientes data={data}/>,
                    "etiquetas": <FieldsEtiquetas data={data}/>,
                    "lotes": <FieldsLotes data={data}/>
                }[page]
            }
            <button>Enviar</button>
        </form>
    )
}