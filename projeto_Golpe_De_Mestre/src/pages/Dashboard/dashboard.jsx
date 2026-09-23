import estilo from "./dashboard.module.css"
import { Routes, Route } from "react-router-dom";
import SideBar from "../../Componentes/SideBar/sidebar";
import VisaoGeral from "../../Componentes/Dashboard_Visão_Geral/visaoGeral";
import Inscricao_matricula from "../../Componentes/Dashboard_Inscrições_matricula/inscricao_matricula";
import Nova_Inscricao from "../../Componentes/Dashboard_Nova_Inscrição/Nova_Inscricao";
import Aluno from "../../Componentes/Dashboard_Alunos/aluno";
function Dashboard(){
    return(
        <>
        <div className={estilo.container_principal}>
            <SideBar/>

            <main className={estilo.dashboard}>
                <Routes>
                    <Route path="/" element={<VisaoGeral/>} />
                    <Route path="Inscricao_matricula" element={<Inscricao_matricula/>} />
                    <Route path="Nova_Inscricao" element={<Nova_Inscricao/>} />
                    <Route path="Aluno" element={<Aluno/>} />
                </Routes>
            </main>
        </div>
        </>
    )
}
export default Dashboard;