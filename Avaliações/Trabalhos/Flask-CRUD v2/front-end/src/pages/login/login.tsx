import { useEffect, useState } from 'react'
import { LoginRequest } from '../../requests/login.request'
import './login.css'
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event: any) => {
        event.preventDefault();
        try {
            console.log(username, password)
            const result = await LoginRequest(username, password)
            if (result && result.access_token) {
                console.log(result)
                localStorage.setItem("token", result.access_token)
                alert(result.message)
                navigate("/")
                return
            }
            return
        }
        catch {
            return false
        }
    }

    useEffect(() => { }, [])

    return (
        <body>
            <div >
                <form onSubmit={handleLogin}>
                    <div className='form_input'>
                        <h1>Login</h1>
                        <div className="display">
                            <p>Username</p>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                onChange={(event) => { setUsername(event.target.value) }}
                                required
                                placeholder="Digite seu nome"
                            />
                        </div>
                        <div className="display">
                            <p>Password</p>
                            <input
                                id="password"
                                name="password"
                                onChange={(event) => { setPassword(event.target.value) }}
                                required
                                type="password"
                                placeholder="coxinha123"
                            />
                        </div>
                    </div>

                    <div className="form_submit">
                        <button type="submit">Enviar</button>
                    </div>
                </form>
                <div className="registerButton">
                    <span> Não tem conta? <a href="/register">Cadastre-se!</a> </span>
                </div>
            </div>
        </body>
    )
}
