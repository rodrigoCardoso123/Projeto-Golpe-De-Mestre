import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell,
  LuShield,
  LuBookOpen,
  LuUsersRound,
  LuPlus,
  LuEye,
  LuUserRoundX,
  LuUserRoundCheck,
  LuDownload,
} from "react-icons/lu";
import estilo from "./Equipe_e_Acesso.module.css";
import { listarUsuarios, atualizarUsuario, rotuloPapel } from "../../lib/usuariosService";
import { PERMISSOES } from "../../lib/permissoes";
import { baixarCSV, carimboData } from "../../lib/csv";
import { useAuth } from "../../lib/auth";

// Equipe e acessos. Lista os perfis reais e deixa o administrador ajustar
// cargo e situação — é a mesma tabela que o Auth consulta a cada sessão.
function Equipe_e_Acesso() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [equipe, setEquipe] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState("");

  const ehAdministrador = perfil?.papel === "administrador";

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      setEquipe(await listarUsuarios());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function trocarCargo(pessoa, novoPapel) {
    setErro("");
    setEditando(pessoa.id);

    try {
      await atualizarUsuario(pessoa.id, { papel: novoPapel });
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setEditando("");
    }
  }

  async function alternarSituacao(pessoa) {
    setErro("");
    setEditando(pessoa.id);

    try {
      await atualizarUsuario(pessoa.id, {
        situacao: pessoa.situacao === "ativo" ? "inativo" : "ativo",
      });
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setEditando("");
    }
  }

  function exportar() {
    const cabecalho = ["Nome", "E-mail", "Cargo", "Situação"];

    const linhas = equipe.map((pessoa) => [
      pessoa.nome,
      pessoa.email,
      rotuloPapel(pessoa.papel),
      pessoa.situacao === "ativo" ? "Ativo" : "Inativo",
    ]);

    baixarCSV(`equipe-${carimboDate()}`, cabecalho, linhas);
  }

  const ativos = equipe.filter((pessoa) => pessoa.situacao === "ativo").length;

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Equipe e Acesso</strong>
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
            <h1>Equipe e acessos</h1>
            <p>
              Vínculos claros entre gestão, educadores, alunos e responsáveis.
            </p>
          </div>

          <div className={estilo.acoes_titulo}>
            <button
              type="button"
              className={estilo.botao_exportar}
              onClick={exportar}
              disabled={equipe.length === 0}
            >
              <LuDownload size={16} />
              Exportar CSV
            </button>

            {ehAdministrador && (
              <button
                type="button"
                className={estilo.botao_novo}
                onClick={() => navigate("/Dashboard/equipe/novo")}
              >
                <LuPlus size={21} />
                Novo acesso
              </button>
            )}
          </div>
        </div>

        <div className={estilo.cards_perfis}>
          <div className={estilo.card_perfil}>
            <LuShield size={21} className={estilo.icone_card} />
            <h3>Gestão</h3>
            <p>Secretaria, equipe, recursos e visão institucional.</p>
          </div>

          <div className={estilo.card_perfil}>
            <LuBookOpen size={21} className={estilo.icone_card} />
            <h3>Professor</h3>
            <p>Somente suas turmas e o acompanhamento pedagógico.</p>
          </div>

          <div className={estilo.card_perfil}>
            <LuUsersRound size={21} className={estilo.icone_card} />
            <h3>Aluno e família</h3>
            <p>Somente alunos vinculados, atividades e comunicados.</p>
          </div>
        </div>

        <p className={estilo.texto_tabela}>
          {carregando
            ? "Carregando equipe..."
            : `${equipe.length} perfil(is) · ${ativos} ativo(s).`}
        </p>

        {erro && <p className={estilo.aviso_erro}>{erro}</p>}

        <div className={estilo.tabela_container}>
          <table className={estilo.tabela}>
            <thead>
              <tr>
                <th>NOME</th>
                <th>PERFIL</th>
                <th>E-MAIL</th>
                <th>SITUAÇÃO</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {equipe.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>

                  <td>
                    {ehAdministrador ? (
                      <select
                        className={estilo.select_cargo}
                        value={pessoa.papel}
                        disabled={editando === pessoa.id}
                        onChange={(e) => trocarCargo(pessoa, e.target.value)}
                      >
                        <option value="administrador">Administrador</option>
                        <option value="professor">Professor</option>
                        <option value="responsavel">Responsável</option>
                      </select>
                    ) : (
                      rotuloPapel(pessoa.papel)
                    )}
                  </td>

                  <td>{pessoa.email ?? "—"}</td>

                  <td>
                    <span
                      className={
                        pessoa.situacao === "ativo"
                          ? estilo.status_ativo
                          : estilo.status_inativo
                      }
                    >
                      {pessoa.situacao === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td>
                    <div className={estilo.acoes_tabela}>
                      <button
                        type="button"
                        className={estilo.botao_explorar}
                        onClick={() =>
                          navigate("/Dashboard/equipe/permissas", { state: pessoa })
                        }
                      >
                        <LuEye size={14} />
                        Explorar perfil
                      </button>

                      {ehAdministrador && (
                        <button
                          type="button"
                          className={estilo.botao_editar}
                          disabled={editando === pessoa.id}
                          onClick={() => alternarSituacao(pessoa)}
                          title={
                            pessoa.situacao === "ativo"
                              ? "Desativar acesso"
                              : "Reativar acesso"
                          }
                        >
                          {pessoa.situacao === "ativo" ? (
                            <>
                              <LuUserRoundX size={14} />
                              Desativar
                            </>
                          ) : (
                            <>
                              <LuUserRoundCheck size={14} />
                              Reativar
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className={estilo.atividade_recente}>
          <h2>Permissões por cargo</h2>
          <p>
            O mesmo mapa que filtra o menu lateral também protege cada rota — um
            cargo nunca acessa uma área que não aparece para ele.
          </p>

          <div className={estilo.grade_permissoes}>
            {Object.entries(PERMISSOES).map(([area, cargos]) => (
              <div key={area} className={estilo.item_permissao}>
                <strong>{area.replace(/([A-Z])/g, " $1")}</strong>
                <span>{cargos.map((cargo) => rotuloPapel(cargo)).join(" · ")}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Equipe_e_Acesso;
