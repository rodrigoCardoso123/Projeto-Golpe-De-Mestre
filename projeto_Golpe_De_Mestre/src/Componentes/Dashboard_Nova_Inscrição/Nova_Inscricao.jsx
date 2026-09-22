import estilo from "./Nova_Incricao.module.css"
import {
  LuBell
} from "react-icons/lu";
function Nova_Inscricao(){
    const Hoje = new Date();
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
                <section className={estilo.section}>

                    <div className={estilo.titulo_section}>
                        <strong>INSCRIÇÕES / NOVA INSCRIÇÃO</strong>
                        <h1>Nova inscrição</h1>
                        <p>
                            Registre uma candidatura para análise. A inscrição ainda não cria um aluno matriculado.
                        </p>
                        <span>* Campos obrigatórios. Nome do pai é opcional.</span>
                    </div>


                    <div className={estilo.card_formulario}>

                        <h2>1. Dados do aluno</h2>

                        <div className={estilo.linha_campos}>

                            <div className={estilo.campo}>
                                <label>Nome do aluno *</label>
                                <input
                                    type="text"
                                    placeholder="Nome completo do aluno"
                                />
                            </div>

                            <div className={estilo.campo}>
                                <label>Idade *</label>
                                <input
                                    type="number"
                                    placeholder="Idade em anos"
                                />
                            </div>

                        </div>

                        <div className={estilo.campo}>
                            <label>Escola onde estuda *</label>
                            <input
                                type="text"
                                placeholder="Nome da escola"
                            />
                        </div>

                        <div className={estilo.campo}>
                            <label>Endereço *</label>
                            <input
                                type="text"
                                placeholder="Rua, número, complemento, bairro e cidade"
                            />
                        </div>

                    </div>


                    <div className={estilo.card_formulario}>

                        <h2>2. Família e contato</h2>

                        <div className={estilo.linha_campos}>

                            <div className={estilo.campo}>
                                <label>Nome da mãe *</label>
                                <input
                                    type="text"
                                    placeholder="Nome completo da mãe"
                                />
                            </div>

                            <div className={estilo.campo}>
                                <label>Nome do pai (opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Nome completo do pai, se informado"
                                />
                            </div>

                        </div>

                        <div className={estilo.campo}>
                            <label>Telefone *</label>
                            <input
                                type="tel"
                                placeholder="Telefone para contato com DDD"
                            />
                        </div>

                    </div>


                    <div className={estilo.card_formulario}>

                        <h2>3. Documentos</h2>

                        <p className={estilo.descricao_documentos}>
                            Anexe um documento do aluno e um documento do responsável.
                        </p>

                        <div className={estilo.documentos}>

                            <div className={estilo.documento}>
                                <strong>Identidade ou certidão do aluno *</strong>

                                <span>Nenhum arquivo selecionado</span>

                                <small>Escolha um arquivo legível.</small>

                                <label className={estilo.botao_arquivo}>
                                    Selecionar arquivo
                                    <input type="file" />
                                </label>
                            </div>


                            <div className={estilo.documento}>
                                <strong>Documento do responsável *</strong>

                                <span>Nenhum arquivo selecionado</span>

                                <small>Escolha um arquivo legível.</small>

                                <label className={estilo.botao_arquivo}>
                                    Selecionar arquivo
                                    <input type="file" />
                                </label>
                            </div>

                        </div>

                    </div>


                    <div className={estilo.acoes}>

                        <button
                            type="button"
                            className={estilo.cancelar}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className={estilo.salvar}
                        >
                            Salvar inscrição
                        </button>

                    </div>

                </section>
            </main>
        </>
    )
}
export default Nova_Inscricao;