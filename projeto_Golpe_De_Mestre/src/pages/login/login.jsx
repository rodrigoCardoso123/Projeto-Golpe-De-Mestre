import estilo from "./login.module.css"
import imgLogo from "../../assets/imgLogo.png"
import imgBanner from '../../assets/imgBanner.png'
import { useNavigate } from "react-router-dom"
function Login(){

    const navigate = useNavigate();

    return(
        <>
            <main className={estilo.mainContainer}>
                <div className={estilo.banner}>
                    <div className={estilo.container_logo}>
                        <img src={imgLogo} className={estilo.imgLogo} />
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

                        <form>
                            <div>
                                <label>E-mail ou usuário</label>
                                <input type="text" />
                            </div>

                            <div>
                                <label>Senha</label>
                                <input type="password" name="" id="" />
                            </div>

                            <a href="#">Esqueci minha senha</a>

                            <button onClick={() => {navigate("/Dashboard")}}>Entrar</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}
export default Login;