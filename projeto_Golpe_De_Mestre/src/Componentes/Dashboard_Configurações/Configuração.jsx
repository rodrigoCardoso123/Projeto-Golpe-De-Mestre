import estilo from "./Configuração.module.css"
import {
  LuLayoutGrid,
  LuFilePlus2,
  LuUsersRound,
  LuLayers3,
  LuBookOpen,
  LuCheck,
  LuPresentation,
  LuClipboardList,
  LuBell,
  LuMail,
  LuCalendarDays,
  LuChartNoAxesColumnIncreasing,
  LuHeart,
  LuWalletCards,
  LuShield,
  LuUserRoundCheck,
  LuSun,
  LuExternalLink
} from "react-icons/lu";
function Configuracao(){
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
                        <strong>Configurações</strong>
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

                            <h1>Configurações</h1>

                            <p>
                                Uma fonte única para informações institucionais e conteúdo público.
                            </p>

                        </div>

                        <button className={estilo.botao_site}>
                            Revisar site público
                            <LuExternalLink size={16} />
                        </button>

                    </div>

                    <div className={estilo.aviso}>
                        Alterações são uma prévia local deste navegador.
                        Mantenha dados não confirmados vazios.
                        Esta tela não publica um site nem ativa autenticação,
                        pagamentos ou envio de mensagens.
                    </div>


                    
                    <div className={estilo.grid_configuracoes}>

                        
                        <div className={estilo.card_config}>

                            <h2>Identificação institucional</h2>

                            <p className={estilo.descricao}>
                                Usada no contato, rodapé e módulo de doação.
                            </p>

                            <div className={estilo.grid_campos}>

                                <div className={estilo.campo}>
                                    <label>Nome público</label>
                                    <input
                                        type="text"
                                        defaultValue="Golpe de Mestre"
                                    />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Razão social</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>CNPJ</label>
                                    <input type="text" />
                                </div>

                            </div>

                        </div>


                        <div className={estilo.card_config}>

                            <h2>Canais de contato</h2>

                            <p className={estilo.descricao}>
                                Campos vazios ficam ocultos no site público.
                            </p>

                            <div className={estilo.grid_campos}>

                                <div className={estilo.campo}>
                                    <label>E-mail</label>
                                    <input type="email" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Telefone</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>WhatsApp com país e DDD</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Atendimento</label>
                                    <input type="text" />
                                </div>

                            </div>

                        </div>


                        
                        <div className={estilo.card_config}>

                            <h2>Endereço</h2>

                            <p className={estilo.descricao}>
                                A localização só aparece quando configurada.
                            </p>

                            <div className={estilo.grid_campos}>

                                <div className={`${estilo.campo} ${estilo.campo_largo}`}>
                                    <label>Endereço</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Cidade</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Estado / UF</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>CEP</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Link do mapa</label>
                                    <input type="text" />
                                </div>

                            </div>

                        </div>

                        <div className={estilo.card_config}>

                            <h2>Redes sociais</h2>

                            <p className={estilo.descricao}>
                                Use links completos com https://.
                            </p>

                            <div className={estilo.grid_campos}>

                                <div className={estilo.campo}>
                                    <label>Instagram</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Facebook</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Youtube</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Tiktok</label>
                                    <input type="text" />
                                </div>

                            </div>

                        </div>

                        <div className={estilo.card_config}>

                            <h2>Doações por Pix</h2>

                            <p className={estilo.descricao}>
                                Use exclusivamente a chave e o QR Code oficiais.
                            </p>

                            <div className={estilo.campos_coluna}>

                                <div className={estilo.campo}>
                                    <label>Chave Pix oficial</label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>
                                        URL ou caminho da imagem oficial do QR
                                    </label>
                                    <input type="text" />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Ou enviar o QR oficial</label>
                                    <input type="text" />
                                </div>

                                <small className={estilo.ajuda}>
                                    Até 600 KB. Confira o destino do QR antes do uso.
                                </small>

                            </div>

                        </div>


                        <div className={estilo.card_config}>

                            <h2>Conteúdo público</h2>

                            <p className={estilo.descricao}>
                                Textos que complementam a identidade existente.
                            </p>

                            <div className={estilo.campos_coluna}>

                                <div className={estilo.campo}>
                                    <label>Texto de abertura</label>

                                    <textarea
                                        defaultValue="Disciplina, educação e oportunidade dentro e fora do tatame."
                                    />
                                </div>

                                <div className={estilo.campo}>
                                    <label>História aprovada</label>
                                    <textarea />
                                </div>

                                <div className={estilo.campo}>
                                    <label>Orientação de disponibilidade</label>
                                    <input type="text" />
                                </div>

                            </div>

                        </div>


                        
                        <div className={estilo.card_config}>

                            <h2>Critérios de avaliação</h2>

                            <p className={estilo.descricao}>
                                Um critério por linha. A publicação de regras exige validação pedagógica.
                            </p>

                            <div className={estilo.campos_coluna}>

                                <div className={estilo.campo}>
                                    <label>Dimensões observadas</label>

                                    <textarea
                                        defaultValue={`Técnica
                                        Presença
                                        Comportamento
                                        Comprometimento`}
                                    />

                                </div>

                            </div>

                        </div>


                        
                        <div className={estilo.card_config}>

                            <h2>Categorias financeiras</h2>

                            <p className={estilo.descricao}>
                                Uma categoria por linha. Alterar a lista não modifica lançamentos existentes.
                            </p>

                            <div className={estilo.campos_coluna}>

                                <div className={estilo.campo}>
                                    <label>Categorias</label>

                                    <textarea
                                        defaultValue={`Doações
                                        Materiais
                                        Equipamentos
                                        Transporte
                                        Eventos`}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className={estilo.footer_config}>

                        <span>Sem alterações.</span>

                        <button className={estilo.botao_salvar}>
                            Salvar prévia local
                        </button>

                    </div>
                </section>
        </main>
        </>
    )
}
export default Configuracao;