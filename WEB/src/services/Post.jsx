import {useEffect, useState} from "react";
import axios from "axios";

export default function Post(props) {
    const [data, setData] = useState({info:"Default"});

    useEffect(() => {
        axios.post(props.url,props.body)
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