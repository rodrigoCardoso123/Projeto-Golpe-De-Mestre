import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { atualizarVisita } from "../../lib/visitasService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

const SITUACOES = [
  { valor: "solicitada", rotulo: "Solicitada" },
  { valor: "agendada", rotulo: "Confirmada" },
  { valor: "realizada", rotulo: "Realizada" },
  { valor: "cancelada", rotulo: "Cancelada" },
];

const PROGRAMAS = [
  "Infantil",
  "Juvenil",
  "Familiar",
  "Aula aberta",
  "Evento",
];

// Edição da solicitação de visita: dados de contato, agenda e situação.
function EditarVisita() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const visita = location.state;

  const [visitante, setVisitante] = useState(visita?.visitante ?? "");
  const [email, setEmail] = useState(visita?.email ?? "");
  const [telefone, setTelefone] = useState(visita?.telefone ?? "");
  const [programa, setPrograma] = useState(visita?.programa ?? "");
  const [dataIso, setDataIso] = useState(visita?.dataIso ?? "");
  const [horario, setHorario] = useState(visita?.horario ?? "");
  const [mensagem, setMensagem] = useState(visita?.mensagem ?? "");
  const [situacao, setSituacao] = useState(visita?.situacaoBruta ?? "solicitada");

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
    setEnviando(true);

    try {
      await atualizarVisita(visita.id, {
        visitante,
        email,
        telefone,
        programa,
        dataIso,
        horario,
        mensagem,
        situacaoBruta: situacao,
      });
      navigate("/Dashboard/visitas");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  if (!visita) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Visita não encontrada</h2>
            <p>Abra uma visita pela lista para editá-la.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/visitas")}
              >
                Voltar às visitas
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
          <strong>Visitas</strong>
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
            <h1>Editar visita</h1>
            <p>Ajuste o agendamento e a situação da solicitação.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>{visita.visitante}</h2>
          <p>
            Solicitada pelo formulário público. Situação atual: {visita.situacao}.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="visitante">Nome do visitante</label>
              <input
                id="visitante"
                type="text"
                value={visitante}
                onChange={(e) => setVisitante(e.target.value)}
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="programa">Programa</label>
              <select
                id="programa"
                value={programa}
                onChange={(e) => setPrograma(e.target.value)}
              >
                <option value="">—</option>
                {PROGRAMAS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="data">Data da visita</label>
              <input
                id="data"
                type="date"
                value={dataIso}
                onChange={(e) => setDataIso(e.target.value)}
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="horario">Horário</label>
              <input
                id="horario"
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex.: 14h00"
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="situacao">Situação</label>
              <select
                id="situacao"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                {SITUACOES.map((item) => (
                  <option key={item.valor} value={item.valor}>
                    {item.rotulo}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
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
              onClick={() => navigate("/Dashboard/visitas")}
            >
              <LuArrowLeft size={16} />
              Voltar às visitas
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditarVisita;
