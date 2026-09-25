import { useState } from "react";
import estilo from "./relatorios.module.css";
import {
    LuBell,
    LuDownload,
    LuPrinter,
    LuUsersRound,
    LuCheck,
    LuChartNoAxesColumnIncreasing
} from "react-icons/lu";
import turmas from "../Dashboard_Turmas/dadosTurmas";

const ALUNOS = [
    { id: 1, nome: "Ana", turma: "Turma A", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 2, nome: "Bruno", turma: "Turma B", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 3, nome: "Carla", turma: "Turma A", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 4, nome: "Davi", turma: "Turma B", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 5, nome: "Elisa", turma: "Turma A", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 6, nome: "Felipe", turma: "Turma B", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 7, nome: "Gabriela", turma: "Turma A", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 8, nome: "Hugo", turma: "Turma B", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 9, nome: "Iris", turma: "Turma A", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 10, nome: "João", turma: "Turma B", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 11, nome: "Lara", turma: "Turma A", situacao: "Ativo", presente: 1, ausente: 0, justificado: 0 },
    { id: 12, nome: "Miguel", turma: "Turma B", situacao: "Inativo", presente: 1, ausente: 0, justificado: 0 }
];

function calcularPresenca(aluno) {
    const total = aluno.presente + aluno.ausente + aluno.justificado;

    if (total === 0) return "0%";

    return `${Math.round((aluno.presente / total) * 100)}%`;
}

function Relatorios() {
    const [de, setDe] = useState("");
    const [ate, setAte] = useState("");
    const [turma, setTurma] = useState("todas");

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const alunosFiltrados = ALUNOS.filter(
        (aluno) => turma === "todas" || aluno.turma === turma
    );

    const totalAlunos = alunosFiltrados.length;

    const totalRegistros = alunosFiltrados.reduce(
        (soma, aluno) => soma + aluno.presente + aluno.ausente + aluno.justificado,
        0
    );

    const totalPresencas = alunosFiltrados.reduce((soma, aluno) => soma + aluno.presente, 0);
    const totalAusencias = alunosFiltrados.reduce((soma, aluno) => soma + aluno.ausente, 0);

    const presencaMedia =
        totalRegistros === 0
            ? "0%"
            : `${Math.round((totalPresencas / totalRegistros) * 100)}%`;

    const exportarCSV = () => {
        const cabecalho = ["Aluno", "Turma", "Situação", "Presente", "Ausente", "Justificado", "Presença"];
        const linhas = alunosFiltrados.map((aluno) => [
            aluno.nome,
            aluno.turma,
            aluno.situacao,
            aluno.presente,
            aluno.ausente,
            aluno.justificado,
            calcularPresenca(aluno)
        ]);

        const conteudo = [cabecalho, ...linhas]
            .map((linha) => linha.join(";"))
            .join("\n");

        const blob = new Blob(["\uFEFF" + conteudo], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "relatorio-acompanhamento.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className={estilo.container}>
            <header className={estilo.header}>
                <div className={estilo.titulo_header}>
                    <strong>Relatórios</strong>
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
                        <h1>Relatórios de acompanhamento</h1>
                        <p>
                            Indicadores calculados a partir de matrículas e chamadas
                            registradas.
                        </p>
                    </div>
                    <div className={estilo.acoes_titulo}>
                        <button className={estilo.botao_exportar} onClick={exportarCSV}>
                            <LuDownload size={16} />
                            Exportar CSV
                        </button>
                        <button
                            className={estilo.botao_imprimir}
                            onClick={() => window.print()}
                        >
                            <LuPrinter size={16} />
                            Imprimir relatório
                        </button>
                    </div>
                </div>

                <div className={estilo.container_filtros}>
                    <div className={estilo.campo}>
                        <label htmlFor="filtro-de">De</label>
                        <input
                            id="filtro-de"
                            type="date"
                            value={de}
                            onChange={(e) => setDe(e.target.value)}
                        />
                    </div>

                    <div className={estilo.campo}>
                        <label htmlFor="filtro-ate">Até</label>
                        <input
                            id="filtro-ate"
                            type="date"
                            value={ate}
                            onChange={(e) => setAte(e.target.value)}
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
                </div>

                <div className={estilo.container_indicadores}>
                    <div className={estilo.indicador}>
                        <div className={estilo.indicador_topo}>
                            <span>Alunos na seleção</span>
                            <LuUsersRound size={20} />
                        </div>
                        <strong>{totalAlunos}</strong>
                        <small>Inclui qualquer matrícula</small>
                    </div>

                    <div className={estilo.indicador}>
                        <div className={estilo.indicador_topo}>
                            <span>Registros de presença</span>
                            <LuCheck size={20} />
                        </div>
                        <strong>{totalRegistros}</strong>
                        <small>Chamadas no período</small>
                    </div>

                    <div className={estilo.indicador}>
                        <div className={estilo.indicador_topo}>
                            <span>Presença média</span>
                            <LuChartNoAxesColumnIncreasing size={20} />
                        </div>
                        <strong>{presencaMedia}</strong>
                        <small>
                            {totalPresencas} presenças · {totalAusencias} ausências
                        </small>
                    </div>
                </div>

                <div className={estilo.container_tabela}>
                    <table className={estilo.tabela}>
                        <thead>
                            <tr>
                                <th>Aluno</th>
                                <th>Turma</th>
                                <th>Situação</th>
                                <th>Presente</th>
                                <th>Ausente</th>
                                <th>Justificado</th>
                                <th>Presença</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunosFiltrados.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.turma}</td>
                                    <td>{aluno.situacao}</td>
                                    <td>{aluno.presente}</td>
                                    <td>{aluno.ausente}</td>
                                    <td>{aluno.justificado}</td>
                                    <td>{calcularPresenca(aluno)}</td>
                                </tr>
                            ))}

                            {alunosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={7} className={estilo.sem_resultados}>
                                        Nenhum aluno nesta seleção.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <p className={estilo.nota_rodape}>
                    Indicador operacional, não compromisso de impacto. A taxa considera
                    presenças divididas por todos os registros, incluindo ausências
                    justificadas. Nenhum registro é semestral.
                </p>
            </section>
        </main>
    );
}

export default Relatorios;
