import Table from "./Table.jsx";
import Get from "../services/Get.jsx";

export default function Body(props) {

    //Refactored
    console.log("Page",props.page)
    let data = Get({url: props.page})

    data instanceof Array? data:[data]

    return (
        <>
            {
                data && <Table
                    data={data}
                    atribs={Object.keys(data[0])}
                    class={props.page}
                />
            }
        </>
    )
}
