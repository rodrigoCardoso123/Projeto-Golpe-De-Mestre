import estilo from "./alunos.module.css"
import { Link, useNavigate } from "react-router-dom";
import { LuBell } from "react-icons/lu";
import alunos from "./dadosAlunos.js";

function Alunos(){
    const navigate = useNavigate();
    const Hoje = new Date();
    return(
        <>
            <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Alunos</strong>
                        <p>{Hoje.toLocaleDateString("pt-br", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                        })} </p>
                    </div>
                    <div className={estilo.perfil_header}>
                        <LuBell size={22} className={estilo.icone_header} />
                        <div className={estilo.conteudo_perfil}>
                            <p>CM</p>
                            <div>
                                <strong>Coordenação</strong>
                                <small>Administrador</small>
                            </div>
                        </div>
                    </div>
                </header>
                <section className={estilo.section_main}>

                    <div className={estilo.container_titulo_main}>
                        <div>
                            <strong>Área da equipe</strong>
                            <h1>Alunos</h1>
                            <p>Cadastros, vínculos e acompanhamento individual.</p>
                        </div>
                        <button onClick={() => navigate("/Dashboard/alunos/novo")}>+  Novo aluno</button>
                    </div>

                    <div className={estilo.container_form}>
                        <div>
                            <label>Buscar Aluno</label>
                            <input type="text" name="" id="" placeholder="Nome do aluno" />
                        </div>

                        <div>
                            <label>Programa</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Turma</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Situação</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>
                    </div>

                    <div className={estilo.container_tabela}>
                        <table className={estilo.tabela}>

                            <thead>
                                <tr>
                                    <th>ALUNO</th>
                                    <th>TURMA</th>
                                    <th>FAIXA</th>
                                    <th>PRESENÇA</th>
                                    <th>SITUAÇÃO</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {alunos.map((aluno) => (
                                    <tr key={aluno.id}>
                                        <td>
                                            <Link
                                                to={`/Dashboard/alunos/perfil/${aluno.id}`}
                                                className={estilo.link_aluno}
                                                title={`Ver perfil de ${aluno.nome}`}
                                            >
                                                <div className={estilo.aluno}>
                                                    <div className={estilo.avatar}>{aluno.iniciais}</div>

                                                    <div className={estilo.informacoes_aluno}>
                                                        <strong>{aluno.nome}</strong>
                                                        <span>{aluno.categoria}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td>{aluno.turma}</td>

                                        <td>
                                            <div className={estilo.faixa}>
                                                <img
                                                    src={aluno.faixa.imagem}
                                                    alt={`Faixa ${aluno.faixa.nome.toLowerCase()}`}
                                                />
                                                <span>
                                                    {aluno.faixa.nome} <small>· {aluno.faixa.graus} {aluno.faixa.graus === 1 ? "grau" : "graus"}</small>
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className={estilo.presenca}>
                                                <div className={estilo.barra}>
                                                    <div
                                                        className={estilo.progresso}
                                                        style={{ width: `${aluno.presenca}%` }}
                                                    ></div>
                                                </div>

                                                <span>{aluno.presenca}%</span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className={estilo.ativo}>{aluno.situacao}</span>
                                        </td>

                                        <td>
                                            <Link
                                                to={`/Dashboard/alunos/perfil/${aluno.id}`}
                                                className={estilo.editar}
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={estilo.rodape_tabela}>
                        <span>{alunos.length} aluno(s) encontrado(s)</span>

                        <div className={estilo.paginacao}>
                            <button type="button" aria-label="Página anterior">
                                ←
                            </button>
                            <span>1 / 2</span>
                            <button type="button" aria-label="Próxima página">
                                →
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
export default Alunos;
