import Table from "./Table.jsx";
import Get from "../services/Get.jsx";
import {useContext} from "react";
import {PageContext} from "../App.jsx";

export default function Body() {

    let data = Get({url: useContext(PageContext)})

    if(!(data instanceof Array) && data instanceof Object) {data=[data]}

    return (
        <>
            {
                data && <Table
                    data={data}
                    atribs={Object.keys(data[0])}
                />
            }
        </>
    )
}
