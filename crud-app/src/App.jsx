import {createContext, useState} from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from "./pages/Login.jsx"
import MainPage from "./pages/MainPage.jsx";

/* TODO: ✖ ✔
*   API/DB:
*       Crear tabla/entidad info_pedido {id,id_pedido,data}
*       Agregar campo {id_lote} a Pedido
*       Agregar campo {nombre} a Plantilla
*   .
*   Pantallas:
*       Pantallas Usuario-Admin:
*           Pantalla realizar impresión
*           Crear pages Plantillas y Pedidos en condiciones
*       ..
*       Pantallas Usuario-NoAdmin:
*           Creación plantilla etiqueta
*           Crear pedido etiquetas
*   .
*   Para native => Next.js O Express
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
