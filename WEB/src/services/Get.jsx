import {useEffect, useState} from "react";
import axios from "axios";

export default function Get(props) {
    const [data, setData] = useState({info:"Default"});
    useEffect(() => {
        axios.get(props.url+(props.id? "/"+props.id:""))
            .then(res => {
                console.log("ResDataGet:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, [props.url,props.id]);

    return data
}