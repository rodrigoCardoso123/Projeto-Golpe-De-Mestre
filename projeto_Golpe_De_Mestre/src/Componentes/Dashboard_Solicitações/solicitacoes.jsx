import { useState } from "react";
import estilo from "./solicitacoes.module.css";
import { LuBell, LuSearch } from "react-icons/lu";

const SOLICITACOES = [];

function Solicitacoes() {
    const [busca, setBusca] = useState("");
    const [situacao, setSituacao] = useState("todas");

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const solicitacoesFiltradas = SOLICITACOES.filter((solicitacao) => {
        const texto = `${solicitacao.aluno} ${solicitacao.responsavel} ${solicitacao.assunto}`
            .toLowerCase()
            .includes(busca.trim().toLowerCase());

        const correspondeSituacao =
            situacao === "todas" || solicitacao.situacao === situacao;

        return texto && correspondeSituacao;
    });

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
                        <p>GM</p>
                        <div>
                            <strong>Coordenação</strong>
                            <small>Administrador</small>
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

                {solicitacoesFiltradas.length > 0 ? (
                    <div className={estilo.lista_solicitacoes}>
                        {solicitacoesFiltradas.map((solicitacao) => (
                            <article
                                key={solicitacao.id}
                                className={estilo.card_solicitacao}
                            >
                                <div className={estilo.card_topo}>
                                    <span className={estilo.card_tag}>
                                        {solicitacao.assunto}
                                    </span>
                                    <span className={estilo.card_situacao}>
                                        {solicitacao.situacao}
                                    </span>
                                </div>

                                <h2>{solicitacao.aluno}</h2>
                                <p>{solicitacao.mensagem}</p>

                                <div className={estilo.card_rodape}>
                                    <span className={estilo.card_meta}>
                                        {solicitacao.data} · {solicitacao.responsavel}
                                    </span>

                                    <div className={estilo.card_acoes}>
                                        <button className={estilo.botao_editar}>
                                            Responder
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={estilo.estado_vazio}>
                        <LuSearch size={46} />
                        <h3>Nenhum registro encontrado</h3>
                        <p>Ajuste os filtros ou adicione um registro.</p>
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

export default Solicitacoes;
