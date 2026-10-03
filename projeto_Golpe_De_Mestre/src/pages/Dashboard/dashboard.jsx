import estilo from "./dashboard.module.css";
import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../../Componentes/SideBar/sidebar";
import VisaoGeral from "../../Componentes/Dashboard_Visão_Geral/visaoGeral";
import Inscricoes from "../../Componentes/Dashboard_Inscricoes/inscricoes";
import NovaInscricao from "../../Componentes/Dashboard_Inscricoes/novaInscricao";
import AnalisarInscricao from "../../Componentes/Dashboard_Inscricoes/AnalisarInscricao";
import Alunos from "../../Componentes/Dashboard_Alunos/alunos";
import NovoAluno from "../../Componentes/Dashboard_Alunos/novoAluno";
import PerfilAluno from "../../Componentes/Dashboard_Alunos/perfilAluno";
import EditarAluno from "../../Componentes/Dashboard_Alunos/editarAluno";
import Turmas from "../../Componentes/Dashboard_Turmas/turmas";
import NovaTurma from "../../Componentes/Dashboard_Turmas/NovaTurma";
import EditarTurma from "../../Componentes/Dashboard_Turmas/EditarTurma";
import PerfilTurma from "../../Componentes/Dashboard_Turmas/PerfilTurma";
import DiarioDeAula from "../../Componentes/Dashboard_Diário_De_Aula/Diario_de_aula";
import PlanejarAula from "../../Componentes/Dashboard_Diário_De_Aula/PlanejarAula";
import EditarAula from "../../Componentes/Dashboard_Diário_De_Aula/EditarAula";
import Presenca from "../../Componentes/Dashboard_Presença/Presenca";
import Faixas from "../../Componentes/Dashboard_faixas/faixas";
import Atividades from "../../Componentes/Dashboard_Atividades/atividades";
import NovaAtividade from "../../Componentes/Dashboard_Atividades/NovaAtividade";
import EditarAtividade from "../../Componentes/Dashboard_Atividades/EditarAtividade";
import Entregas from "../../Componentes/Dashboard_Atividades/Entregas";
import Comunicados from "../../Componentes/Dashboard_Comunicados/comunicados";
import NovoComunicado from "../../Componentes/Dashboard_Comunicados/NovoComunicado";
import EditarComunicado from "../../Componentes/Dashboard_Comunicados/EditarComunicado";
import Solicitacoes from "../../Componentes/Dashboard_Solicitações/solicitacoes";
import Visitas from "../../Componentes/Dashboard_Visitas/visitas";
import EditarVisita from "../../Componentes/Dashboard_Visitas/EditarVisita";
import Relatorios from "../../Componentes/Dashboard_Relatorios/relatorios";
import Doacoes from "../../Componentes/Dashboard_Doações/Doacoes";
import RegistrarDoacao from "../../Componentes/Dashboard_Doações/RegistrarDoacao";
import EditarDoacao from "../../Componentes/Dashboard_Doações/EditarDoacao";
import Financeiro from "../../Componentes/Dashboard_Financeiro/Financeiro";
import NovoLancamento from "../../Componentes/Dashboard_Financeiro/NovoLancamento";
import EditarLancamento from "../../Componentes/Dashboard_Financeiro/EditarLancamento";
import Apoiadores from "../../Componentes/Dashboard_Apoiadores/Apoiadores";
import NovoApoiador from "../../Componentes/Dashboard_Apoiadores/NovoApoiador";
import EditarApoiador from "../../Componentes/Dashboard_Apoiadores/EditarApoiador";
import Equipe_e_Acesso from "../../Componentes/Dashboard_Equipe_e_Acesso/Equipe_e_Acesso";
import PermissoesPerfil from "../../Componentes/Dashboard_Equipe_e_Acesso/PermissoesPerfil";
import NovoAcesso from "../../Componentes/Dashboard_Novo_Acesso/novoAcesso";
import Configuracao from "../../Componentes/Dashboard_Configurações/Configuração";
import { SomenteCargos } from "../../Componentes/RotaPrivada/rotaPrivada";

// Envolve a tela na guarda de cargo correspondente. O nome da área bate com o
// mapa em src/lib/permissoes.js — se divergir, a rota fica bloqueada para todos.
function Protegida({ area, children }) {
  return <SomenteCargos area={area}>{children}</SomenteCargos>;
}

