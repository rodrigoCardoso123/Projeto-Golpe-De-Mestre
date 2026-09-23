import estilo from "./dashboard.module.css"
import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../../Componentes/SideBar/sidebar";
import VisaoGeral from "../../Componentes/Dashboard_Visão_Geral/visaoGeral";
import Inscricoes from "../../Componentes/Dashboard_Inscricoes/inscricoes";
import NovaInscricao from "../../Componentes/Dashboard_Inscricoes/novaInscricao";
import Alunos from "../../Componentes/Dashboard_Alunos/alunos";
import NovoAluno from "../../Componentes/Dashboard_Alunos/novoAluno";
import PerfilAluno from "../../Componentes/Dashboard_Alunos/perfilAluno";
import EditarAluno from "../../Componentes/Dashboard_Alunos/editarAluno";
import Turmas from "../../Componentes/Dashboard_Turmas/turmas";
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
                    <Route path="alunos/novo" element={<NovoAluno/>} />
                    <Route path="alunos/perfil/:id" element={<PerfilAluno/>} />
                    <Route path="alunos/perfil/:id/editar" element={<EditarAluno/>} />
                    <Route path="alunos/perfil" element={<Navigate to="/Dashboard/alunos" replace/>} />
                    <Route path="alunos/perfil/editar" element={<Navigate to="/Dashboard/alunos" replace/>} />
                    <Route path="turmas" element={<Turmas/>} />
                </Routes>
            </main>
        </div>
        </>
    )
}
export default Dashboard;