import {useState} from "react";
import Clientes from "./Clientes.jsx";
import Etiquetas from "./Etiquetas.jsx";
import Inventarios from "./Inventarios.jsx";
import Lotes from "./Lotes.jsx";
import Usuarios from "./Usuarios.jsx";

const PAGES = [
    { key: 'clientes', label: 'Clientes', component: Clientes },
    { key: 'etiquetas', label: 'Etiquetas', component: Etiquetas },
    { key: 'inventarios', label: 'Inventarios', component: Inventarios},
    { key: 'lotes', label: 'Lotes', component: Lotes },
    { key: 'usuarios',label: 'Usuarios', component: Usuarios},
]

export default function MainPage(){
    const [activePage, setActivePage] = useState('')
    const ActiveComponent = PAGES.find((p) => p.key === activePage)?.component

    return(
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
        </>
    )
}