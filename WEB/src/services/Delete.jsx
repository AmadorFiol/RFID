import {useEffect, useState} from "react";
import axios from "axios";

export default function Delete({url,id}) {
    const [data, setData] = useState();
    const fullUrl = "http://127.0.0.1:8080/api/"+url+(id? "/"+id:"")

    useEffect(() => {
        axios.delete(fullUrl)
            .then(res => {
                console.log("AxiosDel:",res.status)     //204
                setData({"status" : res.status})
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return data
}