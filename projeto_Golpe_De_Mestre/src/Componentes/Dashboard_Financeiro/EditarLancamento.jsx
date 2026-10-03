import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { atualizarLancamento, categoriasFinanceiras } from "../../lib/financeiroService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Edição de um lançamento já registrado.
function EditarLancamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const lancamento = location.state;

  const [descricao, setDescricao] = useState(lancamento?.descricao ?? "");
  const [categoria, setCategoria] = useState(lancamento?.categoria ?? "");
  const [tipo, setTipo] = useState(lancamento?.tipoBruto ?? "saida");
  const [valor, setValor] = useState(lancamento?.valor ?? "");
  const [data, setData] = useState(lancamento?.dataIso ?? "");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

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
      await atualizarLancamento(lancamento.id, {
        data,
        descricao,
        categoria,
        tipo,
        valor: numero,
      });
      navigate("/Dashboard/financeiro");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  if (!lancamento) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Lançamento não encontrado</h2>
            <p>Abra um lançamento pela lista para editá-lo.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/financeiro")}
              >
                Voltar ao financeiro
              </button>
            </div>
          </div>
        </section>
      </main>
    );
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
            <h1>Editar lançamento</h1>
            <p>Ajuste os dados e o saldo será recalculado.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>{lancamento.descricao}</h2>
          <p>Registrado em {lancamento.data}.</p>

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

          <div className={estilo.acoes}>
            <button
              type="submit"
              className={estilo.botao + " " + estilo.botao_principal}
              disabled={enviando}
            >
              <LuSave size={16} />
              {enviando ? "Salvando..." : "Salvar alterações"}
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

export default EditarLancamento;
