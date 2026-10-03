import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuBell, LuPlus, LuSearch, LuDownload, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import estilo from "./alunos.module.css";
import { listarAlunos, listarAlunosPorFaixa, FAIXAS } from "../../lib/alunosService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

const POR_PAGINA = 10;

// Alunos. Filtros e busca rodam sobre a lista já carregada e a paginação fatia
// o resultado — assim trocar um filtro não dispara outra consulta ao banco.
function Alunos() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [turma, setTurma] = useState("");
  const [faixa, setFaixa] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pagina, setPagina] = useState(1);

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

  // Qualquer mudança de filtro devolve o usuário para a primeira página, senão
  // ele pode cair numa página vazia depois de reduzir o resultado.
  useEffect(() => {
    setPagina(1);
  }, [busca, turma, faixa, situacao]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return alunos.filter((aluno) => {
      const correspondeBusca =
        termo === "" || aluno.nome.toLowerCase().includes(termo);

      const correspondeTurma = turma === "" || aluno.turma === turma;

      const correspondeFaixa = faixa === "" || aluno.faixaBruta === faixa;

      const correspondeSituacao =
        situacao === "" || aluno.situacaoBruta === situacao;

      return (
        correspondeBusca &&
        correspondeTurma &&
        correspondeFaixa &&
        correspondeSituacao
      );
    });
  }, [alunos, busca, turma, faixa, situacao]);

  const totalPaginas = Math.max(Math.ceil(filtrados.length / POR_PAGINA), 1);

  const visiveis = filtrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

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

    baixarCSV(`alunos-${carimboData()}`, cabecalho, linhas);
  }

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Alunos</strong>
          <p>{dataHoje}</p>
        </div>

        <div className={estilo.perfil_header}>
          <LuBell size={22} className={estilo.icone_header} />
          <div className={estilo.conteudo_perfil}>
            <p>{(perfil?.nome ?? "CM").slice(0, 2).toUpperCase()}</p>
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
            <h1>Alunos</h1>
            <p>Cadastros, vínculos e acompanhamento individual.</p>
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

            <button
              type="button"
              onClick={() => navigate("/Dashboard/alunos/novo")}
            >
              <LuPlus size={16} />
              Novo aluno
            </button>
          </div>
        </div>

        <div className={estilo.container_form}>
          <div>
            <label htmlFor="filtro-busca">Buscar Aluno</label>
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
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando alunos...</p>}

        {!carregando && filtrados.length === 0 && (
          <div className={estilo.estado_vazio}>
            <LuSearch size={46} />
            <h3>Nenhum aluno encontrado</h3>
            <p>Ajuste os filtros ou cadastre um novo aluno.</p>
          </div>
        )}

        {filtrados.length > 0 && (
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
                {visiveis.map((aluno) => (
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
                          {aluno.faixa.nome}{" "}
                          <small>
                            · {aluno.faixa.graus}{" "}
                            {aluno.faixa.graus === 1 ? "grau" : "graus"}
                          </small>
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className={estilo.presenca}>
                        <div className={estilo.barra}>
                          <div
                            className={estilo.progresso}
                            style={{ width: `${aluno.presenca}%` }}
                          />
                        </div>

                        <span>{aluno.presenca}%</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          aluno.situacaoBruta === "ativo"
                            ? estilo.ativo
                            : estilo.inativo
                        }
                      >
                        {aluno.situacao}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/Dashboard/alunos/perfil/${aluno.id}/editar`}
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
        )}

        <div className={estilo.rodape_tabela}>
          <span>{filtrados.length} aluno(s) encontrado(s)</span>

          {totalPaginas > 1 && (
            <div className={estilo.paginacao}>
              <button
                type="button"
                aria-label="Página anterior"
                onClick={() => setPagina((valor) => Math.max(valor - 1, 1))}
                disabled={pagina === 1}
              >
                <LuChevronLeft size={16} />
              </button>

              <span>
                {pagina} / {totalPaginas}
              </span>

              <button
                type="button"
                aria-label="Próxima página"
                onClick={() =>
                  setPagina((valor) => Math.min(valor + 1, totalPaginas))
                }
                disabled={pagina === totalPaginas}
              >
                <LuChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Alunos;
