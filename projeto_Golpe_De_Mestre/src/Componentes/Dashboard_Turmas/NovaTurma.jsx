import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuSave, LuArrowLeft } from "react-icons/lu";
import estilo from "../Dashboard_Formularios/Formulario.module.css";
import { criarTurma, listarProfessores } from "../../lib/turmasService";
import { useAuth } from "../../lib/auth";
import { rotuloPapel } from "../../lib/usuariosService";

const DIAS_SEMANA = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function NovaTurma() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [professores, setProfessores] = useState([]);
  const [nome, setNome] = useState("");
  const [programa, setPrograma] = useState("");
  const [descricao, setDescricao] = useState("");
  const [esporte, setEsporte] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [lotacao, setLotacao] = useState(20);
  const [situacao, setSituacao] = useState("Ativa");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    listarProfessores().then(setProfessores).catch((e) => setErro(e.message));
  }, []);

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await criarTurma({
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
            <h1>Nova turma</h1>
            <p>Cadastre o programa, o professor responsável e os horários dos encontros.</p>
          </div>
        </div>

        <form className={estilo.cartao} onSubmit={enviar}>
          <h2>Dados da turma</h2>
          <p>A turma aparece na agenda e pode receber matrículas assim que for salva.</p>

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
                placeholder="Ex.: Turma A"
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
                placeholder="Ex.: Infantil"
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
                placeholder="Ex.: Jiu-Jitsu"
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
                placeholder="Ex.: Tatê"
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
                placeholder="Público, metodologia e observações da turma."
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
              {enviando ? "Salvando..." : "Salvar turma"}
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

export default NovaTurma;
