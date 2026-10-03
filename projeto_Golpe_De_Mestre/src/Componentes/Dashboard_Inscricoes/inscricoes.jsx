import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuPlus, LuSearch, LuTrash2, LuDownload } from "react-icons/lu";
import estilo from "./inscricoes.module.css";
import {
  listarInscricoes,
  atualizarSituacaoInscricao,
  excluirInscricao,
  FILTROS,
} from "../../lib/inscricoesService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Inscrições e matrículas. "Analisar" abre a ficha; de lá a coordenação
// decide a situação ou matricula, o que cria o aluno e move a inscrição.
function Inscricoes() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [inscricoes, setInscricoes] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [busca, setBusca] = useState("");
  const [programa, setPrograma] = useState("todos");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      setInscricoes(await listarInscricoes());
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

  async function excluir(inscricao) {
    const confirmado = window.confirm(
      `Excluir a inscrição de ${inscricao.candidato}?`
    );

    if (!confirmado) return;

    try {
      await excluirInscricao(inscricao.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Candidato", "Responsável", "Idade", "Escola", "Data", "Situação"];

    const linhas = filtradas.map((inscricao) => [
      inscricao.candidato,
      inscricao.responsavel,
      inscricao.idade ?? "",
      inscricao.escola,
      inscricao.data,
      inscricao.situacao,
    ]);

    baixarCSV(`inscricoes-${carimboDate()}`, cabecalho, linhas);
  }

  const contarPorSituacao = (chave) =>
    chave === "todas"
      ? inscricoes.length
      : inscricoes.filter((inscricao) => inscricao.situacaoBruta === chave).length;

  const programas = useMemo(
    () => ["todos", ...new Set(inscricoes.map((item) => item.programa).filter(Boolean))],
    [inscricoes]
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return inscricoes.filter((inscricao) => {
      const correspondeFiltro =
        filtroAtivo === "todas" || inscricao.situacaoBruta === filtroAtivo;

      const correspondePrograma =
        programa === "todos" || inscricao.programa === programa;

      const texto = `${inscricao.candidato} ${inscricao.responsavel}`.toLowerCase();
      const correspondeBusca = termo === "" || texto.includes(termo);

      return correspondeFiltro && correspondePrograma && correspondeBusca;
    });
  }, [inscricoes, filtroAtivo, programa, busca]);

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Inscrições e matrículas</strong>
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
        <div className={estilo.container_titulo}>
          <div>
            <strong>Área da equipe</strong>
            <h1>Inscrições e matrículas</h1>
            <p>Acompanhe a entrada no projeto, da primeira conversa à turma.</p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_exportar}
              onClick={exportar}
              disabled={filtradas.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              className={estilo.botao_nova_inscricao}
              onClick={() => navigate("/Dashboard/inscricoes/nova")}
            >
              <LuPlus size={16} />
              Nova inscrição
            </button>
          </div>
        </div>

        <div className={estilo.container_filtros}>
          {FILTROS.map((filtro) => (
            <button
              key={filtro.chave}
              type="button"
              className={`${estilo.filtro} ${
                filtroAtivo === filtro.chave ? estilo.filtro_ativo : ""
              }`}
              onClick={() => setFiltroAtivo(filtro.chave)}
            >
              <strong>{contarPorSituacao(filtro.chave)}</strong>
              <span>{filtro.nome}</span>
            </button>
          ))}
        </div>

        <div className={estilo.container_busca}>
          <div className={estilo.campo}>
            <label htmlFor="busca-candidato">Buscar candidato ou responsável</label>
            <input
              id="busca-candidato"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome"
            />
          </div>

          <div className={estilo.campo}>
            <label htmlFor="filtro-programa">Programa</label>
            <select
              id="filtro-programa"
              value={programa}
              onChange={(e) => setPrograma(e.target.value)}
            >
              {programas.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao === "todos" ? "Todos" : opcao}
                </option>
              ))}
            </select>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando inscrições...</p>}

        <div className={estilo.tabela}>
          <table>
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Programa</th>
                <th>Inscrição</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtradas.map((inscricao) => (
                <tr key={inscricao.id}>
                  <td>
                    <div className={estilo.candidato}>
                      <strong>{inscricao.candidato}</strong>
                      <span>{inscricao.responsavel}</span>
                    </div>
                  </td>

                  <td>{inscricao.programa || "—"}</td>
                  <td>{inscricao.data}</td>

                  <td>
                    <span className={estilo[inscricao.classeSituacao]}>
                      {inscricao.situacao}
                    </span>
                  </td>

                  <td className={estilo.coluna_acao}>
                    <div className={estilo.acoes_linha}>
                      <button
                        type="button"
                        className={estilo.botao_analisar}
                        onClick={() =>
                          navigate("/Dashboard/inscricoes/analise", {
                            state: inscricao,
                          })
                        }
                      >
                        Analisar
                      </button>

                      <button
                        type="button"
                        className={estilo.botao_excluir}
                        onClick={() => excluir(inscricao)}
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!carregando && filtradas.length === 0 && (
                <tr>
                  <td colSpan={5} className={estilo.sem_resultados}>
                    Nenhuma inscrição encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Inscricoes;
