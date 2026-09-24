import estilo from "./faixas.module.css"
import {
    LuBell
} from "react-icons/lu";
import { Link } from "react-router-dom";
import alunos from "../Dashboard_Alunos/dadosAlunos";

function Faixas() {
    const Hoje = new Date();
    return (
        <>
            <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Faixas</strong>
                        <p>{Hoje.toLocaleDateString("pt-br", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                        })} </p>
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
                    <div className={estilo.container_titulo_main}>
                        <div>
                            <strong>Área da equipe</strong>
                            <h1>Acompanhamento de faixas</h1>
                            <p>Observe o percurso e planeje avaliações individuai</p>
                        </div>
                    </div>

                    <div className={estilo.container_form}>
                        <div>
                            <label>Buscar aluno</label>
                            <input type="text" name="" id="" />
                        </div>

                        <div>
                            <label>Programa</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Faixa</label>
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

                        <div>
                            <label>Faixa etária</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Próxima avaliação</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Presença máxima (%)</label>
                            <input type="text" name="" id="" />
                        </div>
                    </div>

                    <div className={estilo.container_tabela}>
                        <table className={estilo.tabela}>

                            <thead>
                                <tr>
                                    <th>ALUNO</th>
                                    <th>FAIXA E GRAUS</th>
                                    <th>PRESENÇA</th>
                                    <th>PRÓXIMA AVALIAÇÃO</th>
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

                                                    <div className={estilo.avatar}>
                                                        {aluno.iniciais}
                                                    </div>

                                                    <div className={estilo.informacoes_aluno}>
                                                        <strong>{aluno.nome}</strong>
                                                        <span>{aluno.categoria}</span>
                                                    </div>

                                                </div>
                                            </Link>
                                        </td>


                                        
                                        <td>
                                            <div className={estilo.faixa}>

                                                <img
                                                    src={aluno.faixa.imagem}
                                                    alt={`Faixa ${aluno.faixa.nome.toLowerCase()}`}
                                                />

                                                <span>
                                                    {aluno.faixa.nome}
                                                    <small>
                                                        {" "}· {aluno.faixa.graus}{" "}
                                                        {aluno.faixa.graus === 1
                                                            ? "grau"
                                                            : "graus"}
                                                    </small>
                                                </span>

                                            </div>
                                        </td>


                                        
                                        <td>
                                            <div className={estilo.presenca}>

                                                <div className={estilo.barra_presenca}>
                                                    <div
                                                        className={estilo.progresso_presenca}
                                                        style={{
                                                            width: `${aluno.presenca || 88}%`
                                                        }}
                                                    ></div>
                                                </div>

                                                <span>
                                                    {aluno.presenca || 88}%
                                                </span>

                                            </div>
                                        </td>


                                        
                                        <td>
                                            <span className={estilo.proxima_avaliacao}>
                                                {aluno.proximaAvaliacao || "—"}
                                            </span>
                                        </td>


                                       
                                        <td>
                                            <button
                                                type="button"
                                                className={estilo.botao_avaliar}
                                            >
                                                Avaliar
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </section>
            </main>
        </>
    )
}
export default Faixas;