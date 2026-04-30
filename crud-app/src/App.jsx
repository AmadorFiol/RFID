import {createContext, useState} from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from "./pages/Login.jsx"
import MainPage from "./pages/MainPage.jsx";

/* TODO_SYMBOLS: ✖ ✔ */

/* TODO:
*   Si un tag no se lee por 1s eliminar de lista (Comprobar que tanto tiempo ha pasado desde lastSeen)
*   Solucionar problema de condición de carrera en el guardado de tags leídos (hook/useRfid y pages/RfidReader)
* */

export const UserContext = createContext(null)

export default function App() {
    const [loggedUser,setLoggedUser]= useState(null)

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
