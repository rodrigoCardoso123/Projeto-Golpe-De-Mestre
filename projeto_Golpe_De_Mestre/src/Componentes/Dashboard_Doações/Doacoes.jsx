import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuPlus,
  LuDownload,
  LuCheck,
  LuPencil,
  LuTrash2,
  LuSearch,
} from "react-icons/lu";
import estilo from "./Doacoes.module.css";
import {
  listarDoacoes,
  confirmarDoacao,
  atualizarDoacao,
  excluirDoacao,
} from "../../lib/apoiadoresService";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Doações. Registrar é uma coisa, confirmar é outra: só a doação confirmada
// entra no financeiro como entrada.
function Doacoes() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [doacoes, setDoacoes] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalConfirmadas, setTotalConfirmadas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [confirmando, setConfirmando] = useState("");

  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");
  const [mes, setMes] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const moeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resultado = await listarDoacoes();
      setDoacoes(resultado.doacoes);
      setTotal(resultado.total);
      setTotalConfirmadas(resultado.totalConfirmadas);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function confirmar(doacao) {
    setErro("");
    setConfirmando(doacao.id);

    try {
      await confirmarDoacao(doacao.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setConfirmando("");
    }
  }

  async function apagar(doacao) {
    const confirmado = window.confirm(
      `Excluir a doação de ${moeda(doacao.valor)} registrada por ${doacao.doador}?`
    );

    if (!confirmado) return;

    try {
      await excluirDoacao(doacao.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Doador", "Data", "Valor", "Forma", "Situação", "Recorrente"];

    const linhas = doacoesFiltradas.map((doacao) => [
      doacao.doador,
      doacao.data,
      doacao.valor.toFixed(2).replace(".", ","),
      doacao.forma,
      doacao.situacao,
      doacao.recorrente ? "Sim" : "Não",
    ]);

    baixarCSV(`doacoes-${carimboData()}`, cabecalho, linhas);
  }

  const doacoesFiltradas = doacoes.filter((doacao) => {
    const termo = busca.trim().toLowerCase();

    const correspondeBusca =
      termo === "" || doacao.doador.toLowerCase().includes(termo);

    const correspondeSituacao =
      situacao === "" || doacao.situacaoBruta === situacao;

    const correspondeMes = mes === "" || doacao.dataIso.startsWith(mes);

    return correspondeBusca && correspondeSituacao && correspondeMes;
  });

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Doações</strong>
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
            <h1>Doações</h1>
            <p>
              Registros administrativos de contribuições. Sem processamento de
              pagamentos.
            </p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_exportar}
              onClick={exportar}
              disabled={doacoesFiltradas.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            <button
              type="button"
              className={estilo.botao_principal}
              onClick={() => navigate("/Dashboard/doacoes/nova")}
            >
              <LuPlus size={16} />
              Registrar doação
            </button>
          </div>
        </div>

        <div className={estilo.resumo_doacoes}>
          <div>
            <small>Total registrado</small>
            <strong>{moeda(total)}</strong>
          </div>
          <div>
            <small>Confirmadas</small>
            <strong>{moeda(totalConfirmadas)}</strong>
          </div>
          <div>
            <small>Aguardando confirmação</small>
            <strong>{moeda(total - totalConfirmadas)}</strong>
          </div>
        </div>

        <div className={estilo.container_form}>
          <div>
            <label htmlFor="filtro-doador">Buscar doador</label>
            <input
              id="filtro-doador"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome do doador"
            />
          </div>

          <div>
            <label htmlFor="filtro-situacao">Situação</label>
            <select
              id="filtro-situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="pendente">Pendente</option>
              <option value="confirmada">Confirmada</option>
            </select>
          </div>

          <div>
            <label htmlFor="filtro-mes">Mês</label>
            <input
              id="filtro-mes"
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
            />
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {carregando && <p className={estilo.carregando}>Carregando doações...</p>}

        <div className={estilo.container_tabela}>
          {!carregando && doacoesFiltradas.length === 0 ? (
            <div className={estilo.estado_vazio}>
              <LuSearch size={46} />
              <h3>Nenhuma doação encontrada</h3>
              <p>Ajuste os filtros ou registre uma nova doação.</p>
            </div>
          ) : (
            <table className={estilo.tabela}>
              <thead>
                <tr>
                  <th>DOADOR</th>
                  <th>DATA</th>
                  <th>VALOR</th>
                  <th>FORMA</th>
                  <th>SITUAÇÃO</th>
                  <th>RECORRENTE</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {doacoesFiltradas.map((doacao) => (
                  <tr key={doacao.id}>
                    <td>{doacao.doador}</td>
                    <td>{doacao.data}</td>
                    <td>{moeda(doacao.valor)}</td>
                    <td>{doacao.forma}</td>

                    <td>
                      <span
                        className={
                          doacao.situacaoBruta === "confirmada"
                            ? estilo.badge_confirmada
                            : estilo.badge_pendente
                        }
                      >
                        {doacao.situacao}
                      </span>
                    </td>

                    <td>{doacao.recorrente ? "Sim" : "Não"}</td>

                    <td className={estilo.coluna_acao}>
                      <div className={estilo.acoes_doacao}>
                        {doacao.situacaoBruta !== "confirmada" && (
                          <button
                            type="button"
                            className={estilo.botao_confirmar}
                            onClick={() => confirmar(doacao)}
                            disabled={confirmando === doacao.id}
                          >
                            <LuCheck size={14} />
                            {confirmando === doacao.id ? "..." : "Confirmar"}
                          </button>
                        )}

                        <button
                          type="button"
                          className={estilo.botao_analisar}
                          onClick={() =>
                            navigate("/Dashboard/doacoes/editar", { state: doacao })
                          }
                        >
                          <LuPencil size={14} />
                          Editar
                        </button>

                        <button
                          type="button"
                          className={estilo.botao_excluir}
                          onClick={() => apagar(doacao)}
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className={estilo.rodape}>
          {doacoesFiltradas.length} registro(s) na seleção. Confirmadas:{" "}
          {moeda(totalConfirmadas)}.
        </p>
      </section>
    </main>
  );
}

export default Doacoes;
