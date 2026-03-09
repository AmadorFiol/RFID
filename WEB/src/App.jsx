import Navbar from "./components/Navbar.jsx";
import {useState} from "react";
import Clientes from "./pages/Clientes.jsx";
import Lotes from "./pages/Lotes.jsx";
import Etiquetas from "./pages/Etiquetas.jsx";

export default function App() {
    const [page,setPage] = useState()

    return(
        <>
            <Navbar
                pageChanger={setPage}
            />
            {//Funcion implicita con dependencia a page
                {
                    "clientes":<Clientes />,
                    "etiquetas":<Etiquetas />,
                    "lotes":<Lotes />
                }[page]
            }
        </>
    )

}