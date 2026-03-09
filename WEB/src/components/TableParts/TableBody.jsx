import Form from "../Form.jsx";
import Edit from "../../assets/edit.svg"
import Trash from "../../assets/trash.svg"
import Popup from "reactjs-popup";

export default function TableBody(props){

    function parseObject(line,atrib){
        let obj=line[atrib]

        if(typeof obj == "object" && !(obj instanceof Array)) {
            console.log(atrib)

            const res= atribMatcher(atrib)
            res? obj=obj[res]:null

        }

        return <td>{obj}</td>
    }

    function atribMatcher(atrib){

        switch (atrib){
            case "cliente":
                return "nombre"

            case "lote":
                return "id"

            default:
                console.log("Case para "+atrib+" no encontrado")
                break
        }
    }

    return (
        <tbody>
        {props.data.map(line => (
            <tr>
                {props.atribs.map(atrib =>parseObject(line,atrib))}

                <td> {/*Botones de accion*/null}
                    <Popup trigger={<button><img src={Edit} alt="edit" /></button>} modal>
                        <Form
                            action="edit"
                            atribs={props.atribs}
                            class={props.class}
                        />
                    </Popup>
                    <Popup trigger={<button><img src={Trash} alt="trash" /></button>} modal>
                        <h1>Eliminado</h1>
                    </Popup>
                </td>
            </tr>
        ))}
        </tbody>
    )
}