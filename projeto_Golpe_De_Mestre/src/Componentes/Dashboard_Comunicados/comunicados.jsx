import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuPlus,
  LuMail,
  LuCheck,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuDownload,
  LuPrinter,
  LuUndo2,
} from "react-icons/lu";
import estilo from "./comunicados.module.css";
import {
  listarComunicados,
  criarComunicado,
  atualizarComunicado,
  excluirComunicado,
  confirmarLeitura,
  desfazerLeitura,
} from "../../lib/comunicadosService";
import { baixarCSV, imprimirPagina, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Comunicados do mural. Cada pessoa confirma a própria leitura; a equipe
// publica, edita e remove.
function Comunicados() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [comunicados, setComunicados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
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
      setComunicados(await listarComunicados());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function marcarLeitura(comunicado) {
    setErro("");

    // Atualiza na hora e recarrega depois; se o banco recusar, a lista volta
    // ao estado real em vez de mostrar uma leitura que não foi gravada.
    setComunicados((anterior) =>
      anterior.map((item) =>
        item.id === comunicado.id
          ? {
              ...item,
              euLi: true,
              confirmacoes: item.confirmacoes + (item.euLi ? 0 : 1),
            }
          : item
      )
    );

    try {
      if (comunicado.euLi) {
        await desfazerLeitura(comunicado.id);
      } else {
        await confirmarLeitura(comunicado.id);
      }
      await carregar();
    } catch (e) {
      setErro(e.message);
      await carregar();
    }
  }

  async function apagar(comunicado) {
    const confirmado = window.confirm(
      `Excluir o comunicado "${comunicado.titulo}"?`
    );

    if (!confirmado) return;

    try {
      await excluirComunicado(comunicado.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Título", "Data", "Autor", "Situação", "Leituras"];

    const linhas = comunicadosFiltrados.map((comunicado) => [
      comunicado.titulo,
      comunicado.data,
      comunicado.autor,
      comunicado.situacao,
      comunicado.confirmacoes,
    ]);

    baixarCSV(`comunicados-${carimboDate()}`, cabecalho, linhas);
  }

  const comunicadosFiltrados = comunicados.filter((comunicado) => {
    const termo = busca.trim().toLowerCase();

    const correspondeBusca =
      termo === "" || comunicado.titulo.toLowerCase().includes(termo);

    const correspondeSituacao =
      situacao === "todas" || comunicado.situacao === situacao;

    return correspondeBusca && correspondeSituacao;
  });

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Comunicados</strong>
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
            <h1>Comunicados</h1>
            <p>
              Um mural para a equipe e as famílias acompanharem os combinados.
            </p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={exportar}
              disabled={comunicadosFiltrados.length === 0}
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
              className={estilo.botao_novo_comunicado}
              onClick={() => navigate("/Dashboard/comunicados/nova")}
            >
              <LuPlus size={16} />
              Novo comunicado
            </button>
          </div>
        </div>

        <div className={estilo.container_filtros}>
          <div className={estilo.campo}>
            <label htmlFor="busca-comunicado">Buscar comunicado</label>
            <input
              id="busca-comunicado"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Título do comunicado"
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
              <option value="Publicado">Publicado</option>
              <option value="Rascunho">Rascunho</option>
            </select>
          </div>
        </div>

        <p className={estilo.aviso_leitura}>
          <LuMail size={16} />
          Acompanhe os comunicados e confirme sua leitura pelo portal.
        </p>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando comunicados...</p>}

        <div className={estilo.lista_comunicados}>
          {comunicadosFiltrados.map((comunicado) => (
            <article key={comunicado.id} className={estilo.card_comunicado}>
              <div className={estilo.card_topo}>
                <span className={estilo.card_tag}>Todos</span>

                <span
                  className={
                    comunicado.situacaoBruta === "publicado"
                      ? estilo.badge_publicado
                      : estilo.badge_rascunho
                  }
                >
                  {comunicado.situacao}
                </span>
              </div>

              <h2>{comunicado.titulo}</h2>
              <p>{comunicado.texto}</p>

              <div className={estilo.card_rodape}>
                <span className={estilo.card_meta}>
                  {comunicado.data} · {comunicado.autor} ·{" "}
                  {comunicado.confirmacoes} leitura(s) confirmada(s)
                  {comunicado.euLi ? (
                    <span className={estilo.tag_lido}> · Você leu</span>
                  ) : null}
                </span>

                <div className={estilo.card_acoes}>
                  <button
                    type="button"
                    className={estilo.botao_editar}
                    onClick={() =>
                      navigate("/Dashboard/comunicados/editar", {
                        state: comunicado,
                      })
                    }
                  >
                    <LuPencil size={14} />
                    Editar
                  </button>

                  <button
                    type="button"
                    className={estilo.botao_excluir}
                    onClick={() => apagar(comunicado)}
                  >
                    <LuTrash2 size={14} />
                    Excluir
                  </button>

                  <button
                    type="button"
                    className={
                      comunicado.euLi
                        ? estilo.botao_confirmar + " " + estilo.botao_lido
                        : estilo.botao_confirmar
                    }
                    onClick={() => marcarLeitura(comunicado)}
                  >
                    {comunicado.euLi ? (
                      <>
                        <LuUndo2 size={16} />
                        Desmarcar leitura
                      </>
                    ) : (
                      <>
                        <LuCheck size={16} />
                        Confirmar leitura
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!carregando && comunicadosFiltrados.length === 0 && (
            <div className={estilo.estado_vazio}>
              <LuSearch size={46} />
              <h3>Nenhum comunicado encontrado</h3>
              <p>Ajuste os filtros ou publique um novo comunicado.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Comunicados;
