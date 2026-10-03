import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuArrowLeft, LuCheck, LuX } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { registrarEntrega } from "../../lib/atividadesService";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Acompanhamento de entregas de uma atividade. Marca, aluno por aluno, quem
// já entregou — o registro fica em atividade_entregas.
function Entregas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const atividade = location.state;

  const [alunos, setAlunos] = useState([]);
  const [entregas, setEntregas] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState("");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const carregar = useCallback(async () => {
    if (!atividade) return;

    setCarregando(true);
    setErro("");

    try {
      // Só faz sentido listar quando a atividade está presa a uma turma.
      if (!atividade.turmaId) {
        setAlunos([]);
        return;
      }

      const { data: lista, error: erroAlunos } = await supabase
        .from("alunos")
        .select("id, nome")
        .eq("turma_id", atividade.turmaId)
        .eq("situacao", "ativo")
        .order("nome");

      if (erroAlunos) throw erroAlunos;

      setAlunos(lista ?? []);

      const { data: registros, error: erroEntregas } = await supabase
        .from("atividade_entregas")
        .select("aluno_id")
        .eq("atividade_id", atividade.id);

      if (erroEntregas) throw erroEntregas;

      const mapa = {};
      for (const registro of registros ?? []) mapa[registro.aluno_id] = true;
      setEntregas(mapa);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [atividade]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function alternar(alunoId) {
    setSalvo("");
    setErro("");

    const novoValor = !entregas[alunoId];

    // Atualiza na hora para a interface não parecer travada, e desfaz se o
    // banco recusar — assim o card nunca mente sobre o que foi salvo.
    setEntregas((anterior) => ({ ...anterior, [alunoId]: novoValor }));

    try {
      await registrarEntrega({
        atividadeId: atividade.id,
        alunoId,
        entregue: novoValor,
      });
      setSalvo("Entrega registrada.");
    } catch (e) {
      setErro(e.message);
      await carregar();
    }
  }

  const totalEntregues = Object.values(entregas).filter(Boolean).length;

  if (!atividade) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Atividade não encontrada</h2>
            <p>Abra uma atividade pela lista para ver as entregas.</p>

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
            <h1>Acompanhar entregas</h1>
            <p>{atividade.titulo}</p>
          </div>
        </div>

        <div className={estilo.cartao}>
          <h2>{atividade.turma}</h2>
          <p>
            Marque quem já entregou. Cada marcação é gravada na hora, sem
            precisar de um botão de salvar.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          {salvo && (
            <div className={estilo.aviso + " " + estilo.aviso_sucesso}>
              <p>{salvo}</p>
            </div>
          )}

          <div className={estilo.resumo}>
            <div>
              <small>Turma</small>
              <strong>{atividade.turma}</strong>
            </div>
            <div>
              <small>Entregues</small>
              <strong>
                {totalEntregues} de {alunos.length}
              </strong>
            </div>
            <div>
              <small>Prazo</small>
              <strong>{atividade.prazoBr}</strong>
            </div>
          </div>

          {!atividade.turmaId && (
            <div className={estilo.aviso}>
              <p>
                Esta atividade não está vinculada a uma turma. Vincule-a a uma
                turma para acompanhar as entregas.
              </p>
            </div>
          )}

          {carregando && <p>Carregando alunos...</p>}

          {!carregando && atividade.turmaId && alunos.length === 0 && (
            <p>Nenhum aluno ativo nesta turma.</p>
          )}

          <div className={estilo.lista_entregas}>
            {alunos.map((aluno) => {
              const entregue = Boolean(entregas[aluno.id]);

              return (
                <div key={aluno.id} className={estilo.item_entrega}>
                  <div className={estilo.info_entrega}>
                    <strong>{aluno.nome}</strong>
                    <small>
                      {entregue ? "Entrega registrada" : "Aguardando entrega"}
                    </small>
                  </div>

                  <button
                    type="button"
                    className={
                      entregue
                        ? estilo.botao + " " + estilo.botao_confirmado
                        : estilo.botao + " " + estilo.botao_principal
                    }
                    onClick={() => alternar(aluno.id)}
                  >
                    {entregue ? (
                      <>
                        <LuCheck size={16} />
                        Entregue
                      </>
                    ) : (
                      <>
                        <LuX size={16} />
                        Marcar entrega
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className={estilo.acoes}>
            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/atividades")}
            >
              <LuArrowLeft size={16} />
              Voltar às atividades
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Entregas;
