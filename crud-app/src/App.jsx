import {createContext, useState} from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from "./pages/Login.jsx"
import MainPage from "./pages/MainPage.jsx";

/* TODO: ✖ ✔
*   API:
*       Crear tablas, entidades, etc de Plantilla y Pedido -- Baja prioridad --
*       Crear endpoints Plantilla y Pedido (A pedido también PedidoByUsuario) -- Baja prioridad --
*   .
*   Pantallas:
*       Pantallas Usuario-Admin:
*           En el CRUD
*               Pages de Plantilla y Pedido
*           Pantalla comenzar impresión
*               Como agregar varios archivos?
*           Pantalla pedidos impresión
*               pedido = {cantidad, plantillaAdjunta, user, }
*       ..
*       Pantallas Usuario-NoAdmin:
*           Creación plantilla etiqueta => Plantilla se descarga
*           Pedir impresión etiquetas => Crear pedido
*   .
*   Para native => Node.js O Express
*   .
* */

export const UserContext = createContext(null)

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
            {loggedUser?
                <UserContext value={loggedUser}>
                    <MainPage/>
                </UserContext>
                : <Login setLoggedUser={setLoggedUser} />}

            <ToastContainer
                pauseOnHover={false}
                theme="dark"
            />
        </>
    )
}
