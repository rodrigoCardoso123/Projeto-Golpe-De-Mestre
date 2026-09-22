import estilo from "./alunos.module.css"
import { useNavigate } from "react-router-dom";
import {
  LuBell
} from "react-icons/lu";

function Aluno(){
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
                            <p>GM</p>
                            <div>
                                <strong>Coordenação</strong>
                                <small>Administrador</small>
                            </div>
                        </div>
                    </div>
                </header>
                <section className={estilo.section_main}>

                    <div className={estilo.container_titulo_main}>                        <div>
                            <strong>Área da equipe</strong>
                            <h1>Alunos</h1>
                            <p>Cadastros, vínculos e acompanhamento individual.</p>
                        </div>
                        <button onClick={() => { navigate("/Dashboard/inscricoes/nova") }}>+  Nova inscrição</button>
                    </div>

                    <div className={estilo.container_form}>
                        <div>
                            <label>Buscar Aluno</label>
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

                                
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>AD</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Ana</strong>
                                                <span>Infantil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma A</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - branca.png"
                                                alt="Faixa branca"
                                            />
                                            <span>
                                                Branca <small>· 0 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "88%" }}
                                                ></div>
                                            </div>

                                            <span>88%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>


                                
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>BD</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Bruno</strong>
                                                <span>Juvenil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma B</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - cinza.png"
                                                alt="Faixa cinza"
                                            />
                                            <span>
                                                Cinza <small>· 1 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "88%" }}
                                                ></div>
                                            </div>

                                            <span>88%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>


                                
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>CD</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Clara</strong>
                                                <span>Infantil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma A</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - amarela.png"
                                                alt="Faixa amarela"
                                            />
                                            <span>
                                                Amarela <small>· 2 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "88%" }}
                                                ></div>
                                            </div>

                                            <span>88%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>


                               
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>DD</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Davi</strong>
                                                <span>Juvenil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma B</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - laranja.png"
                                                alt="Faixa laranja"
                                            />
                                            <span>
                                                Laranja <small>· 3 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "88%" }}
                                                ></div>
                                            </div>

                                            <span>88%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>


                                
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>ED</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Elisa</strong>
                                                <span>Infantil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma A</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - verde.png"
                                                alt="Faixa verde"
                                            />
                                            <span>
                                                Verde <small>· 0 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "88%" }}
                                                ></div>
                                            </div>

                                            <span>88%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>


                                
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>FD</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Felipe</strong>
                                                <span>Juvenil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma B</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - branca.png"
                                                alt="Faixa branca"
                                            />
                                            <span>
                                                Branca <small>· 1 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "88%" }}
                                                ></div>
                                            </div>

                                            <span>88%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>


                               
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>GD</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Gabriela</strong>
                                                <span>Infantil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma A</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - cinza.png"
                                                alt="Faixa cinza"
                                            />
                                            <span>
                                                Cinza <small>· 2 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "75%" }}
                                                ></div>
                                            </div>

                                            <span>75%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>


                                
                                <tr>
                                    <td>
                                        <div className={estilo.aluno}>
                                            <div className={estilo.avatar}>HD</div>

                                            <div className={estilo.informacoes_aluno}>
                                                <strong>Hugo</strong>
                                                <span>Juvenil</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Turma B</td>

                                    <td>
                                        <div className={estilo.faixa}>
                                            <img
                                                src="/Faixa - amarela.png"
                                                alt="Faixa amarela"
                                            />
                                            <span>
                                                Amarela <small>· 3 graus</small>
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className={estilo.presenca}>
                                            <div className={estilo.barra}>
                                                <div
                                                    className={estilo.progresso}
                                                    style={{ width: "75%" }}
                                                ></div>
                                            </div>

                                            <span>75%</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={estilo.ativo}>Ativo</span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.editar}>
                                            Editar
                                        </a>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    )
}
export default Aluno;