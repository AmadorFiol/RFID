import {Form} from "./Form.jsx";
import Edit from "../assets/edit.svg"
import Trash from "../assets/trash.svg"
import Popup from "reactjs-popup";
import IdGetter from "../utils/IdGetter.jsx";
import {useContext} from "react";
import {PageContext} from "../App.jsx";
import Delete from "../services/Delete.jsx";
import {toast} from "react-toastify";
import Get from "../services/Get.jsx";

export default function TableBody({data,atribs}){
    const page = useContext(PageContext)

    function parseObject(row,atrib){
        let obj=row[atrib]

        if(typeof obj == "object" && !(obj instanceof Array)) {
            //console.log(atrib)

            const res= atribMatcher(atrib)
            res? obj=obj[res]:null

        }

        return obj
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

    function deleteRow(id){
        toast.promise(
            Get({page, id}),
            {
                pending: 'Eliminando '+page+'con id'+id,
                success: 'Eliminado exitosamente',
                error: 'No se ha podido eliminar, ha ocurrido un error'
            }
        )
    }

    return (
        <tbody>
        {data.map(row => (
            <tr>
                {atribs.map(atrib =><td>{parseObject(row,atrib)}</td>)}
                <td> {/*Botones de accion*/}
                    <Popup trigger={<button><img src={Edit} alt="edit" /></button>} modal>
                        <Form data={row} />
                    </Popup>
                    {
                        /*
                        * TODO: ✖ ✔
                        *   Cambiar el <Popup /> por un toast que llame <Delete id={id}/>           ✔
                        *       De momento esta con un <Get/> para pruebas
                        *   .
                        *   Averiguar como pasarle el $row a la funcion sin llamarla al renderizar  ✔
                        *   .
                        *   Al llamar al <Delete/>|<Get/> error break Rules of Hook, mrd
                        *   -
                        *   Pq da error de Rules of Hook si no lo llamo desde un condicional??
                        * */
                    }
                    <button onClick={()=>deleteRow(IdGetter(row,page))}><img src={Trash} alt="trash" /></button>
                </td>
            </tr>
        ))}
        </tbody>
    )
}