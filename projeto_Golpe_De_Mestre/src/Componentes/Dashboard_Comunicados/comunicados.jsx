import { useState } from "react";
import estilo from "./comunicados.module.css";
import { LuBell, LuPlus, LuMail, LuCheck, LuSearch } from "react-icons/lu";

const COMUNICADOS = [
    {
        id: 1,
        titulo: "Bem-vindos ao portal",
        texto: "Acompanhe atividades, presença e comunicados pelo portal.",
        data: "14/09/2026",
        autor: "Coordenação",
        confirmacoes: 0
    }
];

function Comunicados() {
    const [busca, setBusca] = useState("");
    const [situacao, setSituacao] = useState("todas");
    const [lidas, setLidas] = useState([]);

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const confirmarLeitura = (id) => {
        if (lidas.includes(id)) return;
        setLidas([...lidas, id]);
    };

    const comunicadosFiltrados = COMUNICADOS.filter((comunicado) => {
        const correspondeBusca = comunicado.titulo
            .toLowerCase()
            .includes(busca.trim().toLowerCase());

        const publicados = comunicado.length > 0;
        const correspondeSituacao =
            situacao === "todas" ||
            (situacao === "Publicado" && publicados);

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
                        <h1>Comunicados</h1>
                        <p>
                            Um mural para a equipe e as famílias acompanharem os combinados.
                        </p>
                    </div>
                    <button className={estilo.botao_novo_comunicado}>
                        <LuPlus size={16} />
                        Novo comunicado
                    </button>
                </div>

                <div className={estilo.container_filtros}>
                    <div className={estilo.campo}>
                        <label htmlFor="busca-comunicado">Buscar comunicado</label>
                        <input
                            id="busca-comunicado"
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
                            <option value="Publicado">Publicado</option>
                            <option value="Rascunho">Rascunho</option>
                        </select>
                    </div>
                </div>

                <p className={estilo.aviso_leitura}>
                    <LuMail size={16} />
                    Acompanhe os comunicados e confirme sua leitura pelo portal.
                </p>

                <div className={estilo.lista_comunicados}>
                    {comunicadosFiltrados.map((comunicado) => (
                        <article key={comunicado.id} className={estilo.card_comunicado}>
                            <div className={estilo.card_topo}>
                                <span className={estilo.card_tag}>Todos</span>
                                <span className={estilo.badge_publicado}>Publicado</span>
                            </div>

                            <h2>{comunicado.titulo}</h2>
                            <p>{comunicado.texto}</p>

                            <div className={estilo.card_rodape}>
                                <span className={estilo.card_meta}>
                                    {comunicado.data} · {comunicado.autor} ·{" "}
                                    {comunicado.confirmacoes + (lidas.includes(comunicado.id) ? 1 : 0)}{" "}
                                    leitura(s) confirmada(s)
                                    {lidas.includes(comunicado.id) ? (
                                        <span className={estilo.tag_lido}> · Você leu</span>
                                    ) : null}
                                </span>

                                <div className={estilo.card_acoes}>
                                    <button className={estilo.botao_editar}>Editar</button>
                                    <button
                                        className={estilo.botao_confirmar}
                                        onClick={() => confirmarLeitura(comunicado.id)}
                                        disabled={lidas.includes(comunicado.id)}
                                    >
                                        <LuCheck size={16} />
                                        {lidas.includes(comunicado.id)
                                            ? "Leitura confirmada"
                                            : "Confirmar leitura"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}

                    {comunicadosFiltrados.length === 0 && (
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
