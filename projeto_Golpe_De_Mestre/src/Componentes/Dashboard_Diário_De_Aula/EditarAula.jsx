import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { atualizarAula, listarTurmasParaSeleção } from "../../lib/diarioService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Edição de uma aula já cadastrada. A aula chega pelo state da navegação,
// então sem ele não há o que editar.
function EditarAula() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const aula = location.state;

  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState(aula?.turmaId ?? "");
  const [data, setData] = useState(aula?.data ?? "");
  const [horario, setHorario] = useState(aula?.horario ?? "");
  const [titulo, setTitulo] = useState(aula?.titulo ?? "");
  const [objetivos, setObjetivos] = useState(aula?.objetivos ?? "");
  const [conteudo, setConteudo] = useState(aula?.descricao ?? "");
  const [situacao, setSituacao] = useState(aula?.situacaoBruta ?? "planejada");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    listarTurmasParaSeleção().then(setTurmas).catch(() => setTurmas([]));
  }, []);

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await atualizarAula(aula.id, {
        turma_id: turmaId,
        data,
        titulo,
        conteudo,
        objetivos,
        horario,
        situacao,
      });
      navigate("/Dashboard/diario");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  // Entrou pela URL sem state: não há registro para carregar.
  if (!aula) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Aula não encontrada</h2>
            <p>Abra uma aula pela lista do diário para editá-la.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/diario")}
              >
                Voltar ao diário
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
          <strong>Diário de aula</strong>
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
            <h1>Editar aula</h1>
            <p>Ajuste os dados do encontro já cadastrado.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>{aula.titulo}</h2>
          <p>
            As alterações passam a valer imediatamente no diário e nos
            relatórios.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo}>
              <label htmlFor="turma">Turma</label>
              <select
                id="turma"
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                required
              >
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome} — {turma.programa}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="data">Data da aula</label>
              <input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="horario">Horário</label>
              <input
                id="horario"
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex.: 19h00 — 20h00"
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="situacao">Situação</label>
              <select
                id="situacao"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option value="planejada">Planejada</option>
                <option value="realizada">Realizada</option>
              </select>
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="titulo">Título da aula</label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="objetivos">Objetivos</label>
              <input
                id="objetivos"
                type="text"
                value={objetivos}
                onChange={(e) => setObjetivos(e.target.value)}
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="conteudo">Conteúdo da aula</label>
              <textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
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
              onClick={() => navigate("/Dashboard/diario")}
            >
              <LuArrowLeft size={16} />
              Voltar ao diário
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditarAula;
