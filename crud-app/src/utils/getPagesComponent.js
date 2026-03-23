import Clientes from "../pages/Clientes.jsx";
import Etiquetas from "../pages/Etiquetas.jsx";
import Inventarios from "../pages/Inventarios.jsx";
import Lotes from "../pages/Lotes.jsx";
import Usuarios from "../pages/Usuarios.jsx";

export const getPagesComponent = (pageName)=>{
    switch (pageName) {
        case "clientes":
            return Clientes
        case "etiquetas":
            return Etiquetas
        case "inventarios":
            return Inventarios
        case "lotes":
            return Lotes
        case "usuarios":
            return Usuarios
        default:
            console.log("Componente no encontrado")
            break
    }
}