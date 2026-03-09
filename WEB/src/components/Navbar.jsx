import logo from '../assets/react.svg'

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