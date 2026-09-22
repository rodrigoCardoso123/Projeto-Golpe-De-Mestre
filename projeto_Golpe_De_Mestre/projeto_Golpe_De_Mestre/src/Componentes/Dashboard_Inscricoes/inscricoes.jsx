import { useState } from "react";
import { useNavigate } from "react-router-dom";
import estilo from "./inscricoes.module.css";
import { LuBell, LuPlus } from "react-icons/lu";

const SITUACOES = {
    nova: { nome: "Nova", classe: "badge_nova" },
    analise: { nome: "Em análise", classe: "badge_analise" },
    espera: { nome: "Lista de espera", classe: "badge_espera" },
    aprovada: { nome: "Aprovada", classe: "badge_aprovada" },
    matriculada: { nome: "Matriculada", classe: "badge_matriculada" }
};

const FILTROS = [
    { chave: "todas", nome: "Todas" },
    { chave: "nova", nome: "Nova" },
    { chave: "analise", nome: "Em análise" },
    { chave: "espera", nome: "Lista de espera" },
    { chave: "aprovada", nome: "Aprovada" },
    { chave: "matriculada", nome: "Matriculada" }
];

const INSCRICOES = [
    {
        id: 1,
        candidato: "Candidato A",
        responsavel: "Responsável A",
        programa: "Infantil",
        data: "03/09/2026",
        situacao: "analise"
    },
    {
        id: 2,
        candidato: "Candidato B",
        responsavel: "Responsável B",
        programa: "Juvenil",
        data: "31/08/2026",
        situacao: "espera"
    }
];

function Inscricoes() {
    const navigate = useNavigate();

    const [filtroAtivo, setFiltroAtivo] = useState("todas");
    const [busca, setBusca] = useState("");
    const [programa, setPrograma] = useState("todos");

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const contarPorSituacao = (chave) =>
        chave === "todas"
            ? INSCRICOES.length
            : INSCRICOES.filter((inscricao) => inscricao.situacao === chave).length;

    const programas = ["todos", ...new Set(INSCRICOES.map((i) => i.programa))];

    const inscricoesFiltradas = INSCRICOES.filter((inscricao) => {
        const correspondeFiltro =
            filtroAtivo === "todas" || inscricao.situacao === filtroAtivo;

        const correspondePrograma =
            programa === "todos" || inscricao.programa === programa;

        const texto = `${inscricao.candidato} ${inscricao.responsavel}`.toLowerCase();
        const correspondeBusca = texto.includes(busca.trim().toLowerCase());

        return correspondeFiltro && correspondePrograma && correspondeBusca;
    });

    return (
        <main className={estilo.container}>
            <header className={estilo.header}>
                <div className={estilo.titulo_header}>
                    <strong>Inscrições e matrículas</strong>
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
                        <h1>Inscrições e matrículas</h1>
                        <p>
                            Acompanhe a entrada no projeto, da primeira conversa à turma.
                        </p>
                    </div>
                    <button
                        className={estilo.botao_nova_inscricao}
                        onClick={() => navigate("/Dashboard/inscricoes/nova")}
                    >
                        <LuPlus size={16} />
                        Nova inscrição
                    </button>
                </div>

                <div className={estilo.container_filtros}>
                    {FILTROS.map((filtro) => (
                        <button
                            key={filtro.chave}
                            className={`${estilo.filtro} ${
                                filtroAtivo === filtro.chave ? estilo.filtro_ativo : ""
                            }`}
                            onClick={() => setFiltroAtivo(filtro.chave)}
                        >
                            <strong>{contarPorSituacao(filtro.chave)}</strong>
                            <span>{filtro.nome}</span>
                        </button>
                    ))}
                </div>

                <div className={estilo.container_busca}>
                    <div className={estilo.campo}>
                        <label htmlFor="busca-candidato">
                            Buscar candidato ou responsável
                        </label>
                        <input
                            id="busca-candidato"
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div className={estilo.campo}>
                        <label htmlFor="filtro-programa">Programa</label>
                        <select
                            id="filtro-programa"
                            value={programa}
                            onChange={(e) => setPrograma(e.target.value)}
                        >
                            {programas.map((opcao) => (
                                <option key={opcao} value={opcao}>
                                    {opcao === "todos" ? "Todos" : opcao}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={estilo.tabela}>
                    <table>
                        <thead>
                            <tr>
                                <th>Candidato</th>
                                <th>Programa</th>
                                <th>Inscrição</th>
                                <th>Situação</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscricoesFiltradas.map((inscricao) => (
                                <tr key={inscricao.id}>
                                    <td>
                                        <div className={estilo.candidato}>
                                            <strong>{inscricao.candidato}</strong>
                                            <span>{inscricao.responsavel}</span>
                                        </div>
                                    </td>
                                    <td>{inscricao.programa}</td>
                                    <td>{inscricao.data}</td>
                                    <td>
                                        <span
                                            className={
                                                estilo[SITUACOES[inscricao.situacao].classe]
                                            }
                                        >
                                            {SITUACOES[inscricao.situacao].nome}
                                        </span>
                                    </td>
                                    <td className={estilo.coluna_acao}>
                                        <button className={estilo.botao_analisar}>
                                            Analisar
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {inscricoesFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan={5} className={estilo.sem_resultados}>
                                        Nenhuma inscrição encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default Inscricoes;
