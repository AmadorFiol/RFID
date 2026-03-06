
export default function Table(props){
    const line = props.data[0]
    console.log("Line",line)
    console.log("LineAtrb",line.info)
    return(
        <table border={1}>
            <thead>
                <tr>
                    {props.headers.map(header=>
                        <th>{header}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {props.data.map(line => (
                    <tr>
                        <td>{line.cif}</td>
                        <td>{line.nombre}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}