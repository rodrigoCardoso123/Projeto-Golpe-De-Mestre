import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { criarAtividade } from "../../lib/atividadesService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Formulário de atividade. É a tela de destino do botão "+ Nova atividade":
// salva como rascunho ou publica na hora, conforme o seleção.
function NovaAtividade() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("pratica");
  const [prazo, setPrazo] = useState("");
  const [situacao, setSituacao] = useState("rascunho");

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
      .then(setTurmas)
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
    setEnviando(true);

    try {
      await criarAtividade({ titulo, descricao, turmaId, tipo, prazo, situacao });
      navigate("/Dashboard/atividades");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Atividades</strong>
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
            <h1>Nova atividade</h1>
            <p>Proponha uma prática ou reflexão e defina o prazo de entrega.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>Dados da atividade</h2>
          <p>
            Atividades publicadas ficam visíveis para os responsáveis no
            portal. Rascunhos ficam visíveis só para a equipe.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="titulo">Título da atividade</label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Meu combinado da semana"
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="turma">Turma</label>
              <select
                id="turma"
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                disabled={carregando}
              >
                <option value="">Todas as turmas</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome} — {turma.programa}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="pratica">Prática</option>
                <option value="reflexao">Reflexão</option>
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="prazo">Prazo de entrega</label>
              <input
                id="prazo"
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="situacao">Publicação</label>
              <select
                id="situacao"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option value="rascunho">Salvar como rascunho</option>
                <option value="publicado">Publicar agora</option>
              </select>
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Explique o que a família e o aluno vão fazer."
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
              {enviando ? "Salvando..." : "Salvar atividade"}
            </button>

            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/atividades")}
            >
              <LuArrowLeft size={16} />
              Voltar às atividades
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default NovaAtividade;
