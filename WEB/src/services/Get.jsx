import {useEffect, useState} from "react";
import axios from "axios";

export default function Get(props) {
    const [data, setData] = useState();
    const urlBase = "http://127.0.0.1:8080/api"
    useEffect(() => {
        axios.get(urlBase+"/"+props.url+(props.id? "/"+props.id:""))
            .then(res => {
                console.log("AxiosGet:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, [props.url,props.id]);

    return data
}