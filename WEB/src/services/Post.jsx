import {useEffect, useState} from "react";
import axios from "axios";

export default function Post(props) {
    const [data, setData] = useState({info:"Default"});
    const urlBase = "http://127.0.0.1:8080/api"
    useEffect(() => {
        axios.post(urlBase+"/"+props.url,props.body)
            .then(res => {
                console.log("ResDataPost:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return data
}