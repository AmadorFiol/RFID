import {Form} from "./Form.jsx";
import Popup from "reactjs-popup";
import Add from "../assets/add.svg"

export default function TableHead({headers}) {
    return(
        <thead>
        <tr>
            {headers.map(header=>
                <th>{header}</th>
            )}
            <th>
                <Popup trigger={<button><img src={Add} alt="add" /></button>} modal>
                    <Form />
                </Popup>
            </th>
        </tr>
        </thead>
    )
}