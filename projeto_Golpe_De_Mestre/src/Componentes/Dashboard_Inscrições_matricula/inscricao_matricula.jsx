import estilo from "./inscricao_matricula.module.css"
import {
  LuBell
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function Inscricao_matricula(){
    const Hoje = new Date();
    const navigate = useNavigate();

    return(
        <>
            <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Inscrições e matrículas</strong>
                        <p>{Hoje.toLocaleDateString("pt-br", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                        })} </p>
                    </div>
                    <div className={estilo.perfil_header}>
                        <LuBell size={22} className={estilo.icone_header}/>
                        <div className={estilo.conteudo_perfil}>
                            <p>GM</p>
                            <div>
                                <strong>Coordenação</strong>
                                <small>Administrador</small>
                            </div>
                        </div>
                    </div>
                </header>

                <section className={estilo.section_main}>
                    <div className={estilo.container_titulo_main}>
                        <div>
                            <strong>Área da equipe</strong>
                            <h1>Inscrições e matrículas</h1>
                            <p>Acompanhe a entrada no projeto, da primeira conver</p>
                        </div>
                        <button onClick={() => {navigate("/Dashboard/Nova_Inscricao")}}>+  Nova inscrição</button>
                    </div>

                    <div className={estilo.container_informacoes}>
                        <div className={estilo.conteudo_informacoes}>
                            <div className={estilo.card_informacoes}>
                                <div className={estilo.card_titulo}>
                                    <h1>2</h1> 
                                </div>
                                <p>Todas</p>
                            </div>

                            <div className={estilo.card_informacoes}>
                                <div className={estilo.card_titulo}>
                                    <h1>0</h1> 
                                </div>
                                <p>Nova</p>
                            </div>

                            <div className={estilo.card_informacoes}>
                                <div className={estilo.card_titulo}>
                                    <h1>1</h1> 
                                </div>
                                <p>Em análise</p>
                            </div>

                            <div className={estilo.card_informacoes}>
                                <div className={estilo.card_titulo}>
                                    <h1>1</h1> 
                                </div>
                                <p>Lista de espera</p>
                            </div>

                            <div className={estilo.card_informacoes}>
                                <div className={estilo.card_titulo}>
                                    <h1>0</h1> 
                                </div>
                                <p>Aprovado</p>
                            </div>

                            <div className={estilo.card_informacoes}>
                                <div className={estilo.card_titulo}>
                                    <h1>0</h1> 
                                </div>
                                <p>Matriculada</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={estilo.container_form}>
                        <div>
                            <label>Buscar candidato ou responsável</label>
                            <input type="text" name="" id="" />
                        </div>
                        <div>
                            <label>Programa</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>
                    </div>

                    <div className={estilo.container_tabela}>
                        <table className={estilo.tabela}>
                            <thead>
                                <tr>
                                    <th>CANDIDATO</th>
                                    <th>PROGRAMA</th>
                                    <th>INSCRIÇÃO</th>
                                    <th>SITUAÇÃO</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        <div className={estilo.candidato}>
                                            <strong>Candidato A</strong>
                                            <span>Responsável A</span>
                                        </div>
                                    </td>

                                    <td>Infantil</td>

                                    <td>03/09/2026</td>

                                    <td>
                                        <span className={`${estilo.status} ${estilo.em_analise}`}>
                                            Em análise
                                        </span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.analisar}>
                                            Analisar
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className={estilo.candidato}>
                                            <strong>Candidato B</strong>
                                            <span>Responsável B</span>
                                        </div>
                                    </td>

                                    <td>Juvenil</td>

                                    <td>31/08/2026</td>

                                    <td>
                                        <span className={`${estilo.status} ${estilo.lista_espera}`}>
                                            Lista de espera
                                        </span>
                                    </td>

                                    <td>
                                        <a href="#" className={estilo.analisar}>
                                            Analisar
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </section>
            </main>
        </>
    )
}
export default Inscricao_matricula;