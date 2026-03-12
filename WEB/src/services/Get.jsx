import {useEffect, useState} from "react";
import axios from "axios";

export default function Get({url,id}) {
    const [data, setData] = useState();
    const fullUrl = "http://127.0.0.1:8080/api/"+url+(id? "/"+id:"")

    useEffect(() => {
        axios.get(fullUrl)
            .then(res => {
                console.log("AxiosGet:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, [fullUrl]);

    return data
}