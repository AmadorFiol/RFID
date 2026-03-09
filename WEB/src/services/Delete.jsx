import {useEffect, useState} from "react";
import axios from "axios";

export default function Delete(props) {
    const [data, setData] = useState({info:"Default"});
    const urlBase = "http://127.0.0.1:8080/api"
    useEffect(() => {
        axios.delete(urlBase+"/"+props.url+(props.id? "/"+props.id:""))
            .then(res => {
                console.log("ResDataDel:",res.status)
                setData({"status" : res.status})
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return data
}