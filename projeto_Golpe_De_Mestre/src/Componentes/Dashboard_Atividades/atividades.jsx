import { useState } from "react";
import estilo from "./atividades.module.css";
import { LuBell, LuPlus, LuCalendarDays, LuClipboardList, LuNotebookPen, LuSearch } from "react-icons/lu";
import turmas from "../Dashboard_Turmas/dadosTurmas";

const TIPOS = {
    reflexao: { nome: "Reflexão", icone: <LuNotebookPen size={16} /> },
    pratica: { nome: "Prática", icone: <LuClipboardList size={16} /> }
};

const ATIVIDADES = [
    {
        id: 1,
        turma: "Turma A",
        tipo: "reflexao",
        titulo: "Meu combinado da semana",
        descricao: "Escolha um cuidado com sua rotina e conte como pretende colocá-lo em prática.",
        prazo: "20/09/2026",
        entregas: 0,
        aguardando: 0,
        situacao: "Publicada"
    }
];

function Atividades() {
    const [busca, setBusca] = useState("");
    const [turma, setTurma] = useState("todas");
    const [situacao, setSituacao] = useState("todas");

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const atividadesFiltradas = ATIVIDADES.filter((atividade) => {
        const correspondeBusca = atividade.titulo
            .toLowerCase()
            .includes(busca.trim().toLowerCase());

        const correspondeTurma = turma === "todas" || atividade.turma === turma;

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
                        <h1>Atividades e devolutivas</h1>
                        <p>
                            Propostas para ampliar o aprendizado e acompanhar cada entrega.
                        </p>
                    </div>
                    <button className={estilo.botao_nova_atividade}>
                        <LuPlus size={16} />
                        Nova atividade
                    </button>
                </div>

                <div className={estilo.container_filtros}>
                    <div className={estilo.campo}>
                        <label htmlFor="busca-atividade">Buscar atividades</label>
                        <input
                            id="busca-atividade"
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
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
                            {turmas.map((t) => (
                                <option key={t.id} value={t.nome}>
                                    {t.nome}
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

                <div className={estilo.lista_atividades}>
                    {atividadesFiltradas.map((atividade) => (
                        <article key={atividade.id} className={estilo.card_atividade}>
                            <div className={estilo.card_topo}>
                                <span className={estilo.card_turma}>
                                    {atividade.turma.toUpperCase()}
                                </span>
                                <span className={estilo.badge_publicada}>
                                    {atividade.situacao}
                                </span>
                            </div>

                            <div className={estilo.card_tipo}>
                                {TIPOS[atividade.tipo].icone}
                                <span>{TIPOS[atividade.tipo].nome}</span>
                            </div>

                            <h2>{atividade.titulo}</h2>
                            <p>{atividade.descricao}</p>

                            <div className={estilo.card_prazo}>
                                <LuCalendarDays size={16} />
                                <span>Prazo: {atividade.prazo}</span>
                            </div>

                            <div className={estilo.card_entregas}>
                                <strong>{atividade.entregas}</strong>
                                <span>entregas.</span>
                                <strong>{atividade.aguardando}</strong>
                                <span>aguardam devolutiva</span>
                            </div>

                            <div className={estilo.card_acoes}>
                                <button className={estilo.botao_acompanhar}>
                                    Acompanhar entregas
                                </button>
                                <button className={estilo.botao_editar}>Editar</button>
                            </div>
                        </article>
                    ))}

                    {atividadesFiltradas.length === 0 && (
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
