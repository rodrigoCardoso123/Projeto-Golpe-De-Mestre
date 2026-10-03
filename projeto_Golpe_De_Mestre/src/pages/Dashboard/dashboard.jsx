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
import Doacoes from "../../Componentes/Dashboard_Doações/Doacoes";
import Financeiro from "../../Componentes/Dashboard_Financeiro/Financeiro";
import Apoiadores from "../../Componentes/Dashboard_Apoiadores/Apoiadores";
import Equipe_e_Acesso from "../../Componentes/Dashboard_Equipe_e_Acesso/Equipe_e_Acesso";
import NovoAcesso from "../../Componentes/Dashboard_Novo_Acesso/novoAcesso";
import Configuracao from "../../Componentes/Dashboard_Configurações/Configuração";
import { SomenteCargos } from "../../Componentes/RotaPrivada/rotaPrivada";

// Envolve a tela na guarda de cargo correspondente. O nome da área bate com o
// mapa em src/lib/permissoes.js — se divergir, a rota fica bloqueada para todos.
function Protegida({ area, children }) {
  return <SomenteCargos area={area}>{children}</SomenteCargos>;
}

function Dashboard(){
    return(
        <>
        <div className={estilo.container_principal}>
            <SideBar/>

            <main className={estilo.dashboard}>
                <Routes>
                    <Route path="/" element={<Protegida area="visaoGeral"><VisaoGeral/></Protegida>} />
                    <Route path="inscricoes" element={<Protegida area="inscricoes"><Inscricoes/></Protegida>} />
                    <Route path="inscricoes/nova" element={<Protegida area="novaInscricao"><NovaInscricao/></Protegida>} />
                    <Route path="alunos" element={<Protegida area="alunos"><Alunos/></Protegida>} />
                    <Route path="alunos/novo" element={<Protegida area="novoAluno"><NovoAluno/></Protegida>} />
                    <Route path="alunos/perfil/:id" element={<Protegida area="alunos"><PerfilAluno/></Protegida>} />
                    <Route path="alunos/perfil/:id/editar" element={<Protegida area="editarAluno"><EditarAluno/></Protegida>} />
                    <Route path="alunos/perfil" element={<Navigate to="/Dashboard/alunos" replace/>} />
                    <Route path="alunos/perfil/editar" element={<Navigate to="/Dashboard/alunos" replace/>} />
                    <Route path="turmas" element={<Protegida area="turmas"><Turmas/></Protegida>} />
                    <Route path="diario" element={<Protegida area="diario"><DiarioDeAula/></Protegida>} />
                    <Route path="presenca" element={<Protegida area="presenca"><Presenca/></Protegida>} />
                    <Route path="desenvolvimento" element={<Protegida area="desenvolvimento"><Faixas/></Protegida>} />
                    <Route path="atividades" element={<Protegida area="atividades"><Atividades/></Protegida>} />
                    <Route path="comunicados" element={<Protegida area="comunicados"><Comunicados/></Protegida>} />
                    <Route path="solicitacoes" element={<Protegida area="solicitacoes"><Solicitacoes/></Protegida>} />
                    <Route path="relatorios" element={<Protegida area="relatorios"><Relatorios/></Protegida>} />
                    <Route path="visitas" element={<Protegida area="visitas"><Visitas/></Protegida>} />
                    <Route path="doacoes" element={<Protegida area="doacoes"><Doacoes/></Protegida>} />
                    <Route path="financeiro" element={<Protegida area="financeiro"><Financeiro/></Protegida>} />
                    <Route path="apoiadores" element={<Protegida area="apoiadores"><Apoiadores/></Protegida>} />
                    <Route path="equipe" element={<Protegida area="equipe"><Equipe_e_Acesso/></Protegida>} />
                    <Route path="equipe/novo" element={<Protegida area="novoAcesso"><NovoAcesso/></Protegida>} />
                    <Route path="configuracoes" element={<Protegida area="configuracoes"><Configuracao/></Protegida>} />
                    <Route path="*" element={<Navigate to="/Dashboard" replace/>} />
                </Routes>
            </main>
        </div>
        </>
    )
}
export default Dashboard;