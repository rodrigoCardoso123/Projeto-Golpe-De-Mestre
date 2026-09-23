import estilo from "./turmas.module.css";
import { useNavigate } from "react-router-dom";
import { LuBell, LuLayers3, LuUserRound, LuDumbbell, LuClock, LuMapPin, LuUsersRound, LuChevronRight } from "react-icons/lu";
import turmas from "./dadosTurmas.js";

function Turmas(){
    const navigate = useNavigate();
    const Hoje = new Date();
    return(
        <>
            <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Turmas e horários</strong>
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
                            <h1>Turmas e horários</h1>
                            <p>Programas, encontros e vínculos em um só lugar.</p>
                        </div>
                        <button onClick={() => {}}>+  Nova turma</button>
                    </div>

                    <div className={estilo.container_form}>
                        <div>
                            <label>Buscar turma</label>
                            <input type="text" name="" id="" placeholder="Nome da turma" />
                        </div>

                        <div>
                            <label>Status</label>
                            <select name="">
                                <option value="">Todas</option>
                                <option value="Ativa">Ativa</option>
                                <option value="Inativa">Inativa</option>
                            </select>
                        </div>
                    </div>

                    <div className={estilo.container_cards}>
                        {turmas.map((turma) => (
                            <article key={turma.id} className={estilo.card_turma}>

                                <div className={estilo.topo_card}>
                                    <div className={estilo.icone_turma}>
                                        <LuLayers3 size={22} />
                                    </div>

                                    <span className={estilo.situacao}>{turma.situacao}</span>
                                </div>

                                <div className={estilo.info_principal}>
                                    <small>{turma.programa}</small>
                                    <h2>{turma.nome}</h2>
                                    <p>{turma.descricao}</p>
                                </div>

                                <ul className={estilo.lista_detalhes}>
                                    <li>
                                        <LuUserRound size={16} className={estilo.icone_detalhe} />
                                        <div>
                                            <span>Professor</span>
                                            <strong>{turma.professor}</strong>
                                        </div>
                                    </li>

                                    <li>
                                        <LuDumbbell size={16} className={estilo.icone_detalhe} />
                                        <div>
                                            <span>Esporte</span>
                                            <strong>{turma.esporte}</strong>
                                        </div>
                                    </li>

                                    <li>
                                        <LuClock size={16} className={estilo.icone_detalhe} />
                                        <div>
                                            <span>Horário</span>
                                            <strong>{turma.horario}</strong>
                                        </div>
                                    </li>

                                    <li>
                                        <LuMapPin size={16} className={estilo.icone_detalhe} />
                                        <div>
                                            <span>Local</span>
                                            <strong>{turma.local}</strong>
                                        </div>
                                    </li>
                                </ul>

                                <div className={estilo.container_lotacao}>
                                    <div className={estilo.rotulo_lotacao}>
                                        <span>
                                            {turma.alunosAtivos} de {turma.capacidade} alunos
                                        </span>
                                        <span>{turma.capacidade - turma.alunosAtivos} vaga(s)</span>
                                    </div>

                                    <div className={estilo.barra}>
                                        <div
                                            className={estilo.progresso}
                                            style={{ width: `${(turma.alunosAtivos / turma.capacidade) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className={estilo.rodape_card}>
                                    <button
                                        className={estilo.botao_ver}
                                        onClick={() => navigate(`/Dashboard/turmas/perfil/${turma.id}`)}
                                    >
                                        Ver turma
                                        <LuChevronRight size={14} />
                                    </button>

                                    <button className={estilo.botao_editar}>Editar</button>
                                </div>

                            </article>
                        ))}
                    </div>

                </section>
            </main>
        </>
    )
}
export default Turmas;
