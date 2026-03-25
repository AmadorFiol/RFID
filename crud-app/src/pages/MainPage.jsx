import {useContext, useEffect, useState} from "react";
import {getPagesComponent} from "../utils/getPagesComponent.js";
import {paginasApi} from "../services/api.js";
import {toast} from "react-toastify";
import {UserContext} from "../App.jsx";

export default function MainPage(){
    const [activePage, setActivePage] = useState('')
    const [navbar, setNavbar] = useState([])
    const user=useContext(UserContext)

    const load = async () => {
        try {
            let pages= []
            const res = await paginasApi.getByRol(user.rol.id)
            res.data.map((p) =>
                pages.push(
                    {key: p.id, nombre: p.nombre, component: getPagesComponent(p.id)}
                )
            )
            setNavbar(pages)
        } catch (e) {
            console.error(e.message)
            toast.error(`Error al cargar la navbar: ${e.message}`)
        }
    }

    useEffect(() => { load() }, [])

    const ActiveComponent = navbar.find((p) => p.key === activePage)?.component

    return(
        <>
            <nav className="navbar">
                <span className="navbar-brand">CRUD-App</span>
                {navbar.map((p) => (
                    <button
                        key={p.key}
                        className={`nav-btn${activePage === p.key ? ' active' : ''}`}
                        onClick={() => setActivePage(p.key)}
                    >
                        {p.nombre}
                    </button>
                ))}
            </nav>

            {ActiveComponent && <ActiveComponent />}
        </>
    )
}