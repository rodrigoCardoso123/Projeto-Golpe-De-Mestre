import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LuBell,
  LuArrowLeft,
  LuLayers3,
  LuUserRound,
  LuDumbbell,
  LuClock,
  LuMapPin,
  LuUsersRound,
  LuPencil,
} from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Detalhe de uma turma: os dados que o card resumia, mais a lista de alunos
// vinculados e as próximas aulas já registradas para ela.
function PerfilTurma() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const turma = location.state;

  const [alunos, setAlunos] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    if (!turma) return;

    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const { data: lista, error: erroAlunos } = await supabase
          .from("alunos")
          .select("id, nome, faixa, graus, situacao")
          .eq("turma_id", turma.id)
          .order("nome");

        if (erroAlunos) throw erroAlunos;

        const { data: encontros, error: erroAulas } = await supabase
          .from("aulas_diario")
          .select("id, data, titulo, situacao")
          .eq("turma_id", turma.id)
          .order("data", { ascending: false })
          .limit(5);

        if (erroAulas) throw erroAulas;

        if (cancelado) return;

        setAlunos(lista ?? []);
        setAulas(encontros ?? []);
      } catch (e) {
        if (!cancelado) setErro(e.message);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();

    return () => {
      cancelado = true;
    };
  }, [turma]);

  const formatarData = (iso) => {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  if (!turma) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Turma não encontrada</h2>
            <p>Abra uma turma pela lista para ver os detalhes.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/turmas")}
              >
                Voltar às turmas
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
          <strong>Turmas e horários</strong>
          <p>{dataHoje}</p>
        </div>

        <div className={estilo.perfil_header}>
          <LuBell size={22} className={estilo.icone_header} />
          <div className={estilo.conteudo_perfil}>
            <p>{(perfil?.nome ?? "CM").slice(0, 2).toUpperCase()}</p>
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
            <h1>{turma.nome}</h1>
            <p>{turma.programa}</p>
          </div>
        </div>

        <div className={estilo.cartao}>
          <h2>
            <LuLayers3 size={20} /> Informações da turma
          </h2>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          {turma.descricao && <p>{turma.descricao}</p>}

          <div className={estilo.resumo}>
            <div>
              <small>Professor</small>
              <strong>{turma.professor}</strong>
            </div>
            <div>
              <small>Esporte</small>
              <strong>{turma.esporte}</strong>
            </div>
            <div>
              <small>Horário</small>
              <strong>{turma.horario}</strong>
            </div>
          </div>

          <div className={estilo.resumo}>
            <div>
              <small>Local</small>
              <strong>{turma.local}</strong>
            </div>
            <div>
              <small>
                <LuUsersRound size={13} /> Lotação
              </small>
              <strong>
                {turma.alunosAtivos} / {turma.capacidade}
              </strong>
            </div>
            <div>
              <small>Situação</small>
              <strong>{turma.situacao}</strong>
            </div>
          </div>

          <h3 className={estilo.subtitulo}>Alunos vinculados</h3>

          {carregando && <p>Carregando alunos...</p>}

          {!carregando && alunos.length === 0 && (
            <p>Nenhum aluno vinculado a esta turma.</p>
          )}

          {!carregando && alunos.length > 0 && (
            <div className={estilo.lista_entregas}>
              {alunos.map((aluno) => (
                <div key={aluno.id} className={estilo.item_entrega}>
                  <div className={estilo.info_entrega}>
                    <strong>{aluno.nome}</strong>
                    <small>
                      Faixa {aluno.faixa} · {aluno.graus} grau(s)
                    </small>
                  </div>

                  <button
                    type="button"
                    className={estilo.botao + " " + estilo.botao_secundario}
                    onClick={() =>
                      navigate(`/Dashboard/alunos/perfil/${aluno.id}`)
                    }
                  >
                    <LuPencil size={14} />
                    Ver perfil
                  </button>
                </div>
              ))}
            </div>
          )}

          <h3 className={estilo.subtitulo}>Aulas registradas</h3>

          {!carregando && aulas.length === 0 && (
            <p>Nenhuma aula registrada para esta turma.</p>
          )}

          {!carregando && aulas.length > 0 && (
            <div className={estilo.lista_entregas}>
              {aulas.map((aula) => (
                <div key={aula.id} className={estilo.item_entrega}>
                  <div className={estilo.info_entrega}>
                    <strong>{aula.titulo}</strong>
                    <small>
                      {formatarData(aula.data)} ·{" "}
                      {aula.situacao === "realizada" ? "Realizada" : "Planejada"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={estilo.acoes}>
            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_principal}
              onClick={() =>
                navigate("/Dashboard/turmas/editar", { state: turma })
              }
            >
              <LuPencil size={16} />
              Editar turma
            </button>

            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/turmas")}
            >
              <LuArrowLeft size={16} />
              Voltar às turmas
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PerfilTurma;
