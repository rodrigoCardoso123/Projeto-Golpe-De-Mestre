import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuPlus,
  LuCalendarDays,
  LuCheck,
  LuPencil,
  LuTrash2,
  LuDownload,
  LuPrinter,
} from "react-icons/lu";
import estilo from "./Diario_de_aula.module.css";
import {
  listarAulas,
  alternarSituacaoAula,
  excluirAula,
  listarTurmasParaSeleção,
} from "../../lib/diarioService";
import { baixarCSV, imprimirPagina, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Diário de aula. Lista os encontros, filtra por turma/situação/mês e permite
// marcar como realizada, editar, excluir e exportar.
function DiarioDeAula() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [aulas, setAulas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [turmaId, setTurmaId] = useState("");
  const [situacao, setSituacao] = useState("");
  const [mes, setMes] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Os filtros já chegam no formato que o service entende: mês como "YYYY-MM".
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarAulas({
        turmaId: turmaId || undefined,
        situacao: situacao || undefined,
        mes: mes || undefined,
      });
      setAulas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [turmaId, situacao, mes]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    listarTurmasParaSeleção().then(setTurmas).catch(() => setTurmas([]));
  }, []);

  async function alternar(aula) {
    try {
      await alternarSituacaoAula(aula.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function apagar(aula) {
    const confirmado = window.confirm(
      `Excluir a aula "${aula.titulo}" de ${aula.dataBr}? Essa ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    try {
      await excluirAula(aula.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Data", "Turma", "Professor", "Título", "Situação", "Horário"];

    const linhas = aulas.map((aula) => [
      aula.dataBr,
      aula.turma,
      aula.professor,
      aula.titulo,
      aula.situacao,
      aula.horario,
    ]);

    baixarCSV(`diario-de-aula-${carimboDate()}`, cabecalho, linhas);
  }

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Diário de aula</strong>
          <p>{dataHoje}</p>
        </div>

        <div className={estilo.perfil_header}>
          <LuBell size={22} className={estilo.icone_header} />
          <div className={estilo.conteudo_perfil}>
            <p>{(perfil?.nome ?? "GM").slice(0, 2).toUpperCase()}</p>
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
            <h1>Diário de aula</h1>
            <p>
              Do planejamento ao registro do encontro, com controle de quem
              ministrou.
            </p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_exportar}
              onClick={exportar}
              disabled={aulas.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              className={estilo.botao_imprimir}
              onClick={imprimirPagina}
            >
              <LuPrinter size={16} />
              Imprimir
            </button>

            <button type="button" onClick={() => navigate("/Dashboard/diario/nova")}>
              <LuPlus size={16} />
              Planejar aula
            </button>
          </div>
        </div>

        <div className={estilo.container_form}>
          <div>
            <label htmlFor="filtro-turma">Turma</label>
            <select
              id="filtro-turma"
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
            >
              <option value="">Todas</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-situacao">Situação</label>
            <select
              id="filtro-situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="planejada">Planejada</option>
              <option value="realizada">Realizada</option>
            </select>
          </div>

          <div>
            <label htmlFor="filtro-mes">Mês</label>
            <input
              id="filtro-mes"
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
            />
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}

        {carregando && <p className={estilo.carregando}>Carregando aulas...</p>}

        {!carregando && aulas.length === 0 && (
          <div className={estilo.estado_vazio}>
            <LuCalendarDays size={40} />
            <h3>Nenhuma aula encontrada</h3>
            <p>Ajuste os filtros ou planeje um novo encontro.</p>
          </div>
        )}

        <div className={estilo.container_aulas}>
          {aulas.map((aula) => (
            <article key={aula.id} className={estilo.article_aula}>
              <div className={estilo.data_aula}>
                <strong>{aula.dia}</strong>
                <span>{aula.mes}</span>
              </div>

              <div className={estilo.info_aula}>
                <div className={estilo.topo_aula}>
                  <span className={estilo.turma}>{aula.turma}</span>

                  <span
                    className={
                      aula.situacaoBruta === "realizada"
                        ? estilo.status
                        : estilo.status_pendente
                    }
                  >
                    {aula.situacao}
                  </span>
                </div>

                <h2>{aula.titulo}</h2>

                {aula.descricao && <p>{aula.descricao}</p>}

                <small>
                  {aula.professor}
                  {aula.horario ? ` · ${aula.horario}` : ""}
                </small>
              </div>

              <div className={estilo.acoes_aula}>
                <button type="button" onClick={() => alternar(aula)}>
                  {aula.situacaoBruta === "realizada" ? (
                    "Reabrir"
                  ) : (
                    <>
                      <LuCheck size={14} />
                      Realizada
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/Dashboard/diario/editar", { state: aula })}
                >
                  <LuPencil size={14} />
                  Editar
                </button>

                <button
                  type="button"
                  className={estilo.botao_excluir}
                  onClick={() => apagar(aula)}
                >
                  <LuTrash2 size={14} />
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default DiarioDeAula;
