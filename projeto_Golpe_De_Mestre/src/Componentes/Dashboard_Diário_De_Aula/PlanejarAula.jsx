import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { listarTurmasParaSeleção, criarAula } from "../../lib/diarioService";
import { useAuth } from "../../lib/auth";

// Planejamento de uma aula. É a tela de destino do botão "+ Planejar aula"
// do diário: grava em aulas_diario e volta para a lista.
function PlanejarAula() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [titulo, setTitulo] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [conteudo, setConteudo] = useState("");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    let cancelado = false;

    listarTurmasParaSeleção()
      .then((lista) => {
        if (cancelado) return;
        setTurmas(lista);
        // Preselecciona a primeira turma para não começar com o campo vazio.
        if (lista.length > 0) setTurmaId(lista[0].id);
      })
      .catch((e) => {
        if (!cancelado) setErro(e.message);
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  async function enviar(event) {
    event.preventDefault();
    setErro("");

    if (!turmaId) {
      setErro("Escolha a turma da aula.");
      return;
    }

    if (!data) {
      setErro("Informe a data da aula.");
      return;
    }

    setEnviando(true);

    try {
      await criarAula({ turmaId, data, titulo, conteudo, objetivos, horario });
      navigate("/Dashboard/diario");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
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
              <small>Administrador</small>
            </div>
          </div>
        </div>
      </header>

      <section className={estilo.section_main}>
        <div className={estilo.container_titulo}>
          <div>
            <strong>Área da equipe</strong>
            <h1>Planejar aula</h1>
            <p>Registre o que será trabalhado no próximo encontro.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>Dados da aula</h2>
          <p>
            A aula é criada como planejada. Depois, no diário, você marca como
            realizada depois que o encontro acontecer.
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
                disabled={carregando}
              >
                {carregando && <option value="">Carregando...</option>}
                {!carregando && turmas.length === 0 && (
                  <option value="">Nenhuma turma ativa</option>
                )}
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
              <label htmlFor="horario">Horário (opcional)</label>
              <input
                id="horario"
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex.: 19h00 — 20h00"
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="titulo">Título da aula</label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Cooperação e fundamentos"
                required
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="objetivos">Objetivos (opcional)</label>
              <input
                id="objetivos"
                type="text"
                value={objetivos}
                onChange={(e) => setObjetivos(e.target.value)}
                placeholder="O que se espera ao final do encontro"
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="conteudo">Conteúdo da aula</label>
              <textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Descreva as atividades, drills e o desenvolvimento do grupo."
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
              {enviando ? "Salvando..." : "Salvar planejamento"}
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

export default PlanejarAula;
