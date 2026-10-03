import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft, LuImageUp } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { criarApoiador, enviarLogo, urlPublicaLogo } from "../../lib/apoiadoresService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

const CATEGORIAS = [
  "Institucional",
  "Empresa",
  "Comércio local",
  "Patrocinador",
  "Mídia",
];

const TAMANHO_MAXIMO = 2 * 1024 * 1024; // 2 MB

function NovoApoiador() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [site, setSite] = useState("");
  const [caminhoLogo, setCaminhoLogo] = useState("");
  const [previa, setPrevia] = useState("");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [subindo, setSubindo] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Valida o arquivo antes de subir: uma imagem rejeitada aqui não chega ao
  // bucket e o usuário recebe o erro na hora.
  async function aoEscolherArquivo(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    setErro("");

    if (!arquivo.type.startsWith("image/")) {
      setErro("Escolha um arquivo de imagem (PNG, JPG ou SVG).");
      event.target.value = "";
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
      setErro("A imagem deve ter no máximo 2 MB.");
      event.target.value = "";
      return;
    }

    setSubindo(true);

    try {
      const caminho = await enviarLogo(arquivo);
      setCaminhoLogo(caminho);
      setPrevia(await urlPublicaLogo(caminho));
    } catch (e) {
      setErro(e.message);
    } finally {
      setSubindo(false);
    }
  }

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await criarApoiador({ nome, categoria, site, caminhoLogo });
      navigate("/Dashboard/apoiadores");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Apoiadores</strong>
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
            <h1>Novo apoiador</h1>
            <p>Cadastre quem apoia o projeto e envie o logo para a prévia pública.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>Dados do apoiador</h2>
          <p>
            O apoiador só aparece no site quando o logo foi enviado e
            autorizado.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo}>
              <label htmlFor="nome">Nome do apoiador</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Academia Central"
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {CATEGORIAS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="site">Site (opcional)</label>
              <input
                id="site"
                type="url"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="https://exemplo.com.br"
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="logo">Logo (PNG, JPG ou SVG)</label>
              <input
                id="logo"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={aoEscolherArquivo}
                disabled={subindo}
              />

              {subindo && <small>Enviando logo...</small>}

              {previa && (
                <div className={estilo.previa_logo}>
                  <img src={previa} alt={`Logo de ${nome || "apoiador"}`} />
                  <span>
                    <LuImageUp size={16} /> Logo enviado. Ele aparece na prévia
                    do site assim que o apoiador for salvo.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={estilo.acoes}>
            <button
              type="submit"
              className={estilo.botao + " " + estilo.botao_principal}
              disabled={enviando || subindo}
            >
              <LuSave size={16} />
              {enviando ? "Salvando..." : "Salvar apoiador"}
            </button>

            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/apoiadores")}
            >
              <LuArrowLeft size={16} />
              Voltar aos apoiadores
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default NovoApoiador;
