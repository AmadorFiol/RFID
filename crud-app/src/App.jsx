import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Clientes from './pages/Clientes'
import Lotes from './pages/Lotes'
import Etiquetas from './pages/Etiquetas'
import getZpl from "./services/zpl.js";
import Inventarios from "./pages/Inventarios.jsx";
import Usuarios from "./pages/Usuarios.jsx";

/* TODO: ✖ ✔
*   Eliminar campo usuarioCif de Etiquetas
*   .
*   Pantallas:
*       Generales:
*           Login Usuario
*       ..
*       Pantallas Usuario-Admin:
*           El CRUD General  ✔
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

const PAGES = [
    { key: 'clientes', label: 'Clientes', component: Clientes },
    { key: 'lotes', label: 'Lotes', component: Lotes },
    { key: 'etiquetas', label: 'Etiquetas', component: Etiquetas },
    { key: 'inventarios', label: 'Inventarios', component: Inventarios},
    { key: 'usuarios',label: 'Usuarios', component: Usuarios},
]

export default function App() {
    const [activePage, setActivePage] = useState('')
    const ActiveComponent = PAGES.find((p) => p.key === activePage)?.component

/*    //Test ZPL
    console.log(getZpl({
        width: 200,
        height : 300,
        text : "pepito palotes"
    }))*/

    return (
        <>
            <nav className="navbar">
                <span className="navbar-brand">CRUD-App</span>
                {PAGES.map((p) => (
                    <button
                        key={p.key}
                        className={`nav-btn${activePage === p.key ? ' active' : ''}`}
                        onClick={() => setActivePage(p.key)}
                    >
                        {p.label}
                    </button>
                ))}
            </nav>

            {ActiveComponent && <ActiveComponent />}

            <ToastContainer
                pauseOnHover={false}
                theme="dark"
            />
        </>
    )
}
