import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuCalendarDays,
  LuArrowUpRight,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuSearch,
  LuDownload,
} from "react-icons/lu";
import estilo from "./visitas.module.css";
import {
  listarVisitas,
  confirmarVisita,
  atualizarVisita,
  excluirVisita,
} from "../../lib/visitasService";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Solicitações de visita que chegam pelo formulário público. A equipe tria,
// confirma o agendamento e registra quando o encontro aconteceu.
function Visitas() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [visitas, setVisitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("todas");
  const [data, setData] = useState("");
  const [visao, setVisao] = useState("lista");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      setVisitas(await listarVisitas());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function confirmar(visita) {
    setErro("");

    try {
      await confirmarVisita(visita.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function marcarRealizada(visita) {
    setErro("");

    try {
      await atualizarVisita(visita.id, {
        visitante: visita.visitante,
        email: visita.email,
        telefone: visita.telefone,
        programa: visita.programa,
        dataIso: visita.dataIso,
        horario: visita.horario,
        mensagem: visita.mensagem,
        situacaoBruta: "realizada",
      });
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function apagar(visita) {
    const confirmado = window.confirm(
      `Excluir a solicitação de visita de ${visita.visitante}?`
    );

    if (!confirmado) return;

    try {
      await excluirVisita(visita.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Visitante", "Programa", "Data", "Horário", "Situação"];

    const linhas = visitasFiltradas.map((visita) => [
      visita.visitante,
      visita.programa,
      visita.data,
      visita.horario,
      visita.situacao,
    ]);

    baixarCSV(`visitas-${carimboDate()}`, cabecalho, linhas);
  }

  // A visão "dia" e "semana" é só um recorte do mesmo filtro — evita manter
  // três consultas diferentes para a mesma lista de visitas.
  const visitasFiltradas = visitas.filter((visita) => {
    const termo = busca.trim().toLowerCase();

    const correspondeBusca =
      termo === "" || visita.visitante.toLowerCase().includes(termo);

    const correspondeSituacao =
      situacao === "todas" || visita.situacao === situacao;

    const correspondeData = !data || visita.dataIso === data;

    return correspondeBusca && correspondeSituacao && correspondeData;
  });

  const visitasVisiveis = visitasFiltradas.filter((visita) => {
    if (visao === "lista") return true;

    const hoje = new Date();
    const alvo = new Date(`${visita.dataIso}T12:00:00`);
    if (Number.isNaN(alvo.getTime())) return false;

    if (visao === "dia") {
      return alvo.toDateString() === hoje.toDateString();
    }

    // Semana: de segunda a domingo, com a semana começando na segunda.
    const inicioSemana = new Date(hoje);
    const diaSemana = inicioSemana.getDay();
    const diasAtras = diaSemana === 0 ? 6 : diaSemana - 1;
    inicioSemana.setDate(inicioSemana.getDate() - diasAtras);
    inicioSemana.setHours(0, 0, 0, 0);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(fimSemana.getDate() + 7);

    return alvo >= inicioSemana && alvo < fimSemana;
  });

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Visitas</strong>
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
        <div className={estilo.container_titulo}>
          <div>
            <strong>Área da equipe</strong>
            <h1>Solicitações de visita</h1>
            <p>Organize o contato e confirme cada encontro com cuidado.</p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={exportar}
              disabled={visitasFiltradas.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              className={estilo.botao_formulario}
              onClick={() => window.open("/", "_blank")}
            >
              Ver formulário público
              <LuArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className={estilo.container_filtros}>
          <div className={estilo.campo}>
            <label htmlFor="busca-visitante">Buscar visitante</label>
            <input
              id="busca-visitante"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome do visitante"
            />
          </div>

          <div className={estilo.campo}>
            <label htmlFor="filtro-situacao">Situação</label>
            <select
              id="filtro-situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="Solicitada">Solicitada</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className={estilo.campo_data}>
            <div className={estilo.campo}>
              <label htmlFor="filtro-data">Data de referência</label>
              <input
                id="filtro-data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div className={estilo.seletor_visao}>
              <button
                type="button"
                className={visao === "lista" ? estilo.seletor_visao_ativo : ""}
                onClick={() => setVisao("lista")}
              >
                Lista
              </button>
              <button
                type="button"
                className={visao === "dia" ? estilo.seletor_visao_ativo : ""}
                onClick={() => setVisao("dia")}
              >
                Dia
              </button>
              <button
                type="button"
                className={
                  visao === "semana" ? estilo.seletor_visao_ativo : ""
                }
                onClick={() => setVisao("semana")}
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando visitas...</p>}

        {!carregando && visitasVisiveis.length === 0 ? (
          <div className={estilo.estado_vazio}>
            <LuCalendarDays size={46} />
            <h3>Nenhuma visita nesta seleção</h3>
            <p>
              Acompanhe as solicitações recebidas pelo formulário público.
            </p>
          </div>
        ) : (
          <div className={estilo.lista_visitas}>
            {visitasVisiveis.map((visita) => (
              <article key={visita.id} className={estilo.card_visita}>
                <div className={estilo.card_topo}>
                  <span className={estilo.card_tag}>{visita.programa}</span>

                  <span
                    className={
                      visita.situacaoBruta === "realizada"
                        ? estilo.badge_situacao + " " + estilo.badge_realizada
                        : visita.situacaoBruta === "agendada"
                          ? estilo.badge_situacao
                          : estilo.badge_situacao + " " + estilo.badge_pendente
                    }
                  >
                    {visita.situacao}
                  </span>
                </div>

                <h2>{visita.visitante}</h2>
                <p>{visita.mensagem}</p>

                <div className={estilo.card_rodape}>
                  <span className={estilo.card_meta}>
                    {visita.data}
                    {visita.horario ? ` · ${visita.horario}` : ""}
                    {visita.telefone ? ` · ${visita.telefone}` : ""}
                  </span>

                  <div className={estilo.card_acoes}>
                    <button
                      type="button"
                      className={estilo.botao_editar}
                      onClick={() =>
                        navigate("/Dashboard/visitas/editar", { state: visita })
                      }
                    >
                      <LuPencil size={14} />
                      Editar
                    </button>

                    <button
                      type="button"
                      className={estilo.botao_excluir}
                      onClick={() => apagar(visita)}
                    >
                      <LuTrash2 size={14} />
                      Excluir
                    </button>

                    {visita.situacaoBruta === "solicitada" && (
                      <button
                        type="button"
                        className={estilo.botao_confirmar}
                        onClick={() => confirmar(visita)}
                      >
                        <LuCheck size={14} />
                        Confirmar visita
                      </button>
                    )}

                    {visita.situacaoBruta === "agendada" && (
                      <button
                        type="button"
                        className={estilo.botao_confirmar}
                        onClick={() => marcarRealizada(visita)}
                      >
                        <LuCheck size={14} />
                        Marcar realizada
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Visitas;
