import estilo from "./home.module.css"
import imgLogo from "../../assets/imgLogo.PNG"
import barra from "../../assets/codigo_de_barra_projeto.png"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
function Home(){ 
    const navigate = useNavigate()
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(50)
    const [formEnviado, setFormEnviado] = useState(false)

    const irPara = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    const copiarPix = async () => {
        try {
            await navigator.clipboard.writeText("doacoes@tempodeavancar.org.br")
            alert("Chave PIX copiada!")
        } catch {
            alert("Não foi possível copiar automaticamente. Chave PIX: doacoes@tempodeavancar.org.br")
        }
    }

    const enviarFormulario = (event) => {
        event.preventDefault()
        setFormEnviado(true)
    }

    useEffect(() => {
    const elementos = document.querySelectorAll("[data-reveal]")

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(estilo.reveal_visivel)
                    entry.target.classList.add(estilo.animacao_visivel)

                    // força todos os filhos com entrada_canto a aparecer
                    entry.target.querySelectorAll(`.${estilo.entrada_canto},.${estilo.objeto_canto}`).forEach(el => {
                        el.classList.add(estilo.animacao_visivel)
                    })
                }
            })
        },
        { threshold: 0.12 }
    )

    elementos.forEach((elemento) => observer.observe(elemento))
    return () => observer.disconnect()
}, [])

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
                        <div className={estilo.container_butoes_banner}>
                            <button type="button" className={estilo.button_azul_banner} onClick={() => irPara("visitar")}>Agendar visita ao CT</button>
                            <button type="button" className={estilo.button_branco_banner} onClick={() => irPara("doar")}>Quero apoiar a ONG</button>
                        </div> 
                </div> 
            </section>

            <section id="ong" data-reveal className={`${estilo.section_historia} ${estilo.reveal}`}>
                <div className={estilo.container_historia}>
                    <div className={`${estilo.container_img} ${estilo.objeto_canto} ${estilo.objeto_esquerda} ${estilo.entrada_canto} ${estilo.entrada_esquerda}`}>
                        <img src={imgLogo} alt="imagem_da_logo" className={estilo.imglogo} />
                        <div className={`${estilo.card_img_historia} ${estilo.objeto_canto} ${estilo.objeto_direita} ${estilo.entrada_canto} ${estilo.entrada_direita}`}>
                            <strong>+12</strong>
                            <p>ANOS FORMANDO CAMPEÕES DENTRO E FORA DO TATAME</p>
                        </div>
                    </div>
                    <div className={estilo.conteudo_historia}>
                        <p className={estilo.p_historia}>NOSSA HISTÓRIA</p>
                        <h1 className={estilo.h1_historia}>Do tatame para a vida</h1>
                        <p className={estilo.p2_historia}>Golpe de Mestre nasceu da vontade de um grupo de mestres de jiu-jitsu de oferecer, além da luta, um caminho. Sabemos que o esporte é caro e que nem toda criança tem acesso a uma academia — por isso levamos o tatame até quem mais precisa.</p>
                        <p className={estilo.p2_historia}>Hoje unimos duas frentes: as aulas de jiu-jitsu, que ensinam disciplina, respeito e autocontrole; e o reforço escolar, que garante que cada aluno continue evoluindo também na escola. Acreditamos que corpo e mente avançam juntos.</p>
                        <ul className={estilo.container_lista}>
                            <li className={estilo.item_lista}>Aulas 100% gratuitas para a comunidade</li>
                            <li className={estilo.item_lista}>Acompanhamento pedagógico e escolar constante</li>
                            <li className={estilo.item_lista}>Professores faixas-pretas e educadores voluntários</li>
                            <li className={estilo.item_lista}>Transparência total no uso das doações</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="jornada" data-reveal className={`${estilo.section_jornada} ${estilo.reveal}`}>
                <div className={estilo.container_jornada}>
                    <p className={estilo.p_jornada}>NOSSA JORNADA ATÉ AQUI</p>
                    <h1 className={estilo.h1_jornada}>Cada número aqui é um degrau — como uma graduação no tatame</h1>
                    <div className={estilo.container_jornada_numero}>
                        <div className={`${estilo.card_jornada} ${estilo.card_animada} ${estilo.objeto_canto} ${estilo.entrada_canto} ${estilo.entrada_baixo} ${estilo.entrada_delay_4} ${estilo.entrada_canto} ${estilo.entrada_baixo} ${estilo.entrada_delay_3} ${estilo.entrada_canto} ${estilo.entrada_baixo} ${estilo.entrada_delay_2} ${estilo.entrada_canto} ${estilo.entrada_baixo} ${estilo.entrada_delay_1}`}>
                            <div className={estilo.ponto}></div>
                            <h1>180+</h1>
                            <p>ALUNOS ATIVOS</p>
                        </div>
                        <div className={`${estilo.card_jornada} ${estilo.card_animada} ${estilo.objeto_canto}`}>
                            <div className={estilo.ponto_laranja}></div>
                            <h1>24</h1>
                            <p>FAIXAS FORMADAS EM 2026</p>
                        </div>
                        <div className={`${estilo.card_jornada} ${estilo.card_animada} ${estilo.objeto_canto}`}>
                            <div className={estilo.ponto_azul}></div>
                            <h1>6</h1>
                            <p>PROFESSORES E EDUCADORES</p>
                        </div>
                        <div className={`${estilo.card_jornada} ${estilo.card_animada} ${estilo.objeto_canto}`}>
                            <div className={estilo.ponto_vermelho}></div>
                            <h1>12</h1>
                            <p>ANOS DE HISTÓRIA</p>
                        </div>

                    </div>
                </div>
            </section>

            <section id="aulas" data-reveal className={`${estilo.section_aulas} ${estilo.reveal}`}>
                <div className={estilo.conteudo_aulas}>
                    <p className={estilo.p_aulas}>O QUE ENSINAMOS</p>
                    <h1 className={estilo.h1_aulas}>Duas aulas, um único propósito</h1>
                    <p className={estilo.p2_aulas}>Cada aluno da Tempo de Avançar participa das duas frentes do projeto — porque disciplina no tatame só faz sentido se caminhar junto com a educação.</p>

                    <div className={estilo.container_aulas_informacao}>
                        <div className={`${estilo.card_aulas} ${estilo.card_animada}`}>
                            <h1>Jiu-Jitsu</h1>
                            <p className={estilo.p2_aulas}>Turmas divididas por idade e faixa, com graduação acompanhada e participação em competições regionais. Ensinamos a arte suave como ferramenta de disciplina, respeito e autoconfiança.</p>

                            <div className={estilo.container_card_p_azul}>
                                <p className={estilo.card_p_azul}>Infantil 5–12 anos</p>
                                <p className={estilo.card_p_azul}>Juvenil 13–17 anos</p>
                                <p className={estilo.card_p_azul}>3x por semana</p>
                            </div>
                        </div>

                        <div className={`${estilo.card_aulas} ${estilo.card_animada}`}>
                            <h1>Reforço escolar</h1>
                            <p className={estilo.p2_aulas}>Apoio em português e matemática, acompanhamento de boletim e rotina de estudos, feito por educadores voluntários. Frequência nas aulas é pré-requisito para continuar no jiu-jitsu.</p>

                            <div className={estilo.container_card_p_azul}>
                                <p className={estilo.card_p_azul}>Ensino fundamental</p>
                                <p className={estilo.card_p_azul}>Turmas reduzidas</p>
                                <p className={estilo.card_p_azul}>2x por semana</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="visitar" data-reveal className={`${estilo.section_agendamento} ${estilo.reveal}`}>
                    <div className={`${estilo.container_principal_agendamento} ${estilo.objeto_canto} ${estilo.objeto_esquerda} ${estilo.entrada_canto} ${estilo.entrada_esquerda}`}>
                        <div className={estilo.container_conteudo_agendamento}>
                            <p className={estilo.p_agendamento}>CONHEÇA DE PERTO</p>
                            <h1>Agende uma visita ao nosso CT</h1>
                            <p className={estilo.p2_agendamento}>Quer conhecer o espaço, ver uma aula acontecendo e entender como a ONG funciona por dentro? Preencha o formulário e nossa equipe combina o melhor dia com você.</p>

                            <ul>
                                <li>Sem compromisso, apenas para conhecer</li>
                                <li>Aberto a famílias, apoiadores e voluntários</li>
                                <li>Resposta em até 2 dias úteis</li>
                            </ul>

                        </div>
                        <div className={estilo.container_conteudo_agendamento}>
                            <form onSubmit={enviarFormulario}>
                                <div className={estilo.linha}>
                                    <div>
                                        <label htmlFor="nome">NOME COMPLETO</label>
                                        <input type="text" name="nome" id="nome" />
                                    </div>

                                <div>
                                    <label htmlFor="whatsapp">WHATSAPP</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        id="whatsapp"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                             </div>

                        <div>
                            <label htmlFor="email">E-MAIL</label>
                            <input type="email" name="email" id="email" />
                        </div>

                        <div className={estilo.linha}>
                            <div>
                                <label htmlFor="interesse">TENHO INTERESSE EM</label>
                                <select name="interesse" id="interesse">
                                    <option value=""></option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="data">MELHOR DATA</label>
                                <input type="date" name="data" id="data" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mensagem">MENSAGEM (OPCIONAL)</label>
                            <textarea name="mensagem" id="mensagem"></textarea>
                        </div>

                        <button type="submit" className={estilo.button_formulario}>
                            {formEnviado ? "Solicitação enviada ✓" : "Solicitar visita"}
                        </button>
                        {formEnviado && (
                            <p className={estilo.mensagem_sucesso}>
                                Recebemos sua solicitação. Nossa equipe entrará em contato.
                            </p>
                        )}

                            </form>
                        </div>
                    </div>
            </section>

            <section id="doar" data-reveal className={`${estilo.section_doacao} ${estilo.reveal}`}>
                    <div className={estilo.container_doacao}>
                        <div className={`${estilo.container_codigoDeBarra} ${estilo.objeto_canto} ${estilo.objeto_direita} ${estilo.entrada_canto} ${estilo.entrada_direita}`}>
                            <strong>DOAÇÃO VIA PIX</strong>
                            <div className={estilo.fundo_codigoDeBarra}>
                                <img src={barra} alt="" className={estilo.barraImg} />
                            </div>
                            <div className={estilo.container_butoes}>
                                {[20, 50, 100, 200].map((valor) => (
                                    <button
                                        key={valor}
                                        type="button"
                                        className={doacaoSelecionada === valor ? estilo.botao_doacao_ativo : ""}
                                        onClick={() => setDoacaoSelecionada(valor)}
                                    >
                                        R$ {valor}
                                    </button>
                                ))}
                            </div>
                            <p className={estilo.valor_doacao}>
                                Valor selecionado: <strong>R$ {doacaoSelecionada}</strong>
                            </p>
                            <div className={estilo.container_copiar_pix}>
                                <p>doacoes@tempodeavancar.org.br</p>
                                <button type="button" onClick={copiarPix}>COPIAR</button>
                            </div>
                        </div>
                        <div className={`${estilo.conteudo_doacao} ${estilo.objeto_canto} ${estilo.objeto_esquerda} ${estilo.entrada_canto} ${estilo.entrada_esquerda}`}>
                            <strong>SUA AJUDA VIRA TATAME, QUIMONO E MERENDA</strong>
                            <h1>Um Pix pode mudar o rumo de uma criança</h1>
                            <p>Somos uma ONG e vivemos das doações da nossa comunidade. Cada real ajuda a manter quimonos, material escolar, transporte para competições e a estrutura do nosso Centro de Treinamento.</p>

                            <ul>
                                <li>
                                   <strong>01</strong>  <p>R$ 50 mantêm um kit de material escolar por mês</p>
                                </li>
                                <li>
                                    <strong>02</strong> <p>R$ 100 cobrem um quimono novo para um aluno</p>
                                </li>
                                <li>
                                    <strong>03</strong> <p>R$ 200 ajudam a levar uma turma a um campeonato</p>
                                </li>
                            </ul>

                            <button type="button" onClick={() => irPara("doar")}>
                                Quero ser um apoiador fixo
                            </button>
                        </div>
                    </div>
            </section>

            <section id="apoiadores" data-reveal className={`${estilo.section_apoiadores} ${estilo.reveal}`}>
                    <div className={estilo.conteudo_apoiadores}>
                        <strong>QUEM ACREDITA NESSA CAUSA</strong>
                        <h1>Nossos apoiadores</h1>
                        <p>Empresas e pessoas que sustentam o projeto todos os meses. Sua marca pode estar aqui também.</p>
                        <div className={estilo.apoiadores_carrossel}>
                            <div className={estilo.trilho_apoiadores}>
                                <div className={estilo.grupo_apoiadores}>
                                    <div className={estilo.item_apoiador}><p>Instituto Avançar</p></div>
                                    <div className={estilo.item_apoiador}><p>Grupo Mestre</p></div>
                                    <div className={estilo.item_apoiador}><p>Konbat Sports</p></div>
                                    <div className={estilo.item_apoiador}><p>Farmácia Vida</p></div>
                                    <div className={estilo.item_apoiador}><p>Construtora Alicerce</p></div>
                                    <div className={estilo.item_apoiador}><p>Studio 220</p></div>
                                </div>

                                <div className={estilo.grupo_apoiadores} aria-hidden="true">
                                    <div className={estilo.item_apoiador}><p>Instituto Avançar</p></div>
                                    <div className={estilo.item_apoiador}><p>Grupo Mestre</p></div>
                                    <div className={estilo.item_apoiador}><p>Konbat Sports</p></div>
                                    <div className={estilo.item_apoiador}><p>Farmácia Vida</p></div>
                                    <div className={estilo.item_apoiador}><p>Construtora Alicerce</p></div>
                                    <div className={estilo.item_apoiador}><p>Studio 220</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>

            <section id="professores" data-reveal className={`${estilo.section_professores} ${estilo.reveal}`}>
                <div className={estilo.conteudo_professores}>
                    <div>
                        <h1>Área restrita — professores e administração</h1>
                        <p>Controle de presença, monitoramento de faixas, dados dos alunos e caixa financeiro da ONG.</p>
                    </div>

                        <button onClick={() => {navigate("/Login")}}>Acessar painel →</button>
                </div>
            </section>

            <footer className={estilo.footer}>

                <div className={estilo.footer_conteudo}>

                    <div className={estilo.footer_sobre}>
                        <div className={estilo.footer_marca}>
                            <img
                                src={imgLogo}
                                alt="Logo"
                                className={estilo.footer_logo}
                            />

                            <h2>
                                TEMPO DE<br />
                                AVANÇAR
                            </h2>
                        </div>

                        <p>
                            ONG dedicada ao ensino de jiu-jitsu e reforço escolar para
                            crianças e adolescentes.
                        </p>
                    </div>


                    <div className={estilo.footer_navegacao}>
                        <h3>NAVEGAÇÃO</h3>

                        <a href="#ong" onClick={(event) => { event.preventDefault(); irPara("ong") }}>A ONG</a>
                        <a href="#aulas" onClick={(event) => { event.preventDefault(); irPara("aulas") }}>Aulas</a>
                        <a href="#visitar" onClick={(event) => { event.preventDefault(); irPara("visitar") }}>Visitar o CT</a>
                        <a href="#doar" onClick={(event) => { event.preventDefault(); irPara("doar") }}>Doar</a>
                    </div>


                    <div className={estilo.footer_contato}>
                        <h3>CONTATO</h3>

                        <p>contato@tempodeavancar.org.br</p>
                        <p>(11) 90000-0000</p>
                        <p>Rua do Tatame, 123 — São Paulo/SP</p>
                    </div>

                </div>


                <div className={estilo.footer_linha}></div>


                <div className={estilo.footer_bottom}>
                    <p>
                        © 2026 Tempo de Avançar — Golpe de Mestre. Todos os direitos reservados.
                    </p>

                    <p>
                        CNPJ 00.000.000/0001-00
                    </p>
                </div>

            </footer>
        </main> 
        </> 
    ) 
    } 
    export default Home
