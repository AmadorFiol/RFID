import logo from '../assets/logo.png'

export default function Navbar(props) {
    return(
        <header>
            <nav>
                <img src={logo} alt="Logo"/>
                <button onClick={()=>props.pageChanger("clientes")}>Clientes</button>
                <button onClick={()=>props.pageChanger("etiquetas")}>Etiquetas</button>
                <button onClick={()=>props.pageChanger("lotes")}>Lotes</button>
            </nav>
        </header>
    )
}