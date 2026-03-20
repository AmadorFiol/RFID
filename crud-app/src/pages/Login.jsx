import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { usuariosApi } from '../services/api'

const EMPTY = {
    email: '',
    password: '',
}

export default function Login(){
    const [logUser,setLog]= useState()
    const [form, setForm] = useState(EMPTY)

    const buildBody = () => ({
        email: form.email,
        password: form.password,
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
              const res = await usuariosApi.getLogin(buildBody())
              setLog(res.data??null)
              toast.success(`¡Bienvenido "${logUser.nombre}"!`)
        } catch (e) {
            toast.error(`Error: ${e.message}`)
        }
    }


    return(
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <label>Email</label>
                <input
                    type={"email"}
                    maxLength={64}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={"Email"}
                    required
                /><br/>
                <label>Contraseña</label>
                <input
                    type={"password"}
                    maxLength={64}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={"Contraseña"}
                    required
                /><br/>
                <button type={"submit"}>ggh</button>
            </form >
        </div>
    )

}