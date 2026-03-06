import Navbar from "./components/Navbar.jsx";
import {useEffect, useState} from "react";
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
            {
                {
                    "clientes":<Clientes />,
                    "etiquetas":<Etiquetas />,
                    "lotes":<Lotes />
                }[page]
            }
        </>
    )

}