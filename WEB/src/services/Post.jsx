import {useEffect, useState} from "react";
import axios from "axios";

export default function Post(props) {
    const [data, setData] = useState();
    const urlBase = "http://127.0.0.1:8080/api"
    useEffect(() => {
        axios.post(urlBase+"/"+props.url,props.body)
            .then(res => {
                console.log("AxiosPost:",res.status)    //201
                setData({"status": res.status})
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return data
}