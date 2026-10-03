import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuUserRoundCheck } from "react-icons/lu";
import estilo from "./novoAcesso.module.css";
import { useAuth } from "../../lib/auth";
import { criarUsuario, listarUsuarios, rotuloPapel } from "../../lib/usuariosService";

// Tela restrita a administradores: cria contas já verificadas para a equipe.
function NovoAcesso() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState("responsavel");
  const [telefone, setTelefone] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [equipe, setEquipe] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const ehAdministrador = perfil?.papel === "administrador";

  useEffect(() => {
    if (!ehAdministrador) {
      setCarregando(false);
      return;
    }

    listarUsuarios()
      .then(setEquipe)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [ehAdministrador]);

  // Bloqueio extra na interface. A proteção real está no banco: a função SQL
  // recusa a criação e o RLS esconde os dados de quem não é administrador.
  if (!carregando && !ehAdministrador) {
    return (
      <main className={estilo.container}>
        <div className={estilo.aviso + " " + estilo.aviso_erro}>
          <p>Acesso restrito. Apenas administradores podem gerenciar acessos.</p>
        </div>
        <button
          type="button"
          className={estilo.botao + " " + estilo.botao_secundario}
          onClick={() => navigate("/Dashboard")}
        >
          Voltar ao painel
        </button>
      </main>
    );
  }

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);

    try {
      await criarUsuario({ email, senha, nome, papel });
      setSucesso(`Acesso de ${nome} criado. O e-mail ${email} já está verificado.`);
      setEmail("");
      setNome("");
      setSenha("");
      setTelefone("");
      setPapel("responsavel");
      setEquipe(await listarUsuarios());
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className={estilo.container}>
      <header className={estilo.header}>
        <div className={estilo.titulo_header}>
          <strong>Equipe e Acesso</strong>
          <p>{dataHoje}</p>
        </div>
        <div className={estilo.perfil_header}>
          <LuBell size={22} />
          <div className={estilo.conteudo_perfil}>
            <strong>{perfil?.nome ?? "Coordenação"}</strong>
            <small>{rotuloPapel(perfil?.papel)}</small>
          </div>
        </div>
      </header>

      <div className={estilo.cartao}>
        <h2>Novo acesso</h2>
        <p>
          A conta é criada já verificada e o usuário entra direto no painel,
          sem precisar confirmar e-mail.
        </p>

        {erro && (
          <div className={estilo.aviso + " " + estilo.aviso_erro}>
            <p>{erro}</p>
          </div>
        )}
        {sucesso && (
          <div className={estilo.aviso + " " + estilo.aviso_sucesso}>
            <p>{sucesso}</p>
          </div>
        )}

        <form onSubmit={enviar}>
          <div className={estilo.grade_2}>
            <div className={estilo.campo}>
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria Souza"
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="email">E-mail (Gmail)</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@gmail.com"
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="senha">Senha provisória</label>
              <input
                id="senha"
                type="text"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <div className={estilo.campo}>
              <label htmlFor="papel">Cargo</label>
              <select
                id="papel"
                value={papel}
                onChange={(e) => setPapel(e.target.value)}
              >
                <option value="responsavel">Responsável</option>
                <option value="professor">Professor</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div className={estilo.campo + " " + estilo.linha_inteira}>
              <label htmlFor="telefone">Telefone (opcional)</label>
              <input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 90000-0000"
              />
            </div>
          </div>

          <div className={estilo.acoes}>
            <button
              type="submit"
              className={estilo.botao + " " + estilo.botao_principal}
              disabled={enviando}
            >
              {enviando ? "Criando acesso..." : "Criar acesso"}
            </button>
            <button
              type="button"
              className={estilo.botao + " " + estilo.botao_secundario}
              onClick={() => navigate("/Dashboard/equipe")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>

      <div className={estilo.cartao} style={{ marginTop: "20px" }}>
        <h2>
          <LuUserRoundCheck size={20} /> Equipe ({equipe.length})
        </h2>
        {carregando && <p>Carregando equipe...</p>}
        {!carregando && equipe.length === 0 && (
          <p>Nenhum acesso cadastrado ainda.</p>
        )}
        {!carregando && equipe.length > 0 && (
          <div className={estilo.grade_2}>
            {equipe.map((pessoa) => (
              <div key={pessoa.id} className={estilo.campo}>
                <strong>{pessoa.nome}</strong>
                <small>{pessoa.email}</small>
                <small>
                  {rotuloPapel(pessoa.papel)} ·{" "}
                  {pessoa.situacao === "ativo" ? "Ativo" : "Inativo"}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default NovoAcesso;