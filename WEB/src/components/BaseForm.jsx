import FormClientes from "./Forms/FormClientes.jsx";
import FormEtiquetas from "./Forms/FormEtiquetas.jsx";
import FormLotes from "./Forms/FormLotes.jsx";

export function BaseForm(props) {
    return (
        <>
            {
                {
                    "clientes": <FormClientes data={props.data}/>,
                    "etiquetas": <FormEtiquetas data={props.data}/>,
                    "lotes": <FormLotes data={props.data}/>
                }[props.class]
            }
        </>
    )
}