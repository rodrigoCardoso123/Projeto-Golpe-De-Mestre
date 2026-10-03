import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuUsersRound,
  LuFilePlus2,
  LuCheck,
  LuCalendarDays,
  LuBell,
  LuTarget,
  LuShield,
  LuPlus,
} from "react-icons/lu";
import estilo from "./visaoGeral.module.css";
import {
  resumoAlunos,
  contarInscricoes,
  contarProximasAulas,
  contarSolicitacoes,
  contarAvaliacoes,
  listarUltimosComunicados,
  presencaPorTurma,
  agendaProximosDias,
} from "../../lib/visaoGeralService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Visão geral. Todos os números vêm de contagens reais no banco, e os cards
// e listas levam para a tela correspondente em vez de dead links.
function VisaoGeral() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [indicadores, setIndicadores] = useState({
    alunosAtivos: 0,
    presencas: 0,
    registros: 0,
    percentual: 0,
    inscricoes: 0,
    aulas: 0,
    solicitacoes: 0,
    avaliacoes: 0,
  });

  const [agenda, setAgenda] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [comunicados, setComunicados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      // As contagens são independentes, então rodam em paralelo.
      const [resumo, inscricoes, aulas, solicitacoes, avaliacoes, mural, presencas, dias] =
        await Promise.all([
          resumoAlunos(),
          contarInscricoes(),
          contarProximasAulas(),
          contarSolicitacoes(),
          contarAvaliacoes(),
          listarUltimosComunicados(),
          presencaPorTurma(),
          agendaProximosDias(),
        ]);

      setIndicadores({
        alunosAtivos: resumo.alunosAtivos,
        presencas: resumo.presencas,
        registros: resumo.registros,
        percentual: resumo.percentual,
        inscricoes,
        aulas,
        solicitacoes,
        avaliacoes,
      });

      setComunicados(mural);
      setTurmas(presencas);
      setAgenda(dias);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Os cards de "próximos passos" apontam para a área que resolve o item.
  const proximosPassos = [
    {
      numero: indicadores.inscricoes,
      titulo: "Inscrições para acompanhar",
      descricao: "Revisar cadastro, programa e vagas",
      destino: "/Dashboard/inscricoes",
    },
    {
      numero: indicadores.solicitacoes,
      titulo: "Solicitações em aberto",
      descricao: "Justificativas e contato com a família",
      destino: "/Dashboard/solicitacoes",
    },
    {
      numero: indicadores.avaliacoes,
      titulo: "Alunos em faixa preta",
      descricao: "Consultar o percurso individual",
      destino: "/Dashboard/desenvolvimento",
    },
  ];

  const diaComAulas = agenda.find((dia) => dia.aulas.length > 0);

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Visão geral</strong>
          <p>{dataHoje}</p>
        </div>

        <div className={estilo.perfil_header}>
          <LuBell size={22} className={estilo.icone_header} />
          <div className={estilo.conteudo_perfil}>
            <p>{(perfil?.nome ?? "GM").slice(0, 2).toUpperCase()}</p>
            <div>
              <strong>{perfil?.nome ?? "Coordenação"}</strong>
              <small>{rotuloPapel(perfil?.papel)}</small>
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

          <button type="button" onClick={() => navigate("/Dashboard/inscricoes/nova")}>
            <LuPlus size={16} />
            Nova inscrição
          </button>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando indicadores...</p>}

        <div className={estilo.container_informacoes}>
          <div className={estilo.conteudo_informacoes}>
            <button
              type="button"
              className={estilo.card_informacoes}
              onClick={() => navigate("/Dashboard/alunos")}
            >
              <div className={estilo.card_titulo}>
                <p>Alunos ativos</p>
                <LuUsersRound size={22} color="#173F73" />
              </div>
              <h1>{indicadores.alunosAtivos}</h1>
              <p>Clique para ver a lista</p>
            </button>

            <button
              type="button"
              className={estilo.card_informacoes}
              onClick={() => navigate("/Dashboard/presenca")}
            >
              <div className={estilo.card_titulo}>
                <p>Presença no mês</p>
                <LuCheck size={18} color="#173F73" />
              </div>
              <h1>{indicadores.registros === 0 ? "—" : `${indicadores.percentual}%`}</h1>
              <p>
                {indicadores.presencas} presenças em {indicadores.registros}{" "}
                registros
              </p>
            </button>

            <button
              type="button"
              className={estilo.card_informacoes}
              onClick={() => navigate("/Dashboard/diario")}
            >
              <div className={estilo.card_titulo}>
                <p>Aulas nos próximos 7 dias</p>
                <LuCalendarDays size={22} color="#173F73" />
              </div>
              <h1>{indicadores.aulas}</h1>
              <p>Agenda das turmas ativas</p>
            </button>

            <button
              type="button"
              className={estilo.card_informacoes}
              onClick={() => navigate("/Dashboard/inscricoes")}
            >
              <div className={estilo.card_titulo}>
                <p>Inscrições em andamento</p>
                <LuFilePlus2 size={22} color="#173F73" />
              </div>
              <h1>{indicadores.inscricoes}</h1>
              <p>Da triagem à matrícula</p>
            </button>
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

                <button type="button" onClick={() => navigate("/Dashboard/turmas")}>
                  Ver turmas
                </button>
              </div>

              <div className={estilo.calendario_agenda}>
                {agenda.map((dia) => (
                  <div
                    key={dia.iso}
                    className={`${estilo.dia_calendario} ${
                      dia.hoje ? estilo.dia_hoje : ""
                    }`}
                  >
                    <span className={estilo.nome_dia}>{dia.rotulo}</span>

                    <strong className={estilo.numero_dia}>{dia.numero}</strong>

                    {dia.aulas.length > 0 && <span className={estilo.bolinha} />}
                  </div>
                ))}
              </div>

              {diaComAulas ? (
                <div className={estilo.lista_aulas_dia}>
                  {diaComAulas.aulas.map((aula) => (
                    <button
                      key={aula.data + (aula.turmas?.nome ?? "")}
                      type="button"
                      className={estilo.item_aula_dia}
                      onClick={() => navigate("/Dashboard/diario")}
                    >
                      <strong>{aula.turmas?.nome ?? "Turma"}</strong>
                      <span>{aula.data.split("-").reverse().join("/")}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={estilo.conteudo_sem_aulas}>
                  <LuCalendarDays size={30} className={estilo.icone_sem_aulas} />

                  <h1>Sem aulas nos próximos dias</h1>

                  <p>
                    Consulte outro dia da semana ou organize os próximos
                    encontros.
                  </p>

                  <button type="button" onClick={() => navigate("/Dashboard/diario/nova")}>
                    Organizar turmas
                    <span>↗</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={estilo.pontos_de_atencao}>
            <div className={estilo.titulo_pontos}>
              <div>
                <strong>PONTOS DE ATENÇÃO</strong>
                <h1>Próximos passos</h1>
              </div>

              <LuTarget size={30} className={estilo.icone_pontos} />
            </div>

            <div className={estilo.lista_pontos}>
              {proximosPassos.map((item) => (
                <button
                  key={item.titulo}
                  type="button"
                  className={estilo.item_ponto}
                  onClick={() => navigate(item.destino)}
                >
                  <div className={estilo.numero_ponto}>{item.numero}</div>

                  <div className={estilo.texto_ponto}>
                    <strong>{item.titulo}</strong>
                    <p>{item.descricao}</p>
                  </div>

                  <span className={estilo.seta_ponto}>›</span>
                </button>
              ))}
            </div>

            <div className={estilo.observacao_pontos}>
              <LuShield size={32} className={estilo.icone_observacao} />

              <p>
                A frequência apoia o acompanhamento. A graduação depende da
                avaliação pedagógica.
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

              <button type="button" onClick={() => navigate("/Dashboard/relatorios")}>
                Ver relatório <span>↗</span>
              </button>
            </div>

            <div className={estilo.lista_turmas}>
              {turmas.length === 0 && !carregando && (
                <p>Nenhuma turma cadastrada.</p>
              )}

              {turmas.map((turma) => (
                <button
                  key={turma.id}
                  type="button"
                  className={estilo.turma}
                  onClick={() => navigate("/Dashboard/turmas")}
                >
                  <div className={estilo.info_turma}>
                    <strong>{turma.nome}</strong>
                    <p>{turma.programa}</p>
                  </div>

                  <div className={estilo.progresso_turma}>
                    <div className={estilo.barra_progresso}>
                      <div
                        className={estilo.progresso}
                        style={{ width: `${turma.percentual ?? 0}%` }}
                      />
                    </div>

                    <strong>{turma.percentual === null ? "—" : `${turma.percentual}%`}</strong>
                  </div>
                </button>
              ))}
            </div>

            <p className={estilo.p_Footer}>
              Presenças / registros de chamada neste mês. Sem registros: —.
            </p>
          </div>

          <div className={estilo.container_comunidade}>
            <div className={estilo.titulo_acompanhamento}>
              <div>
                <strong>Comunidade</strong>
                <h1>Mural do projeto</h1>
              </div>

              <button type="button" onClick={() => navigate("/Dashboard/comunicados")}>
                Ver mural <span>↗</span>
              </button>
            </div>

            <div className={estilo.conteudo_comunidade}>
              {comunicados.length === 0 ? (
                <p>Nenhum comunicado publicado.</p>
              ) : (
                comunicados.map((comunicado) => (
                  <div key={comunicado.titulo} className={estilo.item_comunicado}>
                    <p>
                      {comunicado.data} · {comunicado.autor}
                    </p>
                    <h1>{comunicado.titulo}</h1>
                    <p>{comunicado.texto}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default VisaoGeral;
