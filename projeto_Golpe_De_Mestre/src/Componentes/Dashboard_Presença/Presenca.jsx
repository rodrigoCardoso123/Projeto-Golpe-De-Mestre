import estilo from "./Presenca.module.css"
import {
  LuBell
} from "react-icons/lu";
import { Link } from "react-router-dom";
import alunos from "../Dashboard_Alunos/dadosAlunos";

function Presenca(){
     const Hoje = new Date();
    return(
        <>
            <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Presença</strong>
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
                            <h1>Presença</h1>
                            <p>Registre a participação e mantenha o acompanhament</p>
                        </div>
                    </div>

                    <div className={estilo.container_form}>
                        <div>
                            <label>Mês</label>
                            <input type="date" name="" id="" />
                        </div>

                        <div>
                            <label>Turma</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Professor</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Programa</label>
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
                                    <th>FAIXA</th>
                                    <th>PRESENÇA</th>
                                    <th>OBSERVAÇÃO</th>
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
                                            <div className={estilo.opcoes_presenca}>

                                                <label className={estilo.opcao_presenca}>
                                                    <input
                                                        type="radio"
                                                        name={`presenca-${aluno.id}`}
                                                        value="presente"
                                                    />
                                                    <span>Presente</span>
                                                </label>

                                                <label className={estilo.opcao_presenca}>
                                                    <input
                                                        type="radio"
                                                        name={`presenca-${aluno.id}`}
                                                        value="ausente"
                                                    />
                                                    <span>Ausente</span>
                                                </label>

                                                <label className={estilo.opcao_presenca}>
                                                    <input
                                                        type="radio"
                                                        name={`presenca-${aluno.id}`}
                                                        value="justificado"
                                                    />
                                                    <span>Justificado</span>
                                                </label>

                                            </div>
                                        </td>

                                        
                                        <td>
                                            <input
                                                type="text"
                                                className={estilo.observacao}
                                                placeholder=""
                                            />
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div> 
                    <div className={estilo.container_footer}>
                        <p>Marque a presença dos alunos.</p>

                        <div className={estilo.container_botoes}>
                            <button className={estilo.botao_todos}>
                                
                                <span>Todos presentes</span>
                            </button>

                            <button className={estilo.botao_salvar}>
                                
                                <span>Salvar presença</span>
                            </button>
                        </div>
                    </div>    
                </section>
            </main>
        </>
    )
}
export default Presenca;