import TableHead from "./TableParts/TableHead.jsx";
import TableBody from "./TableParts/TableBody.jsx";

export default function Table(props){
    return(
        <table border={1}>
            <TableHead
                headers={props.atribs}
                class={props.class}
            />
            <TableBody
                data={props.data}
                atribs={props.atribs}
                class={props.class}
            />
        </table>
    )
}