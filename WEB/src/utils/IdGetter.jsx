/**
 *
 * @param data
 * @param page
 * @returns {*}
 * @constructor
 */
export default function IdGetter(data,page){
    switch (page){
        case "clientes":
            return data["cif"]
        case "etiquetas":
            return data["id"]
        case "lotes":
            return data["id"]
        default:
            console.log("[WARN]: Id no encontrado para",page)
    }
}