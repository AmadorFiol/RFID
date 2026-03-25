import { useState } from 'react'
import { toast } from 'react-toastify'
import { usuariosApi } from '../services/api'

const EMPTY = {
    email: '',
    password: '',
}

const DebugUser1 = { // User con rol Admin
    email: 'a@a',
    password: 'a'
}

const DebugUser2 = { // User con rol Comun
    email: 'b@b',
    password: 'b'
}

export default function Login({setLoggedUser}){
    const [form, setForm] = useState(DebugUser2)

    const buildBody = () => ({
        email: form.email,
        password: form.password,
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await usuariosApi.login(buildBody())
            setLoggedUser(res.data??null)
            toast.success(`Bienvenido "${form.email}"!`)
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }


    return(
        <div className="popup-overlay">
            <div className="popup-content">
                <p className="popup-title">/login</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            maxLength={64}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            //required
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            maxLength={64}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            //required
                            placeholder="Contraseña"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Iniciar Sesión
                        </button>
                    </div>
                </form >
            </div>
        </div>

    )
}