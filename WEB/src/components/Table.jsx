import TableHead from "./TableHead.jsx";
import TableBody from "./TableBody.jsx";

export default function Table({data,atribs}){
    return(
        <table border={1}>
            <TableHead
                headers={atribs}
            />
            <TableBody
                data={data}
                atribs={atribs}
            />
        </table>
    )
}