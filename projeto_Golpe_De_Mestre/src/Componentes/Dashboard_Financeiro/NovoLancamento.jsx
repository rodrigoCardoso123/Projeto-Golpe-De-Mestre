import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { criarLancamento, categoriasFinanceiras } from "../../lib/financeiroService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Novo lançamento do financeiro. Entradas e saídas usam o mesmo formulário;
// o campo valor é sempre positivo e o sinal vem do campo tipo.
function NovoLancamento() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(categoriasFinanceiras()[0]);
  const [tipo, setTipo] = useState("saida");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const ehEntrada = tipo === "entrada";

  async function enviar(event) {
    event.preventDefault();
    setErro("");

    const numero = Number(valor);

    if (!numero || numero <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    setEnviando(true);

    try {
      await criarLancamento({ data, descricao, categoria, tipo, valor: numero });
      navigate("/Dashboard/financeiro");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <main className={estilo.container}>
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

      <section className={estilo.section_main}>
        <div className={estilo.container_titulo}>
          <div>
            <strong>Área da equipe</strong>
            <h1>Novo lançamento</h1>
            <p>Registre uma entrada ou uma saída do caixa do projeto.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>Dados do lançamento</h2>
          <p>O saldo é recalculado a partir dos lançamentos, não guardado.</p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="descricao">Descrição</label>
              <input
                id="descricao"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex.: Material de treino"
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="saida">Saída</option>
                <option value="entrada">Entrada</option>
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categoriasFinanceiras().map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="valor">Valor (R$)</label>
              <input
                id="valor"
                type="number"
                min="0.01"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="data">Data</label>
              <input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={estilo.resumo}>
            <div>
              <small>Tipo escolhido</small>
              <strong>{ehEntrada ? "Entrada" : "Saída"}</strong>
            </div>
            <div>
              <small>Categoria</small>
              <strong>{categoria}</strong>
            </div>
            <div>
              <small>Valor</small>
              <strong>
                {valor
                  ? Number(valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "—"}
              </strong>
            </div>
          </div>

          <div className={estilo.acoes}>
            <button
              type="submit"
              className={estilo.botao + " " + estilo.botao_principal}
              disabled={enviando}
            >
              <LuSave size={16} />
              {enviando ? "Salvando..." : "Salvar lançamento"}
            </button>

            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/financeiro")}
            >
              <LuArrowLeft size={16} />
              Voltar ao financeiro
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default NovoLancamento;
