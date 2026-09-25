import { useState } from "react";
import estilo from "./visitas.module.css";
import { LuBell, LuCalendarDays, LuArrowUpRight } from "react-icons/lu";

const VISITAS = [];

function Visitas() {
    const [busca, setBusca] = useState("");
    const [situacao, setSituacao] = useState("todas");
    const [data, setData] = useState("");
    const [visao, setVisao] = useState("lista");

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const visitasFiltradas = VISITAS.filter((visita) => {
        const correspondeBusca = visita.visitante
            .toLowerCase()
            .includes(busca.trim().toLowerCase());

        const correspondeSituacao =
            situacao === "todas" || visita.situacao === situacao;

        const correspondeData = !data || visita.data === data;

        return correspondeBusca && correspondeSituacao && correspondeData;
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
                        <h1>Solicitações de visita</h1>
                        <p>
                            Organize o contato e confirme cada encontro com cuidado.
                        </p>
                    </div>
                    <button className={estilo.botao_formulario}>
                        Ver formulário público
                        <LuArrowUpRight size={16} />
                    </button>
                </div>

                <div className={estilo.container_filtros}>
                    <div className={estilo.campo}>
                        <label htmlFor="busca-visitante">Buscar visitante</label>
                        <input
                            id="busca-visitante"
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
                            <option value="Solicitada">Solicitada</option>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Realizada">Realizada</option>
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
                                className={
                                    visao === "lista" ? estilo.seletor_visao_ativo : ""
                                }
                                onClick={() => setVisao("lista")}
                            >
                                Lista
                            </button>
                            <button
                                className={visao === "dia" ? estilo.seletor_visao_ativo : ""}
                                onClick={() => setVisao("dia")}
                            >
                                Dia
                            </button>
                            <button
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

                {visitasFiltradas.length > 0 ? (
                    <div className={estilo.lista_visitas}>
                        {visitasFiltradas.map((visita) => (
                            <article key={visita.id} className={estilo.card_visita}>
                                <div className={estilo.card_topo}>
                                    <span className={estilo.card_tag}>
                                        {visita.programa}
                                    </span>
                                    <span className={estilo.badge_situacao}>
                                        {visita.situacao}
                                    </span>
                                </div>

                                <h2>{visita.visitante}</h2>
                                <p>{visita.mensagem}</p>

                                <div className={estilo.card_rodape}>
                                    <span className={estilo.card_meta}>
                                        {visita.data} · {visita.horario}
                                    </span>

                                    <div className={estilo.card_acoes}>
                                        <button className={estilo.botao_editar}>
                                            Editar
                                        </button>
                                        <button className={estilo.botao_confirmar}>
                                            Confirmar visita
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={estilo.estado_vazio}>
                        <LuCalendarDays size={46} />
                        <h3>Nenhuma visita nesta seleção</h3>
                        <p>
                            Acompanhe as solicitações recebidas pelo formulário público.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Visitas;
