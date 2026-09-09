import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/home'
import Topo from './Componentes/Topo/topo'

function App() {
  return(
  <>
  <BrowserRouter>
    <Topo />
    <Routes>
        <Route path='/' element={<Home/>}></Route>
    </Routes>
  </BrowserRouter>
    </>
  )
}
export default App
