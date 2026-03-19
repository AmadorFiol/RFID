import logo from '../assets/react.svg'

/**
 * @param setPage
 * @returns {React.JSX.Element}
 * @constructor
 */
export default function Navbar({setPage}) {
    return(
        <header>
            <nav>
                <img src={logo} alt="Logo"/>
                <button onClick={()=>setPage("clientes")}>Clientes</button>
                <button onClick={()=>setPage("etiquetas")}>Etiquetas</button>
                <button onClick={()=>setPage("lotes")}>Lotes</button>
            </nav>
        </header>
    )
}