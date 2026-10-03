import { useCallback, useEffect, useState } from "react";
import {
  LuBell,
  LuSearch,
  LuDownload,
  LuPrinter,
  LuMailOpen,
} from "react-icons/lu";
import estilo from "./solicitacoes.module.css";
import {
  listarSolicitacoes,
  responderSolicitacao,
  atualizarSituacaoSolicitacao,
} from "../../lib/presencasService";
import { baixarCSV, imprimirPagina, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Solicitações das famílias. Cada uma recebe uma resposta formal, que a move
// de "em acompanhamento" para "respondida".
function Solicitacoes() {
  const { perfil } = useAuth();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("todas");
  const [respondendo, setRespondendo] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      setSolicitacoes(await listarSolicitacoes());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function responder(solicitacao, texto) {
    if (!texto.trim()) {
      setErro("Escreva a resposta antes de enviar.");
      return;
    }

    setErro("");
    setRespondendo(solicitacao.id);

    try {
      await responderSolicitacao(solicitacao.id, texto.trim());
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setRespondendo("");
    }
  }

  async function moverPara(solicitacao, novaSituacao) {
    setErro("");

    try {
      await atualizarSituacaoSolicitacao(solicitacao.id, novaSituacao);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Aluno", "Responsável", "Assunto", "Situação", "Data", "Resposta"];

    const linhas = solicitacoesFiltradas.map((solicitacao) => [
      solicitacao.aluno,
      solicitacao.responsavel,
      solicitacao.assunto,
      solicitacao.situacao,
      solicitacao.data,
      solicitacao.resposta,
    ]);

    baixarCSV(`solicitacoes-${carimboDate()}`, cabecalho, linhas);
  }

  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    const termo = busca.trim().toLowerCase();

    const texto = `${solicitacao.aluno} ${solicitacao.responsavel} ${solicitacao.assunto} ${solicitacao.mensagem}`;
    const correspondeBusca = termo === "" || texto.toLowerCase().includes(termo);

    const correspondeSituacao =
      situacao === "todas" || solicitacao.situacao === situacao;

    return correspondeBusca && correspondeSituacao;
  });

  const emAberto = solicitacoesFiltradas.filter(
    (solicitacao) => solicitacao.situacaoBruta !== "resolvida"
  ).length;

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Solicitações</strong>
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
            <h1>Solicitações das famílias</h1>
            <p>
              Acolha as solicitações e registre uma resposta para cada
              acompanhamento.
            </p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={exportar}
              disabled={solicitacoesFiltradas.length === 0}
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
          </div>
        </div>

        <div className={estilo.resumo_solicitacoes}>
          <div>
            <small>Em aberto</small>
            <strong>{emAberto}</strong>
          </div>
          <div>
            <small>Respondidas</small>
            <strong>
              {
                solicitacoesFiltradas.filter(
                  (solicitacao) => solicitacao.situacaoBruta === "resolvida"
                ).length
              }
            </strong>
          </div>
          <div>
            <small>Total na seleção</small>
            <strong>{solicitacoesFiltradas.length}</strong>
          </div>
        </div>

        <div className={estilo.container_filtros}>
          <div className={estilo.campo}>
            <label htmlFor="busca-solicitacao">
              Buscar aluno ou solicitação
            </label>
            <input
              id="busca-solicitacao"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, assunto ou mensagem"
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
              <option value="Nova">Nova</option>
              <option value="Em acompanhamento">Em acompanhamento</option>
              <option value="Respondida">Respondida</option>
            </select>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando solicitações...</p>}

        {!carregando && solicitacoesFiltradas.length === 0 ? (
          <div className={estilo.estado_vazio}>
            <LuSearch size={46} />
            <h3>Nenhum registro encontrado</h3>
            <p>Ajuste os filtros ou adicione um registro.</p>
          </div>
        ) : (
          <div className={estilo.lista_solicitacoes}>
            {solicitacoesFiltradas.map((solicitacao) => (
              <SolicitacaoCard
                key={solicitacao.id}
                solicitacao={solicitacao}
                respondendo={respondendo === solicitacao.id}
                aoResponder={(texto) => responder(solicitacao, texto)}
                aoMover={(novaSituacao) => moverPara(solicitacao, novaSituacao)}
              />
            ))}
          </div>
        )}

        <p className={estilo.nota_rodape}>
          As solicitações criadas no portal do aluno ou responsável aparecerão
          aqui, somente para a equipe vinculada.
        </p>
      </section>
    </main>
  );
}

// Cada card tem a própria caixa de resposta, controlada aqui para não abrir
// um modal a cada clique.
function SolicitacaoCard({ solicitacao, respondendo, aoResponder, aoMover }) {
  const [aberta, setAberta] = useState(false);
  const [texto, setTexto] = useState(solicitacao.resposta ?? "");

  const resolvida = solicitacao.situacaoBruta === "resolvida";

  return (
    <article className={estilo.card_solicitacao}>
      <div className={estilo.card_topo}>
        <span className={estilo.card_tag}>{solicitacao.assunto}</span>

        <span
          className={
            resolvida ? estilo.card_situacao + " " + estilo.card_resolvida : estilo.card_situacao
          }
        >
          {solicitacao.situacao}
        </span>
      </div>

      <h2>{solicitacao.aluno}</h2>
      <p>{solicitacao.mensagem}</p>

      {resolvida && solicitacao.resposta && (
        <div className={estilo.resposta_registrada}>
          <strong>Resposta enviada</strong>
          <p>{solicitacao.resposta}</p>
        </div>
      )}

      <div className={estilo.card_rodape}>
        <span className={estilo.card_meta}>
          {solicitacao.data} · {solicitacao.responsavel}
        </span>

        <div className={estilo.card_acoes}>
          {!resolvida && solicitacao.situacaoBruta === "aberta" && (
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={() => aoMover("em_andamento")}
            >
              Assumir acompanhamento
            </button>
          )}

          <button
            type="button"
            className={estilo.botao_editar}
            onClick={() => setAberta((valor) => !valor)}
          >
            <LuMailOpen size={14} />
            {aberta ? "Fechar" : resolvida ? "Editar resposta" : "Responder"}
          </button>
        </div>
      </div>

      {aberta && (
        <div className={estilo.caixa_resposta}>
          <label htmlFor={`resposta-${solicitacao.id}`}>Resposta</label>

          <textarea
            id={`resposta-${solicitacao.id}`}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva a resposta para a família."
            rows={4}
          />

          <button
            type="button"
            className={estilo.botao_confirmar}
            onClick={() => aoResponder(texto)}
            disabled={respondendo}
          >
            {respondendo ? "Enviando..." : "Enviar resposta"}
          </button>
        </div>
      )}
    </article>
  );
}

export default Solicitacoes;
