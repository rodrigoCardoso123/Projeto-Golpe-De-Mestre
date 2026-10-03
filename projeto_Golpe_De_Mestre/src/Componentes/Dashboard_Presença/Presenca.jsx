import { useCallback, useEffect, useState } from "react";
import {
  LuBell,
  LuSave,
  LuCheck,
  LuDownload,
  LuPrinter,
  LuSearch,
  LuUsersRound,
} from "react-icons/lu";
import estilo from "./Presenca.module.css";
import { listarPresencas, salvarPresencas } from "../../lib/presencasService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { baixarCSV, imprimirPagina, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

const HOJE = new Date().toISOString().slice(0, 10);

const ROTULO_STATUS = {
  presente: "Presente",
  ausente: "Ausente",
  justificado: "Justificado",
};

// Chamada do dia. Os radios e a observação ficam em estado local enquanto o
// professor monta a lista; "Salvar presença" grava o lote inteiro de uma vez.
function Presenca() {
  const { perfil } = useAuth();

  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [data, setData] = useState(HOJE);

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    setSalvo("");

    try {
      setRegistros(await listarPresencas({ turmaId: turmaId || undefined, data }));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [turmaId, data]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    listarTurmasParaSeleção().then(setTurmas).catch(() => setTurmas([]));
  }, []);

  function marcar(alunoId, status) {
    setSalvo("");
    setRegistros((anterior) =>
      anterior.map((registro) =>
        registro.alunoId === alunoId ? { ...registro, status } : registro
      )
    );
  }

  function marcarObservacao(alunoId, observacao) {
    setSalvo("");
    setRegistros((anterior) =>
      anterior.map((registro) =>
        registro.alunoId === alunoId ? { ...registro, observacao } : registro
      )
    );
  }

  // Marca todos de uma vez — o atalho mais usado no fim da aula.
  function marcarTodos() {
    setSalvo("");
    setRegistros((anterior) =>
      anterior.map((registro) => ({ ...registro, status: "presente" }))
    );
  }

  async function salvar() {
    setErro("");
    setSalvo("");
    setEnviando(true);

    try {
      await salvarPresencas({ turmaId, data, registros });
      setSalvo("Presença registrada.");
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function exportar() {
    const cabecalho = ["Aluno", "Turma", "Presença", "Observação"];

    const linhas = registros.map((registro) => [
      registro.nome,
      registro.turma,
      ROTULO_STATUS[registro.status] ?? "",
      registro.observacao,
    ]);

    baixarCSV(`presenca-${data}-${carimboDate()}`, cabecalho, linhas);
  }

  const confirmados = registros.filter((registro) => registro.status).length;

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Presença</strong>
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
            <h1>Presença</h1>
            <p>Registre a participação e mantenha o acompanhamento.</p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={exportar}
              disabled={registros.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              className={estilo.botao_secundario}
              onClick={imprimirPagina}
            >
              <LuPrinter size={16} />
              Imprimir
            </button>
          </div>
        </div>

        <div className={estilo.container_form}>
          <div>
            <label htmlFor="filtro-data">Data</label>
            <input
              id="filtro-data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="filtro-turma">Turma</label>
            <select
              id="filtro-turma"
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {salvo && <p className={estilo.aviso_sucesso}>{salvo}</p>}
        {carregando && <p className={estilo.carregando}>Carregando chamada...</p>}

        {!carregando && registros.length === 0 && (
          <div className={estilo.estado_vazio}>
            <LuSearch size={46} />
            <h3>Nenhum aluno ativo</h3>
            <p>Ajuste a turma ou a data para montar a chamada.</p>
          </div>
        )}

        {registros.length > 0 && (
          <>
            <div className={estilo.resumo_chamada}>
              <LuUsersRound size={18} />
              <span>
                {confirmados} de {registros.length} aluno(s) marcados
              </span>
            </div>

            <div className={estilo.container_tabela}>
              <table className={estilo.tabela}>
                <thead>
                  <tr>
                    <th>ALUNO</th>
                    <th>TURMA</th>
                    <th>PRESENÇA</th>
                    <th>OBSERVAÇÃO</th>
                  </tr>
                </thead>

                <tbody>
                  {registros.map((registro) => (
                    <tr key={registro.alunoId}>
                      <td>
                        <div className={estilo.aluno}>
                          <div className={estilo.avatar}>
                            {registro.nome.slice(0, 2).toUpperCase()}
                          </div>

                          <div className={estilo.informacoes_aluno}>
                            <strong>{registro.nome}</strong>
                            <span>{registro.faixa}</span>
                          </div>
                        </div>
                      </td>

                      <td>{registro.turma}</td>

                      <td>
                        <div className={estilo.opcoes_presenca}>
                          {["presente", "ausente", "justificado"].map((status) => (
                            <label
                              key={status}
                              className={estilo.opcao_presenca}
                            >
                              <input
                                type="radio"
                                name={`presenca-${registro.alunoId}`}
                                value={status}
                                checked={registro.status === status}
                                onChange={() =>
                                  marcar(registro.alunoId, status)
                                }
                              />
                              <span>{ROTULO_STATUS[status]}</span>
                            </label>
                          ))}
                        </div>
                      </td>

                      <td>
                        <input
                          type="text"
                          className={estilo.observacao}
                          placeholder="Opcional"
                          value={registro.observacao}
                          onChange={(e) =>
                            marcarObservacao(registro.alunoId, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={estilo.container_footer}>
              <p>Marque a presença dos alunos e salve ao final da aula.</p>

              <div className={estilo.container_botoes}>
                <button
                  type="button"
                  className={estilo.botao_todos}
                  onClick={marcarTodos}
                >
                  Todos presentes
                </button>

                <button
                  type="button"
                  className={estilo.botao_salvar}
                  onClick={salvar}
                  disabled={enviando || confirmados === 0}
                >
                  <LuSave size={16} />
                  {enviando ? "Salvando..." : "Salvar presença"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Presenca;
