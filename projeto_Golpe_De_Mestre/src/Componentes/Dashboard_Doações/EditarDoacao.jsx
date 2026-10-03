import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { atualizarDoacao, formasDoacao } from "../../lib/apoiadoresService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Edição de uma doação já registrada.
function EditarDoacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const doacao = location.state;

  const [doador, setDoador] = useState(doacao?.doador ?? "");
  const [email, setEmail] = useState(doacao?.email ?? "");
  const [valor, setValor] = useState(doacao?.valor ?? "");
  const [data, setData] = useState(doacao?.dataIso ?? "");
  const [forma, setForma] = useState(doacao?.forma ?? "Pix");
  const [recorrente, setRecorrente] = useState(doacao?.recorrente ?? false);
  const [anonima, setAnonima] = useState(doacao?.anonima ?? false);
  const [observacao, setObservacao] = useState(doacao?.observacao ?? "");

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
      await atualizarDoacao(doacao.id, {
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

  if (!doacao) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Doação não encontrada</h2>
            <p>Abra uma doação pela lista para editá-la.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/doacoes")}
              >
                Voltar às doações
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
            <h1>Editar doação</h1>
            <p>Ajuste os dados registrados.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>{doacao.doador}</h2>
          <p>
            Registrada em {doacao.data} · situação {doacao.situacao}.
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
              <label htmlFor="observacao">Observação</label>
              <textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
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

export default EditarDoacao;
