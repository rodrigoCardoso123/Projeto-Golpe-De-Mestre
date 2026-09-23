import estilo from "./visaoGeral.module.css"
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
  LuTarget
} from "react-icons/lu";
function VisaoGeral(){
    const hoje = new Date();
    const diasSemana = [
        "Dom",
        "Seg",
        "Ter",
        "Qua",
        "Qui",
        "Sex",
        "Sáb"
    ];

    const diasSemanaCompleto = [
        "Domingo",
        "Segunda",
        "Terca",
        "Quata",
        "Quita",
        "Sexta",
        "Sábado"
    ];

    const dias = Array.from({ length: 7 }, (_, index) => {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + index);

        return {
            data,
            numero: data.getDate(),
            diaSemana: diasSemana[data.getDay()],
            diaSemanaC: diasSemanaCompleto[data.getDay()],
            hoje: index === 0
        };
    });
    return(
        <>
        <main className={estilo.container}>
            <header className={estilo.header}>
                <div className={estilo.titulo_header}>
                    <strong>Visão geral</strong>
                    <p>{hoje.toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                        })}</p>
                </div>
                <div className={estilo.perfil_header}>
                    <LuBell size={22} className={estilo.icone_header}/>
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
                        <strong>Gestão do projeto</strong>
                        <h1>Bom trabalho, equipe.</h1>
                        <p>Uma visão do cuidado que acontece todos os dias.</p>
                    </div>
                    <button>+  Nova inscrição</button>
                </div>

                <div className={estilo.container_informacoes}>
                    <div className={estilo.conteudo_informacoes}>
                        <div className={estilo.card_informacoes}>
                            <div className={estilo.card_titulo}>
                                <p>Alunos ativos</p> 
                                <LuUsersRound size={22} color="#173F73"/>
                            </div>
                            <h1>11</h1>
                            <p>3 turmas ativas</p>
                        </div>

                        <div className={estilo.card_informacoes}>
                            <div className={estilo.card_titulo}>
                                <p>Presença no mês</p> 
                                <LuCheck size={18} color="#173F73"/>
                            </div>
                            <h1>100%</h1>
                            <p>12 presenças em 12 registros</p>
                        </div>

                        <div className={estilo.card_informacoes}>
                            <div className={estilo.card_titulo}>
                                <p>Aulas nos próximos 7 dias</p> 
                                <LuCalendarDays size={22} color="#173F73"/>
                            </div>
                            <h1>7</h1>
                            <p>Agenda das turmas ativas</p>
                        </div>

                        <div className={estilo.card_informacoes}>
                            <div className={estilo.card_titulo}>
                                <p>Inscrições em andamento</p> 
                                <LuFilePlus2 size={22} color="#173F73"/>
                            </div>
                            <h1>2</h1>
                            <p>Da triagem à matrícula</p>
                        </div>
                    </div>
                </div>

                <div className={estilo.section_agenda}>

                    <div className={estilo.container_principal_agenda}>

                        <div className={estilo.conteudo_agenda}>
                            <div className={estilo.conteudo_agenda_titulo}>
                                <div>
                                    <strong>Organize a rotina</strong>
                                    <h1>Agenda de aulas</h1>
                                </div>
                                <a href="#">Ver turmas</a>
                            </div>

                            <div className={estilo.calendario_agenda}>

                                    {dias.map((dia, index) => (

                                    <div
                                        key={index}
                                        className={`${estilo.dia_calendario} ${
                                            dia.hoje ? estilo.dia_hoje : ""
                                        }`}
                                    >

                                        <span className={estilo.nome_dia}>
                                            {dia.hoje ? "Hoje" : dia.diaSemana}
                                        </span>

                                        <strong className={estilo.numero_dia}>
                                            {dia.numero}
                                        </strong>

                                        {/* Bolinha indicando que existem aulas */}
                                        {index < 7 && (
                                            <span className={estilo.bolinha}></span>
                                        )}

                                    </div>

                                ))}

                            </div>

                            <div className={estilo.conteudo_sem_aulas}>

                                <LuCalendarDays 
                                    size={30} 
                                    className={estilo.icone_sem_aulas}
                                />

                                <h1>Sem aulas hoje</h1>

                                <p>
                                    Consulte outro dia da semana ou organize os próximos<br />
                                    encontros.
                                </p>

                                <a href="#">
                                    Organizar turmas
                                    <span>↗</span>
                                </a>

                            </div>
                        </div>

                    </div>

                    <div className={estilo.pontos_de_atencao}>

                        <div className={estilo.titulo_pontos}>
                            <div>
                                <strong>PONTOS DE ATENÇÃO</strong>
                                <h1>Próximos passos</h1>
                            </div>

                            <LuTarget 
                                size={30} 
                                className={estilo.icone_pontos}
                            />
                        </div>

                        <div className={estilo.lista_pontos}>

                            <div className={estilo.item_ponto}>

                                <div className={estilo.numero_ponto}>
                                    2
                                </div>

                                <div className={estilo.texto_ponto}>
                                    <strong>Inscrições para acompanhar</strong>
                                    <p>Revisar cadastro, programa e vagas</p>
                                </div>

                                <span className={estilo.seta_ponto}>›</span>

                            </div>


                            <div className={estilo.item_ponto}>

                                <div className={estilo.numero_ponto}>
                                    0
                                </div>

                                <div className={estilo.texto_ponto}>
                                    <strong>Solicitações em aberto</strong>
                                    <p>Justificativas e contato com a família</p>
                                </div>

                                <span className={estilo.seta_ponto}>›</span>

                            </div>


                            <div className={estilo.item_ponto}>

                                <div className={estilo.numero_ponto}>
                                    0
                                </div>

                                <div className={estilo.texto_ponto}>
                                    <strong>Avaliações agendadas</strong>
                                    <p>Consultar o percurso individual</p>
                                </div>

                                <span className={estilo.seta_ponto}>›</span>

                            </div>

                        </div>


                        <div className={estilo.observacao_pontos}>

                            <LuShield 
                                size={32} 
                                className={estilo.icone_observacao}
                            />

                            <p>
                                A frequência apoia o acompanhamento. A graduação depende
                                da avaliação pedagógica.
                            </p>

                        </div>

                    </div>
                </div>

                <div className={estilo.section_acompanhamento_comunidade}>

                    <div className={estilo.container_acompanhamento}>

                        <div className={estilo.titulo_acompanhamento}>
                            <div>
                                <strong>Acompanhamento</strong>
                                <h1>Presença por turma</h1>
                            </div>
                            <a href="#">Ver relatório <span>↗</span></a>
                        </div>

                        <div className={estilo.lista_turmas}>

                                <div className={estilo.turma}>
                                    
                                    <div className={estilo.info_turma}>
                                        <strong>Turma A</strong>
                                        <p>Infantil</p>
                                    </div>

                                    <div className={estilo.progresso_turma}>
                                        <div className={estilo.barra_progresso}>
                                            <div className={estilo.progresso}></div>
                                        </div>

                                        <strong>100%</strong>
                                    </div>

                                </div>


                                <div className={estilo.turma}>
                                    
                                    <div className={estilo.info_turma}>
                                        <strong>Turma B</strong>
                                        <p>Juvenil</p>
                                    </div>

                                    <div className={estilo.progresso_turma}>
                                        <div className={estilo.barra_progresso}>
                                            <div className={estilo.progresso}></div>
                                        </div>

                                        <strong>100%</strong>
                                    </div>

                                </div>


                                <div className={estilo.turma}>
                                    
                                    <div className={estilo.info_turma}>
                                        <strong>Oficina de estudos</strong>
                                        <p>Apoio educacionalo</p>
                                    </div>

                                    <div className={estilo.progresso_turma}>
                                        <div className={estilo.barra_progresso}>
                                            <div className={estilo.progresso}></div>
                                        </div>

                                        <strong>-</strong>
                                    </div>

                                </div>

                        </div>
                        <p className={estilo.p_Footer}>Presenças / registros de chamada neste mês. Sem registros: —.</p>
                    </div>

                    <div className={estilo.container_comunidade}>
                        <div className={estilo.titulo_acompanhamento}>
                            <div>
                                <strong>Comunidade</strong>
                                <h1>Mural do projeto</h1>
                            </div>
                            <a href="#">Ver mural<span>↗</span></a>
                        </div>
                        <div className={estilo.conteudo_comunidade}>
                            <p>05 de set. · Coordenação</p>
                            <h1>Bem-vindos ao portal</h1>
                            <p>Acompanhe atividades, presença e comunicados pelo portal.</p>
                        </div>
                    </div>
                </div>

            </section>
        </main>
        </>
    )
}
export default VisaoGeral;