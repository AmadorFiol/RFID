import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Clientes from './pages/Clientes'
import Lotes from './pages/Lotes'
import Etiquetas from './pages/Etiquetas'
import getZpl from "./services/zpl.js";
import Inventarios from "./pages/Inventarios.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Login from "./pages/Login.jsx"
import MainPage from "./pages/MainPage.jsx";

/* TODO: ✖ ✔
*   API:
*       Crear tablas, entidades, etc de Rol y Page
*       Crear tablas, entidades, etc de Plantilla y Pedido -- Baja prioridad --
*       Crear endpoints Plantilla y Pedido (A pedido también PedidoByUsuario) -- Baja prioridad --
*   .
*   Pantallas:
*       Pantallas Usuario-Admin:
*           En el CRUD
*               Pages de Rol y Page
*               Pages de Plantilla y Pedido
*           Pantalla comenzar impresión
*               Como agregar varios archivos?
*           Pantalla pedidos impresión
*               pedido = {cantidad, plantillaAdjunta, user, }
*       ..
*       Pantallas Usuario-NoAdmin:
*           Creación plantilla etiqueta => Plantilla se descarga
*           Pedir impresión etiquetas => Crear pedido
*           CRUD especifico etiquetas y clientes del user
*   .
*   Para native => Node.js O Express
*   .
*   El pedido,
*       Como nos llega la info a poner en la plantilla?
*       Creamos una tabla pedidos?
* */

export default function App() {
    const [loggedUser,setLoggedUser]= useState(null)

/*    //Test ZPL
    console.log(getZpl({
        width: 200,
        height : 300,
        text : "pepito palotes"
    }))*/

    return (
        <>
            {!loggedUser? <Login setLoggedUser={setLoggedUser}/>:<MainPage/>}

            <ToastContainer
                pauseOnHover={false}
                theme="dark"
            />
        </>
    )
}
