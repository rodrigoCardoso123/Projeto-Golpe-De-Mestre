import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuPlus,
  LuSearch,
  LuArrowUpRight,
  LuPencil,
  LuTrash2,
  LuDownload,
} from "react-icons/lu";
import estilo from "./Apoiadores.module.css";
import {
  listarApoiadores,
  excluirApoiador,
  urlPublicaLogo,
} from "../../lib/apoiadoresService";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Apoiadores. Lista quem apoia o projeto e mostra a prévia de como os logos
// aparecem no site — só entram apoiadores ativos com logo enviado.
function Apoiadores() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [apoiadores, setApoiadores] = useState([]);
  const [logos, setLogos] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarApoiadores();
      setApoiadores(dados);

      // Busca as URLs dos logos em paralelo para a prévia montar rápido.
      const entradas = await Promise.all(
        dados
          .filter((apoiador) => apoiador.caminhoLogo)
          .map(async (apoiador) => [
            apoiador.id,
            await urlPublicaLogo(apoiador.caminhoLogo),
          ])
      );

      setLogos(Object.fromEntries(entradas));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function apagar(apoiador) {
    const confirmado = window.confirm(
      `Excluir o apoiador "${apoiador.nome}"? O logo também será removido.`
    );

    if (!confirmado) return;

    try {
      await excluirApoiador(apoiador.id, apoiador.caminhoLogo);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Nome", "Categoria", "Site", "Situação", "Tem logo"];

    const linhas = apoiadoresFiltrados.map((apoiador) => [
      apoiador.nome,
      apoiador.categoria,
      apoiador.site,
      apoiador.situacao,
      apoiador.caminhoLogo ? "Sim" : "Não",
    ]);

    baixarCSV(`apoiadores-${carimboDate()}`, cabecalho, linhas);
  }

  // Só chega à prévia pública quem está ativo e com logo enviado.
  const naPrevia = apoiadoresFiltrados.filter(
    (apoiador) => apoiador.situacaoBruta === "ativo" && apoiador.caminhoLogo
  );

  const apoiadoresFiltrados = apoiadores.filter((apoiador) => {
    const termo = busca.trim().toLowerCase();

    const correspondeBusca =
      termo === "" || apoiador.nome.toLowerCase().includes(termo);

    const correspondeSituacao =
      situacao === "" || apoiador.situacaoBruta === situacao;

    return correspondeBusca && correspondeSituacao;
  });

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Apoiadores</strong>
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
            <h1>Apoiadores</h1>
            <p>
              Quem apoia o projeto e como os logos aparecem no site público.
            </p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_exportar}
              onClick={exportar}
              disabled={apoiadoresFiltrados.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              className={estilo.botao_imprimir}
              onClick={() => navigate("/Dashboard/apoiadores/nova")}
            >
              <LuPlus size={16} />
              Novo apoiador
            </button>
          </div>
        </div>

        <div className={estilo.container_aviso}>
          <p>
            Somente logos enviados e autorizados aparecem na prévia pública. O
            arquivo original permanece intacto.
          </p>
        </div>

        <div className={estilo.container_filtros}>
          <div className={estilo.campo}>
            <label htmlFor="filtro-nome">Buscar apoiador</label>
            <input
              id="filtro-nome"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome do apoiador"
            />
          </div>

          <div className={estilo.campo}>
            <label htmlFor="filtro-situacao">Situação</label>
            <select
              id="filtro-situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando apoiadores...</p>}

        {!carregando && apoiadoresFiltrados.length === 0 && (
          <div className={estilo.estado_vazio}>
            <LuSearch size={46} />
            <h3>Nenhum registro encontrado</h3>
            <p>Ajuste os filtros ou adicione um registro.</p>
          </div>
        )}

        {!carregando && apoiadoresFiltrados.length > 0 && (
          <div className={estilo.lista_apoiadores}>
            {apoiadoresFiltrados.map((apoiador) => (
              <article key={apoiador.id} className={estilo.card_apoiador}>
                <div className={estilo.card_logo}>
                  {logos[apoiador.id] ? (
                    <img src={logos[apoiador.id]} alt={`Logo de ${apoiador.nome}`} />
                  ) : (
                    <LuSearch size={30} />
                  )}
                </div>

                <div className={estilo.card_info}>
                  <h2>{apoiador.nome}</h2>
                  <p>{apoiador.categoria}</p>

                  {apoiador.site && (
                    <a
                      href={apoiador.site}
                      target="_blank"
                      rel="noreferrer"
                      className={estilo.card_site}
                    >
                      {apoiador.site}
                      <LuArrowUpRight size={14} />
                    </a>
                  )}

                  <span
                    className={
                      apoiador.situacaoBruta === "ativo"
                        ? estilo.badge_ativo
                        : estilo.badge_inativo
                    }
                  >
                    {apoiador.situacao}
                  </span>
                </div>

                <div className={estilo.card_acoes}>
                  <button
                    type="button"
                    className={estilo.botao_editar}
                    onClick={() =>
                      navigate("/Dashboard/apoiadores/editar", { state: apoiador })
                    }
                  >
                    <LuPencil size={14} />
                    Editar
                  </button>

                  <button
                    type="button"
                    className={estilo.botao_excluir}
                    onClick={() => apagar(apoiador)}
                  >
                    <LuTrash2 size={14} />
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className={estilo.previa}>
          <h2>Prévia no site</h2>
          <p>
            É assim que os apoiadores aparecem para o público. Lista vazia
            significa que nenhum logo autorizado foi enviado.
          </p>

          {naPrevia.length === 0 ? (
            <p className={estilo.previa_vazia}>
              Nenhum apoiador ativo com logo enviado.
            </p>
          ) : (
            <div className={estilo.previa_lista}>
              {naPrevia.map((apoiador) => (
                <div key={apoiador.id} className={estilo.previa_item}>
                  <img src={logos[apoiador.id]} alt={apoiador.nome} />
                  <strong>{apoiador.nome}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Apoiadores;
