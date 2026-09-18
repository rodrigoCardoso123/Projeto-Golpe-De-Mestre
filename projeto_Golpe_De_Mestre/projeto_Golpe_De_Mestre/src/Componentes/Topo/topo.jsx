import estilo from "./topo.module.css"
import imgLogo from "../../assets/imgLogo.PNG"

function Topo(){
    return(
        <>
            <nav className={estilo.navbar}>
                <div className={estilo.container_logo}>
                    <img src={imgLogo} className={estilo.imgLogo} />
                    <div className={estilo.texto_logo}>
                         <strong>GOLPE DE MESTRE</strong>
                         <small>Tempo de Avançar</small>
                    </div>
                </div>
                <div className={estilo.container_links}>
                    <a href="#">A ONG</a>
                    <a href="#">Aulas</a>
                    <a href="#">Visitar o CT</a>
                    <a href="#">Doar</a>
                    <a href="#">Apoiadores</a>
                </div>
                <button className={estilo.butao_doar}>Doar agora</button>
                
            </nav>
        </>
    )
}
export default Topo;