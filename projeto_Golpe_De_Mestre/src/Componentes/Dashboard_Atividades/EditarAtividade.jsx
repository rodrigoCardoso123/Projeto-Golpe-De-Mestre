import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { atualizarAtividade } from "../../lib/atividadesService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Edição de uma atividade existente. A atividade chega pelo state da rota.
function EditarAtividade() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const atividade = location.state;

  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState(atividade?.turmaId ?? "");
  const [titulo, setTitulo] = useState(atividade?.titulo ?? "");
  const [descricao, setDescricao] = useState(atividade?.descricao ?? "");
  const [tipo, setTipo] = useState(atividade?.tipo ?? "pratica");
  const [prazo, setPrazo] = useState(atividade?.prazo ?? "");
  const [situacao, setSituacao] = useState(
    atividade?.situacaoBruta === "publicado" ? "publicado" : "rascunho"
  );

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
      await atualizarAtividade(atividade.id, {
        titulo,
        descricao,
        turmaId,
        tipo,
        prazo,
        situacao,
      });
      navigate("/Dashboard/atividades");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  if (!atividade) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Atividade não encontrada</h2>
            <p>Abra uma atividade pela lista para editá-la.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/atividades")}
              >
                Voltar às atividades
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
            <h1>Editar atividade</h1>
            <p>Ajuste a proposta, o prazo ou a publicação.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>{atividade.titulo}</h2>
          <p>As entregas já registradas continuam vinculadas a esta atividade.</p>

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
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="turma">Turma</label>
              <select
                id="turma"
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
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
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicada</option>
              </select>
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
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

export default EditarAtividade;
