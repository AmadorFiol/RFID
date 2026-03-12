import {useEffect, useState} from "react";
import axios from "axios";

export default function Post({url,body}) {
    const [data, setData] = useState();
    const fullUrl = "http://127.0.0.1:8080/api/"+url

    useEffect(() => {
        axios.post(fullUrl,body)
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