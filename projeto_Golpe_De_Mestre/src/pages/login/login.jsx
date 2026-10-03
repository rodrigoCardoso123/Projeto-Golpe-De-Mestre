import estilo from "./login.module.css"
import ImgLogo from "../../assets/imgLogo.png"
import imgBanner from '../../assets/imgBanner.png'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../lib/auth"

function Login(){

    const navigate = useNavigate();
    const { login, usuario } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Já logado? Vai direto ao painel.
    if (usuario) navigate("/Dashboard", { replace: true });

    async function enviarFormulario(event) {
        event.preventDefault();
        setErro("");
        setEnviando(true);

        try {
            await login(email, senha);
            navigate("/Dashboard", { replace: true });
        } catch {
            // Mensagem genérica para qualquer falha: senha errada, e-mail
            // inexistente, e-mail não verificado ou usuário sem acesso.
            // Não revelar o motivo evita que se descubra quais e-mails existem.
            setErro("Senha está incorreta ou e-mail está incorreto.");
        } finally {
            setEnviando(false);
        }
    }

    return(
        <>
            <main className={estilo.mainContainer}>
                <div className={estilo.banner}>
                    <div className={estilo.container_logo}>
                        <img src={ImgLogo} className={estilo.imgLogo} />
                            <div className={estilo.texto_logo}>
                                <strong>GOLPE DE MESTRE</strong>
                                <small>Tempo de Avançar</small>
                            </div>
                    </div>
                    <div className={estilo.conteudo_banner}>
                            <strong>Educação · disciplina · comunidade</strong>
                            <h1>Por trás de<br/>
                                cada conquista,<br/>
                                <h2>uma equipe.</h2></h1>
                            <p>O cuidado também acontece aqui.
                               Organize o presente. Acompanhe o futuro. </p>
                    </div>
                    <div className={estilo.container_imgbanner}>
                        <img src={imgBanner} alt=""/>
                    </div>
                    <a href="/">← Voltar ao site público</a>
                </div>
                <div className={estilo.section_login}>
                    <div className={estilo.container_login}>
                        <h1>Gestão do projeto</h1>
                        <h2>Bem-vindo à <br />
                            plataforma do projeto.</h2>
                        <p>Gestão, ensino e família conectados ao desenvolvimento de cada aluno. </p>

                        <form onSubmit={enviarFormulario}>
                            <div>
                                <label htmlFor="email">E-mail</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="senha">Senha</label>
                                <input
                                    id="senha"
                                    name="senha"
                                    type="password"
                                    autoComplete="current-password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                            </div>

                            <a href="#">Esqueci minha senha</a>

                            {erro && <p role="alert" className={estilo.erro_login}>{erro}</p>}

                            <button type="submit" disabled={enviando}>
                                {enviando ? "Entrando..." : "Entrar"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}
export default Login;