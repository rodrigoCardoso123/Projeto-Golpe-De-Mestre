import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/home'
import Topo from './Componentes/Topo/topo'
import Login from './pages/login/login'
import Dashboard from './pages/Dashboard/dashboard'
import { AuthProvider } from './lib/auth'
import { RotaPrivada } from './Componentes/RotaPrivada/rotaPrivada'
function Rotas() {
  const location = useLocation();

  const esconderTopo = 
  location.pathname === '/Login' ||
  location.pathname.startsWith('/Dashboard');

  return (
    <>
      {!esconderTopo && <Topo />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Dashboard/*"
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          }
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App