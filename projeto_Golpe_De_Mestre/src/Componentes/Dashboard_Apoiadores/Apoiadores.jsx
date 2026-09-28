import estilo from "./Apoiadores.module.css"
import {
    LuBell,
    LuPlus,
    LuSearch
} from "react-icons/lu";
function Apoiadores(){
    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
    return(
        <>
          <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Apoiadores</strong>
                        <p>{dataHoje}</p>
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
                    <div className={estilo.container_titulo}>
                        <div>
                            <strong>Área da equipe</strong>
                            <h1>Financeiro</h1>
                            <p>
                                Acompanhe Entradas, Saidas e Saldo.
                            </p>
                        </div>
                        <div className={estilo.acoes_titulo}>
                            <button className={estilo.botao_exportar} >
                                Prévia no site
                            </button>
                            <button
                                className={estilo.botao_imprimir}
                            >
                                <LuPlus size={16} />
                                Novo apoiador
                            </button>
                        </div>
                    </div>

                    <div className={estilo.container_aviso}>
                        <p>Somente logos enviados e autorizados aparecem na prévia pública. O arquivo original permanece intacto.</p>
                    </div>

                    <div className={estilo.estado_vazio}>
                        <LuSearch size={46} />
                        <h3>Nenhum registro encontrado</h3>
                        <p>Ajuste os filtros ou adicione um registro.</p>
                    </div>
                </section>
          </main>
        </>
    )
}
export default Apoiadores;