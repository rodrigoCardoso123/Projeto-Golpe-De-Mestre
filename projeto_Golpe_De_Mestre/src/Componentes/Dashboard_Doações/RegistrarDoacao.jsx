import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { registrarDoacao, formasDoacao } from "../../lib/apoiadoresService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Registro de doação. A doação entra como pendente: só vira confirmada — e
// gera o lançamento no financeiro — quando alguém confirma na lista.
function RegistrarDoacao() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [doador, setDoador] = useState("");
  const [email, setEmail] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [forma, setForma] = useState(formasDoacao()[0]);
  const [recorrente, setRecorrente] = useState(false);
  const [anonima, setAnonima] = useState(false);
  const [observacao, setObservacao] = useState("");

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

    if (!anonima && !doador.trim()) {
      setErro("Informe o nome do doador ou marque como anônimo.");
      return;
    }

    if (!numero || numero <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    setEnviando(true);

    try {
      await registrarDoacao({
        doador,
        email,
        valor: numero,
        data,
        forma,
        recorrente,
        observacao,
        anonima,
      });
      navigate("/Dashboard/doacoes");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

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
        <div className={estilo.container_titulo}>
          <div>
            <strong>Área da equipe</strong>
            <h1>Registrar doação</h1>
            <p>Registros administrativos de contribuições, sem processamento de pagamento.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>Dados da doação</h2>
          <p>
            A doação entra como pendente. Ao confirmá-la na lista, o lançamento
            correspondente é criado no financeiro.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="doador">Doador</label>
              <input
                id="doador"
                type="text"
                value={doador}
                onChange={(e) => setDoador(e.target.value)}
                placeholder={anonima ? "Anônimo" : "Ex.: Maria Souza"}
                disabled={anonima}
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <div className={estilo.campo_check}>
                <input
                  id="anonima"
                  type="checkbox"
                  checked={anonima}
                  onChange={(e) => setAnonima(e.target.checked)}
                />
                <label htmlFor="anonima">Doação anônima</label>
              </div>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="email">E-mail (opcional)</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doador@exemplo.com"
                disabled={anonima}
              />
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
              <label htmlFor="forma">Forma de pagamento</label>
              <select
                id="forma"
                value={forma}
                onChange={(e) => setForma(e.target.value)}
              >
                {formasDoacao().map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <div className={estilo.campo_check}>
                <input
                  id="recorrente"
                  type="checkbox"
                  checked={recorrente}
                  onChange={(e) => setRecorrente(e.target.checked)}
                />
                <label htmlFor="recorrente">Doação recorrente</label>
              </div>
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="observacao">Observação (opcional)</label>
              <textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Comprovante, forma de recebimento, combinados com o doador."
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
              {enviando ? "Registrando..." : "Registrar doação"}
            </button>

            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/doacoes")}
            >
              <LuArrowLeft size={16} />
              Voltar às doações
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegistrarDoacao;
