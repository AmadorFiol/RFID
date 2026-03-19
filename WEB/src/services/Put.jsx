import {useEffect, useState} from "react";
import axios from "axios";

export default function Put({url,id,body}) {
    const [data, setData] = useState();
    const fullUrl = "http://127.0.0.1:8080/api/"+url+(id? "/"+id:"")

    useEffect(() => {
        axios.put(fullUrl,body)
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