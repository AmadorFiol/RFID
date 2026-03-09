import Form from "../Form.jsx";
import Popup from "reactjs-popup";
import Add from "../../assets/add.svg"

export default function TableHead(props) {
    return(
        <thead>
        <tr>
            {props.headers.map(atrib=>
                <th>{atrib}</th>
            )}
            <th>
                <Popup trigger={<button><img src={Add} alt="add" /></button>} modal>
                    <Form
                        action="add"
                        atribs={props.headers}
                        class={props.class}
                    />
                </Popup>
            </th>
        </tr>
        </thead>
    )
}