import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft, LuCheck, LuX } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import {
  atualizarSituacaoInscricao,
  matricularInscricao,
} from "../../lib/inscricoesService";
import { listarTurmasParaSeleção } from "../../lib/diarioService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

// Análise de uma inscrição. É aqui que a candidatura vira decisão: colocar
// em espera, recusar, ou matricular — a matrícula cria o aluno na turma.
function AnalisarInscricao() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const inscricao = location.state;

  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [faixa, setFaixa] = useState("branca");
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    listarTurmasParaSeleção().then(setTurmas).catch(() => setTurmas([]));
  }, []);

  async function moverPara(situacao) {
    setErro("");
    setSalvo("");
    setEnviando(true);

    try {
      await atualizarSituacaoInscricao(inscricao.id, situacao);
      navigate("/Dashboard/inscricoes");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  async function matricular() {
    setErro("");
    setSalvo("");
    setEnviando(true);

    try {
      await matricularInscricao(inscricao.id, { turmaId, faixa });
      navigate("/Dashboard/alunos");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  if (!inscricao) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Inscrição não encontrada</h2>
            <p>Abra uma inscrição pela lista para analisá-la.</p>

            <div className={estilo.acoes}>
              <button
                type="button"
                className={estilo.botao + " " + estilo.botao_principal}
                onClick={() => navigate("/Dashboard/inscricoes")}
              >
                Voltar às inscrições
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const matriculada = inscricao.situacaoBruta === "matriculada";

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Inscrições e matrículas</strong>
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
            <h1>Analisar inscrição</h1>
            <p>{inscricao.candidato}</p>
          </div>
        </div>

        <div className={estilo.cartao}>
          <h2>{inscricao.candidato}</h2>
          <p>
            Inscrição de {inscricao.data} · situação atual{" "}
            {inscricao.situacao}.
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
              <small>Responsável</small>
              <strong>{inscricao.responsavel}</strong>
            </div>
            <div>
              <small>Idade</small>
              <strong>{inscricao.idade ?? "—"}</strong>
            </div>
            <div>
              <small>Escola</small>
              <strong>{inscricao.escola || "—"}</strong>
            </div>
          </div>

          <div className={estilo.resumo}>
            <div>
              <small>Telefone</small>
              <strong>{inscricao.telefone || "—"}</strong>
            </div>
            <div>
              <small>Programa</small>
              <strong>{inscricao.programa || "—"}</strong>
            </div>
            <div>
              <small>Endereço</small>
              <strong>{inscricao.endereco || "—"}</strong>
            </div>
          </div>

          {!matriculada && (
            <>
              <h3 className={estilo.subtitulo}>Matrícula</h3>
              <p>
                Matricular cria o cadastro do aluno e marca esta inscrição como
                matriculada.
              </p>

              <div className={estilo.grade}>
                <div className={estilo.campo}>
                  <label htmlFor="turma">Turma</label>
                  <select
                    id="turma"
                    value={turmaId}
                    onChange={(e) => setTurmaId(e.target.value)}
                  >
                    <option value="">Sem turma por enquanto</option>
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome} — {turma.programa}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={estilo.campo}>
                  <label htmlFor="faixa">Faixa inicial</label>
                  <select
                    id="faixa"
                    value={faixa}
                    onChange={(e) => setFaixa(e.target.value)}
                  >
                    <option value="branca">Branca</option>
                    <option value="cinza">Cinza</option>
                    <option value="amarela">Amarela</option>
                  </select>
                </div>
              </div>

              <div className={estilo.acoes}>
                <button
                  type="button"
                  className={estilo.botao + " " + estilo.botao_principal}
                  onClick={matricular}
                  disabled={enviando}
                >
                  <LuCheck size={16} />
                  {enviando ? "Matriculando..." : "Matricular aluno"}
                </button>
              </div>

              <h3 className={estilo.subtitulo}>Outras decisões</h3>

              <div className={estilo.acoes}>
                <button
                  type="button"
                  className={estilo.botao + " " + estilo.botao_secundario}
                  onClick={() => moverPara("espera")}
                  disabled={enviando || inscricao.situacaoBruta === "espera"}
                >
                  Colocar em espera
                </button>

                <button
                  type="button"
                  className={estilo.botao + " " + estilo.botao_perigo}
                  onClick={() => moverPara("recusada")}
                  disabled={enviando || inscricao.situacaoBruta === "recusada"}
                >
                  <LuX size={16} />
                  Recusar
                </button>
              </div>
            </>
          )}

          <div className={estilo.acoes}>
            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/inscricoes")}
            >
              <LuArrowLeft size={16} />
              Voltar às inscrições
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AnalisarInscricao;
