import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuLayers3,
  LuUserRound,
  LuDumbbell,
  LuClock,
  LuMapPin,
  LuUsersRound,
  LuChevronRight,
  LuPencil,
  LuTrash2,
  LuPlus,
  LuDownload,
  LuSearch,
} from "react-icons/lu";
import estilo from "./turmas.module.css";
import {
  listarTurmas,
  excluirTurma,
  alternarSituacaoTurma,
  listarProfessores,
} from "../../lib/turmasService";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Turmas e horários. Os cards vêm do banco; o filtro e a busca rodam sobre a
// lista já carregada, sem nova ida ao servidor.
function Turmas() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      setTurmas(await listarTurmas());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    listarProfessores().then(setProfessores).catch(() => setProfessores([]));
  }, []);

  async function apagar(turma) {
    const confirmado = window.confirm(
      `Excluir a turma "${turma.nome}"? Os alunos vinculados ficam sem turma até serem remanejados.`
    );

    if (!confirmado) return;

    try {
      await excluirTurma(turma.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  // Liga/desliga a turma sem abrir a tela de edição.
  async function alternarStatus(turma) {
    try {
      await alternarSituacaoTurma(
        turma.id,
        turma.situacao === "Ativa" ? "Inativa" : "Ativa"
      );
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Turma", "Programa", "Professor", "Esporte", "Horário", "Lotação", "Situação"];

    const linhas = turmasFiltradas.map((turma) => [
      turma.nome,
      turma.programa,
      turma.professor,
      turma.esporte,
      turma.horario,
      `${turma.alunosAtivos}/${turma.capacidade}`,
      turma.situacao,
    ]);

    baixarCSV(`turmas-${carimboDate()}`, cabecalho, linhas);
  }

  const turmasFiltradas = turmas.filter((turma) => {
    const termo = busca.trim().toLowerCase();

    const correspondeBusca =
      termo === "" || turma.nome.toLowerCase().includes(termo);

    const correspondeStatus = status === "" || turma.situacao === status;

    return correspondeBusca && correspondeStatus;
  });

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Turmas e horários</strong>
          <p>{dataHoje}</p>
        </div>

        <div className={estilo.perfil_header}>
          <LuBell size={22} className={estilo.icone_header} />
          <div className={estilo.conteudo_perfil}>
            <p>{(perfil?.nome ?? "CM").slice(0, 2).toUpperCase()}</p>
            <div>
              <strong>{perfil?.nome ?? "Coordenação"}</strong>
              <small>{rotuloPapel(perfil?.papel)}</small>
            </div>
          </div>
        </div>
      </header>

      <section className={estilo.section_main}>
        <div className={estilo.container_titulo_main}>
          <div>
            <strong>Área da equipe</strong>
            <h1>Turmas e horários</h1>
            <p>Programas, encontros e vínculos em um só lugar.</p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={exportar}
              disabled={turmasFiltradas.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              onClick={() => navigate("/Dashboard/turmas/nova")}
            >
              <LuPlus size={16} />
              Nova turma
            </button>
          </div>
        </div>

        <div className={estilo.container_form}>
          <div>
            <label htmlFor="filtro-busca">Buscar turma</label>
            <input
              id="filtro-busca"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome da turma"
            />
          </div>

          <div>
            <label htmlFor="filtro-status">Status</label>
            <select
              id="filtro-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </select>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando turmas...</p>}

        {!carregando && turmasFiltradas.length === 0 && (
          <div className={estilo.estado_vazio}>
            <LuSearch size={46} />
            <h3>Nenhuma turma encontrada</h3>
            <p>Ajuste os filtros ou cadastre uma nova turma.</p>
          </div>
        )}

        <div className={estilo.container_cards}>
          {turmasFiltradas.map((turma) => (
            <article key={turma.id} className={estilo.card_turma}>
              <div className={estilo.topo_card}>
                <div className={estilo.icone_turma}>
                  <LuLayers3 size={22} />
                </div>

                <button
                  type="button"
                  className={estilo.situacao}
                  onClick={() => alternarStatus(turma)}
                  title="Clique para ativar ou inativar a turma"
                >
                  {turma.situacao}
                </button>
              </div>

              <div className={estilo.info_principal}>
                <small>{turma.programa}</small>
                <h2>{turma.nome}</h2>
                <p>{turma.descricao}</p>
              </div>

              <ul className={estilo.lista_detalhes}>
                <li>
                  <LuUserRound size={16} className={estilo.icone_detalhe} />
                  <div>
                    <span>Professor</span>
                    <strong>{turma.professor}</strong>
                  </div>
                </li>

                <li>
                  <LuDumbbell size={16} className={estilo.icone_detalhe} />
                  <div>
                    <span>Esporte</span>
                    <strong>{turma.esporte}</strong>
                  </div>
                </li>

                <li>
                  <LuClock size={16} className={estilo.icone_detalhe} />
                  <div>
                    <span>Horário</span>
                    <strong>{turma.horario}</strong>
                  </div>
                </li>

                <li>
                  <LuMapPin size={16} className={estilo.icone_detalhe} />
                  <div>
                    <span>Local</span>
                    <strong>{turma.local}</strong>
                  </div>
                </li>
              </ul>

              <div className={estilo.container_lotacao}>
                <div className={estilo.rotulo_lotacao}>
                  <span>
                    <LuUsersRound size={14} />
                    {turma.alunosAtivos} de {turma.capacidade} alunos
                  </span>
                  <span>
                    {Math.max(turma.capacidade - turma.alunosAtivos, 0)} vaga(s)
                  </span>
                </div>

                <div className={estilo.barra}>
                  <div
                    className={estilo.progresso}
                    style={{
                      width: `${
                        turma.capacidade > 0
                          ? Math.min((turma.alunosAtivos / turma.capacidade) * 100, 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className={estilo.rodape_card}>
                <button
                  type="button"
                  className={estilo.botao_ver}
                  onClick={() =>
                    navigate("/Dashboard/turmas/perfil", { state: turma })
                  }
                >
                  Ver turma
                  <LuChevronRight size={14} />
                </button>

                <button
                  type="button"
                  className={estilo.botao_editar}
                  onClick={() =>
                    navigate("/Dashboard/turmas/editar", { state: turma })
                  }
                >
                  <LuPencil size={14} />
                  Editar
                </button>

                <button
                  type="button"
                  className={estilo.botao_excluir}
                  onClick={() => apagar(turma)}
                >
                  <LuTrash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Turmas;
