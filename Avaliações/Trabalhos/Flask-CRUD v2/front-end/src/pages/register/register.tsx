import { useState } from "react";
import "./register.css"
import { RegisterRequest } from "../../requests/register.request";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event: any) => {
    event.preventDefault();
    try {
      const result = await RegisterRequest(name, username, password)
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

  return (
    <div>
      <form onSubmit={handleRegister}>
        <div className="form_input">
          <h1>Register</h1>
          <div className="display">
            <p>Name</p>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(event) => { setName(event.target.value) }}
              required
              placeholder="Digite seu nome"
            />
          </div>
          <div className="display">
            <p>Username</p>
            <input
              type="text"
              id="username"
              name="username"
              onChange={(event) => { setUsername(event.target.value) }}
              required
              placeholder="Digite seu nome de usua..."
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
        <span> Já tem conta? <a href="/login">Entrar.</a> </span>
      </div>
    </div>
  )
}
