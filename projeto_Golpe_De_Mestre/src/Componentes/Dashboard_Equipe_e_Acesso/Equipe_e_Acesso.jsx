import estilo from "./Equipe_e_Acesso.module.css"
import {
  LuLayoutGrid,
  LuFilePlus2,
  LuUsersRound,
  LuLayers3,
  LuBookOpen,
  LuCheck,
  LuPresentation,
  LuClipboardList,
  LuBell,
  LuMail,
  LuCalendarDays,
  LuChartNoAxesColumnIncreasing,
  LuHeart,
  LuWalletCards,
  LuShield,
  LuUserRoundCheck,
  LuSun,
  LuPlus
} from "react-icons/lu";
function Equipe_e_Acesso(){
    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
    return(
        <>
          <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Equipe e Acesso</strong>
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

                            <h1>Equipe e acessos</h1>

                            <p>
                                Vínculos claros entre gestão, educadores, alunos e responsáveis.
                            </p>
                        </div>

                        <div className={estilo.acoes_titulo}>
                            <button className={estilo.botao_exportar}>
                                <LuPlus size={21} />
                                Novo perfil local
                            </button>
                        </div>
                    </div>


                   
                    <div className={estilo.cards_perfis}>

                        <div className={estilo.card_perfil}>
                            <LuShield
                                size={21}
                                className={estilo.icone_card}
                            />

                            <h3>Gestão</h3>

                            <p>
                                Secretaria, equipe, recursos e visão institucional.
                            </p>
                        </div>


                        <div className={estilo.card_perfil}>
                            <LuBookOpen
                                size={21}
                                className={estilo.icone_card}
                            />

                            <h3>Professor</h3>

                            <p>
                                Somente suas turmas e o acompanhamento pedagógico.
                            </p>
                        </div>


                        <div className={estilo.card_perfil}>
                            <LuUsersRound
                                size={21}
                                className={estilo.icone_card}
                            />

                            <h3>Aluno e família</h3>

                            <p>
                                Somente alunos vinculados, atividades e comunicados.
                            </p>
                        </div>

                    </div>


                    
                    <p className={estilo.texto_tabela}>
                        Consulte os perfis e as permissões de acesso da equipe.
                    </p>


                    
                    <div className={estilo.tabela_container}>

                        <table className={estilo.tabela}>

                            <thead>
                                <tr>
                                    <th>NOME</th>
                                    <th>PERFIL</th>
                                    <th>VÍNCULO</th>
                                    <th>SITUAÇÃO</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>Coordenação</td>
                                    <td>Administrador</td>
                                    <td>Institucional</td>

                                    <td>
                                        <span className={estilo.status_ativo}>
                                            Ativo
                                        </span>
                                    </td>

                                    <td>
                                        <div className={estilo.acoes_tabela}>
                                            <button className={estilo.botao_editar}>
                                                Editar
                                            </button>

                                            <button className={estilo.botao_explorar}>
                                                Explorar perfil
                                            </button>
                                        </div>
                                    </td>
                                </tr>


                                <tr>
                                    <td>Professor A</td>
                                    <td>Professor</td>
                                    <td>Professor A</td>

                                    <td>
                                        <span className={estilo.status_ativo}>
                                            Ativo
                                        </span>
                                    </td>

                                    <td>
                                        <div className={estilo.acoes_tabela}>
                                            <button className={estilo.botao_editar}>
                                                Editar
                                            </button>

                                            <button className={estilo.botao_explorar}>
                                                Explorar perfil
                                            </button>
                                        </div>
                                    </td>
                                </tr>


                                <tr>
                                    <td>Professor B</td>
                                    <td>Professor</td>
                                    <td>Professor B</td>

                                    <td>
                                        <span className={estilo.status_ativo}>
                                            Ativo
                                        </span>
                                    </td>

                                    <td>
                                        <div className={estilo.acoes_tabela}>
                                            <button className={estilo.botao_editar}>
                                                Editar
                                            </button>

                                            <button className={estilo.botao_explorar}>
                                                Explorar perfil
                                            </button>
                                        </div>
                                    </td>
                                </tr>


                                <tr>
                                    <td>Ana</td>
                                    <td>Aluno</td>
                                    <td>Ana</td>

                                    <td>
                                        <span className={estilo.status_ativo}>
                                            Ativo
                                        </span>
                                    </td>

                                    <td>
                                        <div className={estilo.acoes_tabela}>
                                            <button className={estilo.botao_editar}>
                                                Editar
                                            </button>

                                            <button className={estilo.botao_explorar}>
                                                Explorar perfil
                                            </button>
                                        </div>
                                    </td>
                                </tr>


                                <tr>
                                    <td>Família</td>
                                    <td>Responsável</td>
                                    <td>Ana, Clara</td>

                                    <td>
                                        <span className={estilo.status_ativo}>
                                            Ativo
                                        </span>
                                    </td>

                                    <td>
                                        <div className={estilo.acoes_tabela}>
                                            <button className={estilo.botao_editar}>
                                                Editar
                                            </button>

                                            <button className={estilo.botao_explorar}>
                                                Explorar perfil
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                    <section className={estilo.atividade_recente}>

                        <h2>Atividade recente</h2>

                        <p>
                            As próximas alterações realizadas na gestão educacional serão registradas aqui.
                        </p>

                    </section>

                </section>
          </main>
        </>
    )
}
export default Equipe_e_Acesso;