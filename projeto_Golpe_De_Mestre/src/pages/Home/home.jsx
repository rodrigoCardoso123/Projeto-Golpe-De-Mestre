import estilo from "./home.module.css" 
import Topo from "../../Componentes/Topo/topo"
function Home(){ 
    return( 
    <> 
        <main className={estilo.container}> 
            <section className={estilo.banner}> 
                <video className={estilo.video} autoPlay loop muted playsInline > 
                    <source src="/Video - kimono Tempo de Avancar.mp4" type="video/mp4" /> 
                </video> 

                <div className={estilo.conteudo}> 
                    <p className={estilo.p_banner}> PROJETO SOCIAL DE JIU-JITSU E EDUCAÇÃO </p> 
                    <h1 className={estilo.h1_banner}> É TEMPO DE AVANÇAR </h1> 
                    <p className={estilo.p_banner2}> Ensinamos jiu-jitsu e damos reforço escolar para crianças e adolescentes que precisam de um caminho. Disciplina no tatame, apoio na sala de aula — um golpe de mestre na vida de cada aluno. </p> 
                </div> 
            </section> 
        </main> 
        </> 
    ) 
    } 
    export default Home