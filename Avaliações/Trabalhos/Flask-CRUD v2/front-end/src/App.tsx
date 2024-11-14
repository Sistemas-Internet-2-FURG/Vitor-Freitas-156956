import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/home/home'
import { Login } from './pages/login/login'
import { Register } from './pages/register/register'
import ProtectedRoute from './protectedRoute'

function App() {

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
