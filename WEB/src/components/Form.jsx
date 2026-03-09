import Post from "../services/Post.jsx";
import Put from "../services/Put.jsx";

export default function Form(props){

    return (
        <>
            <h1>{props.action} {props.class}</h1>
            {props.atribs.map(atrib=>
                <p>{atrib}</p>
            )}
            <button>{props.action}</button>
        </>
    )
}