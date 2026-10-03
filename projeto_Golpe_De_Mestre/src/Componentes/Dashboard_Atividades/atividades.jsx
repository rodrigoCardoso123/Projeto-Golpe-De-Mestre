import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuPlus,
  LuCalendarDays,
  LuClipboardList,
  LuNotebookPen,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuDownload,
  LuPrinter,
  LuSend,
} from "react-icons/lu";
import estilo from "./atividades.module.css";
import {
  listarAtividades,
  atualizarAtividade,
  excluirAtividade,
  rotuloTipo,
} from "../../lib/atividadesService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { baixarCSV, imprimirPagina, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Atividades e devolutivas. Os cards vêm de atividades no Supabase e cada
// um pode ser editado, publicado, excluído ou ter as entregas acompanhadas.
function Atividades() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [atividades, setAtividades] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [turma, setTurma] = useState("todas");
  const [situacao, setSituacao] = useState("todas");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      setAtividades(await listarAtividades());
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
    listarTurmasParaSeleção().then(setTurmas).catch(() => setTurmas([]));
  }, []);

  async function apagar(atividade) {
    const confirmado = window.confirm(
      `Excluir a atividade "${atividade.titulo}"? As entregas registradas também serão removidas.`
    );

    if (!confirmado) return;

    try {
      await excluirAtividade(atividade.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  // Publicar e despublicar sem sair da lista.
  async function alternarPublicacao(atividade) {
    try {
      await atualizarAtividade(atividade.id, {
        titulo: atividade.titulo,
        descricao: atividade.descricao,
        turmaId: atividade.turmaId,
        tipo: atividade.tipo,
        prazo: atividade.prazo,
        situacao:
          atividade.situacaoBruta === "publicado" ? "rascunho" : "publicado",
      });
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Título", "Turma", "Tipo", "Prazo", "Situação", "Entregas"];

    const linhas = atividadesFiltradas.map((atividade) => [
      atividade.titulo,
      atividade.turma,
      rotuloTipo(atividade.tipo),
      atividade.prazoBr,
      atividade.situacao,
      `${atividade.entregas}/${atividade.entregas + atividade.aguardando}`,
    ]);

    baixarCSV(`atividades-${carimboData()}`, cabecalho, linhas);
  }

  const atividadesFiltradas = atividades.filter((atividade) => {
    const termo = busca.trim().toLowerCase();

    const correspondeBusca =
      termo === "" ||
      atividade.titulo.toLowerCase().includes(termo) ||
      atividade.descricao.toLowerCase().includes(termo);

    const correspondeTurma =
      turma === "todas" || atividade.turma === turma;

    const correspondeSituacao =
      situacao === "todas" || atividade.situacao === situacao;

    return correspondeBusca && correspondeTurma && correspondeSituacao;
  });

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Atividades</strong>
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
            <h1>Atividades e devolutivas</h1>
            <p>
              Propostas para ampliar o aprendizado e acompanhar cada entrega.
            </p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={exportar}
              disabled={atividadesFiltradas.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={imprimirPagina}
            >
              <LuPrinter size={16} />
              Imprimir
            </button>

            <button
              type="button"
              className={estilo.botao_nova_atividade}
              onClick={() => navigate("/Dashboard/atividades/nova")}
            >
              <LuPlus size={16} />
              Nova atividade
            </button>
          </div>
        </div>

        <div className={estilo.container_filtros}>
          <div className={estilo.campo}>
            <label htmlFor="busca-atividade">Buscar atividades</label>
            <input
              id="busca-atividade"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Título ou descrição"
            />
          </div>

          <div className={estilo.campo}>
            <label htmlFor="filtro-turma">Turma</label>
            <select
              id="filtro-turma"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
            >
              <option value="todas">Todas as minhas turmas</option>
              {turmas.map((item) => (
                <option key={item.id} value={item.nome}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={estilo.campo}>
            <label htmlFor="filtro-situacao">Situação</label>
            <select
              id="filtro-situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="Publicada">Publicada</option>
              <option value="Rascunho">Rascunho</option>
            </select>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando atividades...</p>}

        <div className={estilo.lista_atividades}>
          {atividadesFiltradas.map((atividade) => (
            <article key={atividade.id} className={estilo.card_atividade}>
              <div className={estilo.card_topo}>
                <span className={estilo.card_turma}>
                  {atividade.turma.toUpperCase()}
                </span>

                <span
                  className={
                    atividade.situacaoBruta === "publicado"
                      ? estilo.badge_publicada
                      : estilo.badge_rascunho
                  }
                >
                  {atividade.situacao}
                </span>
              </div>

              <div className={estilo.card_tipo}>
                {atividade.tipo === "reflexao" ? (
                  <LuNotebookPen size={16} />
                ) : (
                  <LuClipboardList size={16} />
                )}
                <span>{rotuloTipo(atividade.tipo)}</span>
              </div>

              <h2>{atividade.titulo}</h2>
              <p>{atividade.descricao}</p>

              <div className={estilo.card_prazo}>
                <LuCalendarDays size={16} />
                <span>Prazo: {atividade.prazoBr}</span>
              </div>

              <div className={estilo.card_entregas}>
                <strong>{atividade.entregas}</strong>
                <span>entregas.</span>
                <strong>{atividade.aguardando}</strong>
                <span>aguardam devolutiva</span>
              </div>

              <div className={estilo.card_acoes}>
                <button
                  type="button"
                  className={estilo.botao_acompanhar}
                  onClick={() =>
                    navigate("/Dashboard/atividades/entregas", { state: atividade })
                  }
                >
                  Acompanhar entregas
                </button>

                <button
                  type="button"
                  className={estilo.botao_publicar}
                  onClick={() => alternarPublicacao(atividade)}
                >
                  <LuSend size={14} />
                  {atividade.situacaoBruta === "publicado"
                    ? "Despublicar"
                    : "Publicar"}
                </button>

                <button
                  type="button"
                  className={estilo.botao_editar}
                  onClick={() =>
                    navigate("/Dashboard/atividades/editar", { state: atividade })
                  }
                >
                  <LuPencil size={14} />
                  Editar
                </button>

                <button
                  type="button"
                  className={estilo.botao_excluir}
                  onClick={() => apagar(atividade)}
                >
                  <LuTrash2 size={14} />
                  Excluir
                </button>
              </div>
            </article>
          ))}

          {!carregando && atividadesFiltradas.length === 0 && (
            <div className={estilo.estado_vazio}>
              <LuSearch size={46} />
              <h3>Nenhuma atividade encontrada</h3>
              <p>Ajuste os filtros ou crie uma nova atividade.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Atividades;
