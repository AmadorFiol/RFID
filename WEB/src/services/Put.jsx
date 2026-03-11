import {useEffect, useState} from "react";
import axios from "axios";

export default function Put(props) {
    const [data, setData] = useState();
    const urlBase = "http://127.0.0.1:8080/api"
    useEffect(() => {
        axios.put(urlBase+"/"+props.url+(props.id? "/"+props.id:""),props.body)
            .then(res => {
                console.log("AxiosPost:",res.status)    //200
                setData({"status": res.status})
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return data
}