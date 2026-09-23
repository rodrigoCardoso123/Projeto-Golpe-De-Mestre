import estilo from "./Diario_de_aula.module.css"
import {
  LuBell
} from "react-icons/lu";

function DiarioDeAula(){
    const Hoje = new Date();
    return(
        <>
            <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Diário de aula</strong>
                        <p>{Hoje.toLocaleDateString("pt-br", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                        })} </p>
                    </div>
                    <div className={estilo.perfil_header}>
                        <LuBell size={22} className={estilo.icone_header} />
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
                            <h1>Diário de aula</h1>
                            <p>Do planejamento ao registro do encontro, com conte</p>
                        </div>
                        <button>+  Planejar aula</button>
                    </div>

                    <div className={estilo.container_form}>
                        
                        <div>
                            <label>Turma</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Situação</label>
                            <select name="">
                                <option value="">Todos</option>
                                <option value="">...</option>
                            </select>
                        </div>

                        <div>
                            <label>Mês</label>
                            <input type="date" name="" id="" />
                        </div>
                    </div>

                    <div className={estilo.container_aulas}>
                        <article className={estilo.article_aula}>

                            <div className={estilo.data_aula}>
                                <strong>05</strong>
                                <span>set. de 26</span>
                            </div>

                            <div className={estilo.info_aula}>

                                <div className={estilo.topo_aula}>
                                    <span className={estilo.turma}>
                                        Turma A
                                    </span>

                                    <span className={estilo.status}>
                                        Realizada
                                    </span>
                                </div>

                                <h2>Cooperação e fundamentos</h2>

                                <p>
                                    Praticar equilíbrio e escuta nas atividades em dupla.
                                </p>

                                <small>Professor A</small>

                            </div>

                            <div className={estilo.acoes_aula}>
                                <button>Abrir diário</button>
                                <a href="#">Ver chamada</a>
                            </div>

                        </article>
                    </div>
                </section>
            </main>
        </>
    )
}
export default DiarioDeAula;