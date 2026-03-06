import logo from '../assets/logo.png'
export default function Navbar() {
    return(
        <header>
            <nav>
                <img src={logo} alt="Logo"/>
                  <ul>
                    <li>Inicio</li>
                    <li>Lotes</li>
                    <li>Clientes</li>
                    <li>Etiquetas</li>
                  </ul>
            </nav>
        </header>
    )
}