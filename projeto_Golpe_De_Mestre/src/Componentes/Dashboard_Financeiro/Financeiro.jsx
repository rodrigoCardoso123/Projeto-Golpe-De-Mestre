import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuDownload,
  LuPlus,
  LuWalletCards,
  LuLayers3,
  LuPrinter,
  LuPencil,
  LuTrash2,
  LuSearch,
} from "react-icons/lu";
import estilo from "./financeiro.module.css";
import {
  listarLancamentos,
  listarFluxoMensal,
  excluirLancamento,
  categoriasFinanceiras,
} from "../../lib/financeiroService";
import { baixarCSV, imprimirPagina, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Financeiro. Entradas, saídas e saldo saem sempre dos lançamentos — nada é
// digitado à mão, então qualquer correção reflete no número na hora.
function Financeiro() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [lancamentos, setLancamentos] = useState([]);
  const [totais, setTotais] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  const [saidasPorCategoria, setSaidasPorCategoria] = useState({});
  const [fluxo, setFluxo] = useState([]);
  const [saldoMaximo, setSaldoMaximo] = useState(0);
  const [verValores, setVerValores] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [mes, setMes] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");

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
      const resultado = await listarLancamentos({
        tipo: tipo || undefined,
        categoria: categoria || undefined,
        mes: mes || undefined,
      });

      setLancamentos(resultado.lancamentos);
      setTotais({
        entradas: resultado.totalEntradas,
        saidas: resultado.totalSaidas,
        saldo: resultado.saldo,
      });
      setSaidasPorCategoria(resultado.saidasPorCategoria);

      const { fluxo: pontos, saldoMaximo: maximo } = await listarFluxoMensal(6);
      setFluxo(pontos);
      setSaldoMaximo(maximo);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [mes, tipo, categoria]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function apagar(lancamento) {
    const confirmado = window.confirm(
      `Excluir o lançamento "${lancamento.descricao}" de ${lancamento.data}?`
    );

    if (!confirmado) return;

    try {
      await excluirLancamento(lancamento.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function exportar() {
    const cabecalho = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];

    const linhas = lancamentos.map((lancamento) => [
      lancamento.data,
      lancamento.descricao,
      lancamento.categoria,
      lancamento.tipo,
      lancamento.valor.toFixed(2).replace(".", ","),
    ]);

    baixarCSV(`financeiro-${carimboData()}`, cabecalho, linhas);
  }

  // As barras comparam entrada e saída; o maior valor define a escala.
  const maiorValor = Math.max(totais.entradas, totais.saidas, 1);
  const larguraEntrada = (totais.entradas / maiorValor) * 100;
  const larguraSaida = (totais.saidas / maiorValor) * 100;

  const categoriasOrdenadas = Object.entries(saidasPorCategoria).sort(
    (a, b) => b[1] - a[1]
  );
  const maiorCategoria = Math.max(...categoriasOrdenadas.map(([, v]) => v), 1);

  // Converte cada ponto do fluxo em coordenadas do SVG (viewBox 0 0 700 190).
  const pontosGrafico = fluxo.map((ponto, indice) => {
    const x =
      fluxo.length === 1
        ? 350
        : 20 + (indice / (fluxo.length - 1)) * 650;

    const y = 155 - (ponto.saldo / (saldoMaximo || 1)) * 130;
    return { x, y, ponto };
  });

  return (
    <div className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Financeiro</strong>
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

      <main className={estilo.main}>
        <div className={estilo.container_titulo}>
          <div>
            <strong>Área da equipe</strong>
            <h1>Financeiro</h1>
            <p>Acompanhe Entradas, Saídas e Saldo.</p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_exportar}
              onClick={exportar}
              disabled={lancamentos.length === 0}
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

            <button
              type="button"
              className={estilo.botao_imprimir}
              onClick={() => navigate("/Dashboard/financeiro/novo")}
            >
              <LuPlus size={16} />
              Novo lançamento
            </button>
          </div>
        </div>

        <div className={estilo.filtros}>
          <div className={estilo.campo}>
            <label htmlFor="filtro-mes">Mês</label>
            <input
              id="filtro-mes"
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
            />
          </div>

          <div className={estilo.campo}>
            <label htmlFor="filtro-tipo">Tipo</label>
            <select
              id="filtro-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <div className={estilo.campo}>
            <label htmlFor="filtro-categoria">Categoria</label>
            <select
              id="filtro-categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categoriasFinanceiras().map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}

        <div className={estilo.resumo}>
          <div className={estilo.card_resumo}>
            <div className={estilo.card_topo}>
              <span>Entradas</span>
              <LuWalletCards size={18} />
            </div>
            <strong>{moeda(totais.entradas)}</strong>
            <small>Período selecionado</small>
          </div>

          <div className={estilo.card_resumo}>
            <div className={estilo.card_topo}>
              <span>Saídas</span>
              <LuWalletCards size={18} />
            </div>
            <strong>{moeda(totais.saidas)}</strong>
            <small>Período selecionado</small>
          </div>

          <div className={estilo.card_resumo}>
            <div className={estilo.card_topo}>
              <span>Saldo do período</span>
              <LuLayers3 size={18} />
            </div>
            <strong>{moeda(totais.saldo)}</strong>
            <small>Entradas menos saídas</small>
          </div>
        </div>

        <div className={estilo.grid_graficos}>
          <section className={estilo.card_grafico}>
            <h2>Entradas e saídas</h2>
            <p>Resumo do período selecionado</p>

            <div className={estilo.legenda}>
              <span>
                <i className={estilo.legenda_entrada}></i>
                Entradas: {moeda(totais.entradas)}
              </span>
              <span>
                <i className={estilo.legenda_saida}></i>
                Saídas: {moeda(totais.saidas)}
              </span>
            </div>

            <div className={estilo.barra_item}>
              <span>Entradas</span>
              <div className={estilo.barra_fundo}>
                <div
                  className={estilo.barra_entrada}
                  style={{ width: `${larguraEntrada}%` }}
                />
              </div>
              <strong>{moeda(totais.entradas)}</strong>
            </div>

            <div className={estilo.barra_item}>
              <span>Saídas</span>
              <div className={estilo.barra_fundo}>
                <div
                  className={estilo.barra_saida}
                  style={{ width: `${larguraSaida}%` }}
                />
              </div>
              <strong>{moeda(totais.saidas)}</strong>
            </div>
          </section>

          <section className={estilo.card_grafico}>
            <h2>Saídas por categoria</h2>

            {categoriasOrdenadas.length === 0 && (
              <p>Nenhuma saída no período selecionado.</p>
            )}

            {categoriasOrdenadas.map(([nome, valor]) => (
              <div key={nome} className={estilo.categoria_item}>
                <span>{nome}</span>

                <div className={estilo.categoria_barra}>
                  <div style={{ width: `${(valor / maiorCategoria) * 100}%` }} />
                </div>

                <strong>{moeda(valor)}</strong>
              </div>
            ))}
          </section>
        </div>

        <section className={estilo.card_fluxo}>
          <h2>Fluxo de caixa mensal</h2>
          <p>
            Saldo acumulado de cada mês em R$. Últimos seis meses com
            lançamento. Considera todas as categorias e tipos.
          </p>

          {fluxo.length === 0 ? (
            <p>Sem lançamentos no período.</p>
          ) : (
            <div className={estilo.grafico_linha}>
              <div className={estilo.eixo_y}>
                <span>{Math.round(saldoMaximo)}</span>
                <span>0</span>
              </div>

              <div className={estilo.area_grafico}>
                <svg viewBox="0 0 700 190" preserveAspectRatio="none">
                  <line x1="0" y1="25" x2="700" y2="25" className={estilo.linha_grade} />
                  <line x1="0" y1="155" x2="700" y2="155" className={estilo.linha_grade} />

                  <polyline
                    points={pontosGrafico
                      .map(({ x, y }) => `${x},${y}`)
                      .join(" ")}
                    className={estilo.linha_valores}
                  />

                  {pontosGrafico.map(({ x, y, ponto }) => (
                    <circle key={ponto.mes} cx={x} cy={y} r="4">
                      <title>
                        {ponto.rotulo}: {moeda(ponto.saldo)}
                      </title>
                    </circle>
                  ))}
                </svg>

                <div className={estilo.meses}>
                  {fluxo.map((ponto) => (
                    <span key={ponto.mes}>{ponto.rotulo}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className={estilo.link_valores}
            onClick={() => setVerValores((valor) => !valor)}
          >
            {verValores ? "Ocultar valores por mês" : "Ver valores por mês"}
          </button>

          {verValores && (
            <div className={estilo.lista_valores}>
              {fluxo.length === 0 && <p>Sem lançamentos para exibir.</p>}

              {fluxo.map((ponto) => (
                <div key={ponto.mes} className={estilo.item_valores}>
                  <strong>{ponto.rotulo}</strong>
                  <span>Entradas: {moeda(ponto.entradas)}</span>
                  <span>Saídas: {moeda(ponto.saidas)}</span>
                  <span>Saldo: {moeda(ponto.saldo)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className={estilo.tabela_container}>
          {carregando && <p className={estilo.carregando}>Carregando lançamentos...</p>}

          {!carregando && lancamentos.length === 0 && (
            <div className={estilo.estado_vazio}>
              <LuSearch size={46} />
              <h3>Nenhum lançamento encontrado</h3>
              <p>Ajuste os filtros ou registre um novo lançamento.</p>
            </div>
          )}

          {!carregando && lancamentos.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>DATA</th>
                  <th>DESCRIÇÃO</th>
                  <th>CATEGORIA</th>
                  <th>TIPO</th>
                  <th>VALOR</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {lancamentos.map((lancamento) => (
                  <tr key={lancamento.id}>
                    <td>{lancamento.data}</td>
                    <td>{lancamento.descricao}</td>
                    <td>{lancamento.categoria}</td>

                    <td>
                      <span
                        className={
                          lancamento.tipoBruto === "entrada"
                            ? estilo.badge_entrada
                            : estilo.badge_saida
                        }
                      >
                        {lancamento.tipo}
                      </span>
                    </td>

                    <td
                      className={
                        lancamento.tipoBruto === "entrada"
                          ? estilo.valor_entrada
                          : estilo.valor_saida
                      }
                    >
                      {lancamento.valorFormatado}
                    </td>

                    <td>
                      <div className={estilo.acoes_linha}>
                        <button
                          type="button"
                          className={estilo.botao_linha}
                          onClick={() =>
                            navigate("/Dashboard/financeiro/editar", {
                              state: lancamento,
                            })
                          }
                        >
                          <LuPencil size={14} />
                        </button>

                        <button
                          type="button"
                          className={estilo.botao_linha + " " + estilo.botao_linha_excluir}
                          onClick={() => apagar(lancamento)}
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
      </main>
    </div>
  );
}

export default Financeiro;
