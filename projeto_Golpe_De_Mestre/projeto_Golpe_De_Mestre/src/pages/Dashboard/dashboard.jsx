import estilo from "./dashboard.module.css"
import { Routes, Route } from "react-router-dom";
import SideBar from "../../Componentes/SideBar/sidebar";
import VisaoGeral from "../../Componentes/Dashboard_Visão_Geral/visaoGeral";
import Inscricoes from "../../Componentes/Dashboard_Inscricoes/inscricoes";
import NovaInscricao from "../../Componentes/Dashboard_Inscricoes/novaInscricao";
import Alunos from "../../Componentes/Dashboard_Alunos/alunos";
function Dashboard(){
    return(
        <>
        <div className={estilo.container_principal}>
            <SideBar/>

            <main className={estilo.dashboard}>
                <Routes>
                    <Route path="/" element={<VisaoGeral/>} />
                    <Route path="inscricoes" element={<Inscricoes/>} />
                    <Route path="inscricoes/nova" element={<NovaInscricao/>} />
                    <Route path="alunos" element={<Alunos/>} />
                </Routes>
            </main>
        </div>
        </>
    )
}
export default Dashboard;