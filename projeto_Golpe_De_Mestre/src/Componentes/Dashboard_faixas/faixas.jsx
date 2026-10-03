import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuSearch, LuDownload, LuAward } from "react-icons/lu";
import estilo from "./faixas.module.css";
import { listarAlunos, graduarAluno, FAIXAS } from "../../lib/alunosService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Acompanhamento de faixas. A tela não mostra uma data fixa de avaliação:
// ela deriva a partir da presença real, e "Avaliar" promove o aluno para o
// próximo passo da sequência gravando o histórico de graduações.
function Faixas() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState("");

  const [busca, setBusca] = useState("");
  const [turma, setTurma] = useState("");
  const [faixa, setFaixa] = useState("");
  const [situacao, setSituacao] = useState("");
  const [presencaMinima, setPresencaMinima] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      setAlunos(await listarAlunos());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    listarTurmasParaSeleção().then(setTurmas).catch(() => setTurmas([]));
  }, []);

  // Gradua para a próxima faixa da sequência, ou avança um grau se já estiver
  // no fim da faixa atual (até 4 graus, depois vira a próxima faixa).
  function proximoPasso(aluno) {
    const indiceAtual = FAIXAS.findIndex((item) => item.valor === aluno.faixaBruta);
    const proxima = indiceAtual >= 0 && indiceAtual < FAIXAS.length - 1;

    if (aluno.faixa.graus >= 4 && proxima) {
      return { faixa: FAIXAS[indiceAtual + 1].valor, graus: 0 };
    }

    return { faixa: aluno.faixaBruta, graus: aluno.faixa.graus + 1 };
  }

  async function avaliar(aluno) {
    setErro("");
    setSalvo("");

    const proximo = proximoPasso(aluno);

    try {
      await graduarAluno({
        alunoId: aluno.id,
        faixa: proximo.faixa,
        graus: proximo.graus,
      });

      const rotulo = FAIXAS.find((item) => item.valor === proximo.faixa)?.nome;
      setSalvo(
        proximo.graus === 0
          ? `${aluno.nome} promovido para a faixa ${rotulo}.`
          : `${aluno.nome} advancements na faixa ${rotulo}: ${proximo.graus} grau(s).`
      );

      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Aluno", "Turma", "Faixa", "Graus", "Presença", "Situação"];

    const linhas = filtrados.map((aluno) => [
      aluno.nome,
      aluno.turma,
      aluno.faixa.nome,
      aluno.faixa.graus,
      `${aluno.presenca}%`,
      aluno.situacao,
    ]);

    baixarCSV(`faixas-${carimboDate()}`, cabecalho, linhas);
  }

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const minimo = presencaMinima === "" ? null : Number(presencaMinima);

    return alunos.filter((aluno) => {
      const correspondeBusca =
        termo === "" || aluno.nome.toLowerCase().includes(termo);

      const correspondeTurma = turma === "" || aluno.turma === turma;

      const correspondeFaixa = faixa === "" || aluno.faixaBruta === faixa;

      const correspondeSituacao =
        situacao === "" || aluno.situacaoBruta === situacao;

      // Sem mínimo informado, o filtro de presença não restringe nada.
      const correspondePresenca =
        minimo === null || aluno.presenca >= minimo;

      return (
        correspondeBusca &&
        correspondeTurma &&
        correspondeFaixa &&
        correspondeSituacao &&
        correspondePresenca
      );
    });
  }, [alunos, busca, turma, faixa, situacao, presencaMinima]);

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Faixas</strong>
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
            <strong>Área da equipe</strong>
            <h1>Acompanhamento de faixas</h1>
            <p>Observe o percurso e planeje avaliações individuais.</p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={exportar}
              disabled={filtrados.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className={estilo.container_form}>
          <div>
            <label htmlFor="filtro-busca">Buscar aluno</label>
            <input
              id="filtro-busca"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome do aluno"
            />
          </div>

          <div>
            <label htmlFor="filtro-turma">Turma</label>
            <select
              id="filtro-turma"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
            >
              <option value="">Todas</option>
              {turmas.map((item) => (
                <option key={item.id} value={item.nome}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-faixa">Faixa</label>
            <select
              id="filtro-faixa"
              value={faixa}
              onChange={(e) => setFaixa(e.target.value)}
            >
              <option value="">Todas</option>
              {FAIXAS.map((item) => (
                <option key={item.valor} value={item.valor}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-situacao">Situação</label>
            <select
              id="filtro-situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label htmlFor="filtro-presenca">Presença mínima (%)</label>
            <input
              id="filtro-presenca"
              type="number"
              min="0"
              max="100"
              value={presencaMinima}
              onChange={(e) => setPresencaMinima(e.target.value)}
              placeholder="Ex.: 75"
            />
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {salvo && <p className={estilo.aviso_sucesso}>{salvo}</p>}
        {carregando && <p className={estilo.carregando}>Carregando alunos...</p>}

        {!carregando && filtrados.length === 0 && (
          <div className={estilo.estado_vazio}>
            <LuSearch size={46} />
            <h3>Nenhum aluno encontrado</h3>
            <p>Ajuste os filtros para ver o percurso de faixas.</p>
          </div>
        )}

        {filtrados.length > 0 && (
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
                {filtrados.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>
                      <button
                        type="button"
                        className={estilo.link_aluno}
                        onClick={() =>
                          navigate(`/Dashboard/alunos/perfil/${aluno.id}`)
                        }
                        title={`Ver perfil de ${aluno.nome}`}
                      >
                        <div className={estilo.aluno}>
                          <div className={estilo.avatar}>{aluno.iniciais}</div>

                          <div className={estilo.informacoes_aluno}>
                            <strong>{aluno.nome}</strong>
                            <span>{aluno.categoria}</span>
                          </div>
                        </div>
                      </button>
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
                            {aluno.faixa.graus === 1 ? "grau" : "graus"}
                          </small>
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className={estilo.presenca}>
                        <div className={estilo.barra_presenca}>
                          <div
                            className={estilo.progresso_presenca}
                            style={{ width: `${aluno.presenca}%` }}
                          />
                        </div>

                        <span>{aluno.presenca}%</span>
                      </div>
                    </td>

                    <td>
                      {/* Avaliação sugerida a partir da presença real: quem
                          está abaixo de 75% ainda não é candidato. */}
                      <span
                        className={
                          aluno.presenca >= 75
                            ? estilo.proxima_avaliacao
                            : estilo.proxima_avaliacao + " " + estilo.avaliacao_pendente
                        }
                      >
                        {aluno.presenca >= 75 ? "Pronto para avaliar" : "Acompanhar"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={estilo.botao_avaliar}
                        onClick={() => avaliar(aluno)}
                      >
                        <LuAward size={14} />
                        Avaliar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Faixas;
