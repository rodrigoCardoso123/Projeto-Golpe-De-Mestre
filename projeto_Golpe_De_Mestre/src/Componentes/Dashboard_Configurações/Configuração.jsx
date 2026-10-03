import { useCallback, useEffect, useState } from "react";
import {
  LuBell,
  LuSave,
  LuExternalLink,
  LuUndo2,
} from "react-icons/lu";
import estilo from "./Configuração.module.css";
import {
  listarConfiguracoes,
  salvarConfiguracoes,
  agruparCampos,
} from "../../lib/configuracoesService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Configurações institucionais. Os campos vêm da lista em configuracoesService
// e são gravados na tabela configuracoes (chave/valor) — nada fica solto no
// código. Só o administrador grava; o resto da equipe apenas visualiza.
function Configuracao() {
  const { perfil } = useAuth();

  const [valores, setValores] = useState({});
  const [salvos, setSalvos] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const ehAdministrador = perfil?.papel === "administrador";
  const grupos = agruparCampos();

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarConfiguracoes();
      setValores(dados);
      setSalvos(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function alterar(chave, novoValor) {
    setMensagem("");
    setValores((anterior) => ({ ...anterior, [chave]: novoValor }));
  }

  // Só o que mudou é enviado, para o "alterado" no rodapé não mentir.
  const alterados = Object.keys(valores).filter(
    (chave) => valores[chave] !== salvos[chave]
  );

  async function salvar() {
    setErro("");
    setMensagem("");
    setEnviando(true);

    try {
      await salvarConfiguracoes(valores);
      setSalvos(valores);
      setMensagem("Configurações salvas.");
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function descartar() {
    setValores(salvos);
    setMensagem("");
    setErro("");
  }

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Configurações</strong>
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
            <h1>Configurações</h1>
            <p>
              Uma fonte única para informações institucionais e conteúdo público.
            </p>
          </div>

          <button
            type="button"
            className={estilo.botao_site}
            onClick={() => window.open("/", "_blank")}
          >
            Revisar site público
            <LuExternalLink size={16} />
          </button>
        </div>

        <div className={estilo.aviso}>
          Campos vazios ficam ocultos no site público. Use links completos com
          https:// e confira o destino do QR antes de usar.
        </div>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}
        {mensagem && <p className={estilo.aviso_sucesso}>{mensagem}</p>}
        {carregando && <p className={estilo.carregando}>Carregando configurações...</p>}

        {!carregando && !ehAdministrador && (
          <p className={estilo.aviso}>
            Apenas administradores podem salvar alterações. Os campos abaixo
            estão apenas para consulta.
          </p>
        )}

        <div className={estilo.grid_configuracoes}>
          {grupos.map((grupo) => (
            <div key={grupo.nome} className={estilo.card_config}>
              <h2>{grupo.nome}</h2>

              {grupo.descricao && (
                <p className={estilo.descricao}>{grupo.descricao}</p>
              )}

              <div className={estilo.grid_campos}>
                {grupo.campos.map((campo) => (
                  <div
                    key={campo.chave}
                    className={
                      campo.largo
                        ? `${estilo.campo} ${estilo.campo_largo}`
                        : estilo.campo
                    }
                  >
                    <label htmlFor={campo.chave}>{campo.rotulo}</label>

                    {campo.multilinha ? (
                      <textarea
                        id={campo.chave}
                        value={valores[campo.chave] ?? ""}
                        onChange={(e) => alterar(campo.chave, e.target.value)}
                        disabled={!ehAdministrador}
                        placeholder={campo.placeholder}
                      />
                    ) : (
                      <input
                        id={campo.chave}
                        type={campo.tipo ?? "text"}
                        value={valores[campo.chave] ?? ""}
                        onChange={(e) => alterar(campo.chave, e.target.value)}
                        disabled={!ehAdministrador}
                        placeholder={campo.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={estilo.footer_config}>
          <span>
            {alterados.length === 0
              ? "Sem alterações."
              : `${alterados.length} alteração(ões) não salva(s).`}
          </span>

          {ehAdministrador && (
            <div className={estilo.acoes_config}>
              <button
                type="button"
                className={estilo.botao_descartar}
                onClick={descartar}
                disabled={alterados.length === 0}
              >
                <LuUndo2 size={16} />
                Descartar
              </button>

              <button
                type="button"
                className={estilo.botao_salvar}
                onClick={salvar}
                disabled={alterados.length === 0 || enviando}
              >
                <LuSave size={16} />
                {enviando ? "Salvando..." : "Salvar configurações"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Configuracao;
