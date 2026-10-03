import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { atualizarTurma, listarProfessores } from "../../lib/turmasService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// O card de turma já mostra professor e horário concatenados ("Dia · 19h00"),
// então separamos de novo para preencher os campos do formulário.
function separarHorario(horario) {
  const [dia, ...resto] = (horario ?? "").split(" · ");
  return { diaSemana: dia ?? "", horario: resto.join(" · ") };
}

// Edição de uma turma existente.
function EditarTurma() {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  const turma = location.state;

  const partes = separarHorario(turma?.horario);

  const [professores, setProfessores] = useState([]);
  const [nome, setNome] = useState(turma?.nome ?? "");
  const [programa, setPrograma] = useState(turma?.programa ?? "");
  const [descricao, setDescricao] = useState(turma?.descricao ?? "");
  const [esporte, setEsporte] = useState(turma?.esporte ?? "");
  const [professorId, setProfessorId] = useState("");
  const [diaSemana, setDiaSemana] = useState(partes.diaSemana);
  const [horario, setHorario] = useState(partes.horario);
  const [local, setLocal] = useState(turma?.local ?? "");
  const [lotacao, setLotacao] = useState(turma?.capacidade ?? 20);
  const [situacao, setSituacao] = useState(turma?.situacao ?? "Ativa");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    listarProfessores().then(setProfessores).catch(() => setProfessores([]));
  }, []);

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await atualizarTurma(turma.id, {
        nome,
        programa,
        descricao,
        esporte,
        professorId,
        diaSemana,
        horario,
        local,
        lotacao,
        situacao,
      });
      navigate("/Dashboard/turmas");
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  if (!turma) {
    return (
      <main className={estilo.container}>
        <section className={estilo.section_main}>
          <div className={estilo.cartao}>
            <h2>Turma não encontrada</h2>
            <p>Abra uma turma pela lista para editá-la.</p>

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
            <h1>Editar turma</h1>
            <p>Ajuste os dados de {turma.nome}.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>{turma.nome}</h2>
          <p>
            {turma.alunosAtivos} aluno(s) vinculado(s). Alterações valem para a
            agenda e os relatórios.
          </p>

          {erro && (
            <div className={estilo.aviso + " " + estilo.aviso_erro}>
              <p>{erro}</p>
            </div>
          )}

          <div className={estilo.grade}>
            <div className={estilo.campo}>
              <label htmlFor="nome">Nome da turma</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="programa">Programa</label>
              <input
                id="programa"
                type="text"
                value={programa}
                onChange={(e) => setPrograma(e.target.value)}
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="esporte">Esporte / modalidade</label>
              <input
                id="esporte"
                type="text"
                value={esporte}
                onChange={(e) => setEsporte(e.target.value)}
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="professor">Professor responsável</label>
              <select
                id="professor"
                value={professorId}
                onChange={(e) => setProfessorId(e.target.value)}
              >
                <option value="">Não definido</option>
                {professores.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="dia">Dia da semana</label>
              <select
                id="dia"
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
              >
                <option value="">A definir</option>
                {DIAS_SEMANA.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilo.campo}>
              <label htmlFor="horario">Horário</label>
              <input
                id="horario"
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex.: 19h00"
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="local">Local</label>
              <input
                id="local"
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="lotacao">Lotação máxima</label>
              <input
                id="lotacao"
                type="number"
                min="1"
                max="200"
                value={lotacao}
                onChange={(e) => setLotacao(e.target.value)}
              />
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="situacao">Situação</label>
              <select
                id="situacao"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
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
              onClick={() => navigate("/Dashboard/turmas")}
            >
              <LuArrowLeft size={16} />
              Voltar às turmas
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditarTurma;
