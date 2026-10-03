import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { atualizarComunicado } from "../../lib/comunicadosService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Edição de um comunicado já publicado ou em rascunho.
function EditarComunicado() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const comunicado = location.state;

  const [titulo, setTitulo] = useState(comunicado?.titulo ?? "");
  const [conteudo, setConteudo] = useState(comunicado?.texto ?? "");
  const [situacao, setSituacao] = useState(
    comunicado?.situacaoBruta === "publicado" ? "publicado" : "rascunho"
  );

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
      await atualizarComunicado(comunicado.id, { titulo, conteudo, situacao });
      navigate("/Dashboard/comunicados");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  if (!comunicado) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Comunicado não encontrado</h2>
            <p>Abra um comunicado pela lista para editá-lo.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/comunicados")}
              >
                Voltar aos comunicados
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
          <strong>Comunicados</strong>
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
            <h1>Editar comunicado</h1>
            <p>Ajuste o texto ou a publicação do aviso.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>{comunicado.titulo}</h2>
          <p>
            {comunicado.confirmacoes} pessoa(s) já confirmaram a leitura deste
            comunicado.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="titulo">Título</label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="conteudo">Conteúdo</label>
              <textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                required
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="situacao">Publicação</label>
              <select
                id="situacao"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option value="publicado">Publicado</option>
                <option value="rascunho">Rascunho</option>
              </select>
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
              onClick={() => navigate("/Dashboard/comunicados")}
            >
              <LuArrowLeft size={16} />
              Voltar aos comunicados
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditarComunicado;
