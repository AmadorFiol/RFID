import Clientes from "../pages/Admin/Clientes.jsx"
import Etiquetas from "../pages/Admin/Etiquetas.jsx"
import Inventarios from "../pages/Admin/Inventarios.jsx"
import Paginas from "../pages/Admin/Paginas.jsx"
import Pedidos from "../pages/Admin/Pedidos.jsx"
import Plantillas from "../pages/Admin/Plantillas.jsx"
import Roles from "../pages/Admin/Roles.jsx"
import Usuarios from "../pages/Admin/Usuarios.jsx"
import Empleados from "../pages/Comun/Empleados.jsx";
import ClientesComun from "../pages/Comun/Clientes.jsx"
import EtiquetasComun from "../pages/Comun/Etiquetas.jsx"
import PedidosComun from "../pages/Comun/Pedidos.jsx"
import PlantillasComun from "../pages/Comun/Plantillas.jsx"
import Fichajes from "../pages/Comun/Fichajes.jsx";

export const getPagesComponent = (pageId)=>{
    switch (pageId) {
        case 1:
            return Paginas
        case 2:
            return Clientes
        case 3:
            return Etiquetas
        case 4:
            return Inventarios
        case 5:
            return Pedidos
        case 6:
            return Plantillas
        case 7:
            return Roles
        case 8:
            return Usuarios
        case 9:
            return ClientesComun
        case 10:
            return EtiquetasComun
        case 11:
            return PedidosComun
        case 12:
            return PlantillasComun
        case 13:
            return Empleados
        case 52:
            return Fichajes
        default:
            console.error(`[ERROR 404] Componente para pagina con id ${pageId} no encontrado`)
            break
    }
}