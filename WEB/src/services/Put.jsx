import {useEffect, useState} from "react";
import axios from "axios";

export default function Put(props) {
    const [data, setData] = useState({info:"Default"});

    useEffect(() => {
        axios.put(props.url+(props.id? props.id:""),props.body)
            .then(res => {
                console.log("ResDataPut:",res.data)
                setData(res.data)
            })
            .catch(error => {
                console.error(error.toJSON());
            });
    }, []);

    return data
}