function Dashboard() {
  return (
    <div className={estilo.container_principal}>
      <SideBar />

      <main className={estilo.dashboard}>
        <Routes>
          <Route path="/" element={<Protegida area="visaoGeral"><VisaoGeral /></Protegida>} />

          <Route path="inscricoes" element={<Protegida area="inscricoes"><Inscricoes /></Protegida>} />
          <Route path="inscricoes/nova" element={<Protegida area="novaInscricao"><NovaInscricao /></Protegida>} />
          <Route path="inscricoes/analise" element={<Protegida area="inscricoes"><AnalisarInscricao /></Protegida>} />

          <Route path="alunos" element={<Protegida area="alunos"><Alunos /></Protegida>} />
          <Route path="alunos/novo" element={<Protegida area="novoAluno"><NovoAluno /></Protegida>} />
          <Route path="alunos/perfil/:id" element={<Protegida area="alunos"><PerfilAluno /></Protegida>} />
          <Route path="alunos/perfil/:id/editar" element={<Protegida area="editarAluno"><EditarAluno /></Protegida>} />
          <Route path="alunos/perfil" element={<Navigate to="/Dashboard/alunos" replace />} />
          <Route path="alunos/perfil/editar" element={<Navigate to="/Dashboard/alunos" replace />} />

          <Route path="turmas" element={<Protegida area="turmas"><Turmas /></Protegida>} />
          <Route path="turmas/nova" element={<Protegida area="novaTurma"><NovaTurma /></Protegida>} />
          <Route path="turmas/editar" element={<Protegida area="editarTurma"><EditarTurma /></Protegida>} />
          <Route path="turmas/perfil" element={<Protegida area="turmas"><PerfilTurma /></Protegida>} />

          <Route path="diario" element={<Protegida area="diario"><DiarioDeAula /></Protegida>} />
          <Route path="diario/nova" element={<Protegida area="diario"><PlanejarAula /></Protegida>} />
          <Route path="diario/editar" element={<Protegida area="diario"><EditarAula /></Protegida>} />

          <Route path="presenca" element={<Protegida area="presenca"><Presenca /></Protegida>} />
          <Route path="desenvolvimento" element={<Protegida area="desenvolvimento"><Faixas /></Protegida>} />

          <Route path="atividades" element={<Protegida area="atividades"><Atividades /></Protegida>} />
          <Route path="atividades/nova" element={<Protegida area="atividades"><NovaAtividade /></Protegida>} />
          <Route path="atividades/editar" element={<Protegida area="atividades"><EditarAtividade /></Protegida>} />
          <Route path="atividades/entregas" element={<Protegida area="atividades"><Entregas /></Protegida>} />

          <Route path="comunicados" element={<Protegida area="comunicados"><Comunicados /></Protegida>} />
          <Route path="comunicados/nova" element={<Protegida area="comunicados"><NovoComunicado /></Protegida>} />
          <Route path="comunicados/editar" element={<Protegida area="comunicados"><EditarComunicado /></Protegida>} />

          <Route path="solicitacoes" element={<Protegida area="solicitacoes"><Solicitacoes /></Protegida>} />
          <Route path="relatorios" element={<Protegida area="relatorios"><Relatorios /></Protegida>} />

          <Route path="visitas" element={<Protegida area="visitas"><Visitas /></Protegida>} />
          <Route path="visitas/editar" element={<Protegida area="visitas"><EditarVisita /></Protegida>} />

          <Route path="doacoes" element={<Protegida area="doacoes"><Doacoes /></Protegida>} />
          <Route path="doacoes/nova" element={<Protegida area="doacoes"><RegistrarDoacao /></Protegida>} />
          <Route path="doacoes/editar" element={<Protegida area="doacoes"><EditarDoacao /></Protegida>} />

          <Route path="financeiro" element={<Protegida area="financeiro"><Financeiro /></Protegida>} />
          <Route path="financeiro/novo" element={<Protegida area="financeiro"><NovoLancamento /></Protegida>} />
          <Route path="financeiro/editar" element={<Protegida area="financeiro"><EditarLancamento /></Protegida>} />

          <Route path="apoiadores" element={<Protegida area="apoiadores"><Apoiadores /></Protegida>} />
          <Route path="apoiadores/nova" element={<Protegida area="apoiadores"><NovoApoiador /></Protegida>} />
          <Route path="apoiadores/editar" element={<Protegida area="apoiadores"><EditarApoiador /></Protegida>} />

          <Route path="equipe" element={<Protegida area="equipe"><Equipe_e_Acesso /></Protegida>} />
          <Route path="equipe/novo" element={<Protegida area="novoAcesso"><NovoAcesso /></Protegida>} />
          <Route path="equipe/permissas" element={<Protegida area="equipe"><PermissoesPerfil /></Protegida>} />

          <Route path="configuracoes" element={<Protegida area="configuracoes"><Configuracao /></Protegida>} />

          <Route path="*" element={<Navigate to="/Dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
