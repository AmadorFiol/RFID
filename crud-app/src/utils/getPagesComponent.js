import Clientes from "../pages/Admin/Clientes.jsx"
import Etiquetas from "../pages/Admin/Etiquetas.jsx"
import Inventarios from "../pages/Admin/Inventarios.jsx"
import Lotes from "../pages/Admin/Lotes.jsx"
import Paginas from "../pages/Admin/Paginas.jsx"
import Pedidos from "../pages/Admin/Pedidos.jsx"
import Plantillas from "../pages/Admin/Plantillas.jsx"
import Roles from "../pages/Admin/Roles.jsx"
import Usuarios from "../pages/Admin/Usuarios.jsx"

import ClientesComun from "../pages/Comun/Clientes.jsx"
import EtiquetasComun from "../pages/Comun/Etiquetas.jsx"
import PedidosComun from "../pages/Comun/Pedidos.jsx"
import PlantillasComun from "../pages/Comun/Plantillas.jsx"

export const getPagesComponent = (pageId)=>{
    switch (pageId) {
        case 102:
            return Clientes
        case 103:
            return Etiquetas
        case 104:
            return Inventarios
        case 105:
            return Lotes
        case 106:
            return Paginas
        case 153:
            return Pedidos
        case 152:
            return Plantillas
        case 107:
            return Roles
        case 108:
            return Usuarios
        case 202:
            return ClientesComun
        case 203:
            return EtiquetasComun
        case 252:
            return PedidosComun
        case 204:
            return PlantillasComun
        default:
            console.error(`[ERROR 404] Componente para pagina con id ${pageId} no encontrado`)
            break
    }
}