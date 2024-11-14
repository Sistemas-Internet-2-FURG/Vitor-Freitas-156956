import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem('token'); // Verifica o token no localStorage

  if (!token) {
    // Se não há token, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se há token, renderiza a página solicitada
  return children;
}

export default ProtectedRoute;
