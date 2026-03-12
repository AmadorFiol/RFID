/**
 *
 * @param data
 * @param page
 * @returns {{id: *, fechaImpresion: *}|{id: *, cliente: *, lote: *}|{cif: *, nombre: *}}
 * @constructor
 */
export default function BodyConstructor(data, page){
    switch(page){
        case "clientes":
            return {
                cif:data.get("cif"),
                nombre:data.get("nombre")
            }
        case "etiquetas":
            return {
                id:data.get("id"),
                cliente:data.get("cliente"),
                lote:data.get("lote")
            }
        case "lotes":
            return {
                id:data.get("id"),
                fechaImpresion:data.get("fechaImpresion")
            }
        default:
            console.log("[WARN]: Body no encontrado para",page)
    }
}