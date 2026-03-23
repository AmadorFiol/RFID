import {useState} from "react";
import {getPagesComponent} from "../utils/getPagesComponent.js";

const pagesName = [ //Esto se cambiara por el getByUsuario
    "clientes",
    "etiquetas",
    "inventarios",
    "lotes",
    "usuarios",
    "paginas",
    "roles"
]

let PAGES = [];

pagesName.map(pageName=> PAGES.push({
    key: pageName,
    component: getPagesComponent(pageName)
}))


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
                        {p.component.name}
                    </button>
                ))}
            </nav>

            {ActiveComponent && <ActiveComponent />}
        </>
    )
}