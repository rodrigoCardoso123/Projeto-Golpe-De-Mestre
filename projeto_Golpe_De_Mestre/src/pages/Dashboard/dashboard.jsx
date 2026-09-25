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
import DiarioDeAula from "../../Componentes/Dashboard_Diário_De_Aula/Diario_de_aula";
import Presenca from "../../Componentes/Dashboard_Presença/Presenca";
import Faixas from "../../Componentes/Dashboard_faixas/faixas";
import Atividades from "../../Componentes/Dashboard_Atividades/atividades";
import Comunicados from "../../Componentes/Dashboard_Comunicados/comunicados";
import Solicitacoes from "../../Componentes/Dashboard_Solicitações/solicitacoes";
import Visitas from "../../Componentes/Dashboard_Visitas/visitas";
import Relatorios from "../../Componentes/Dashboard_Relatorios/relatorios";
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
                    <Route path="diario" element={<DiarioDeAula/>} />
                    <Route path="presenca" element={<Presenca/>} />
                    <Route path="desenvolvimento" element={<Faixas/>} />
                    <Route path="atividades" element={<Atividades/>} />
                    <Route path="comunicados" element={<Comunicados/>} />
                    <Route path="solicitacoes" element={<Solicitacoes/>} />
                    <Route path="relatorios" element={<Relatorios/>} />
                    <Route path="visitas" element={<Visitas/>} />
                </Routes>
            </main>
        </div>
        </>
    )
}
export default Dashboard;