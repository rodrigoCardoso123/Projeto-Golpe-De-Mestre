import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import estilo from "./perfilAluno.module.css";
import {
    LuBell,
    LuArrowLeft,
    LuPencil,
    LuCheck,
    LuMedal,
    LuCalendarDays,
    LuLayers3
} from "react-icons/lu";
import { buscarAlunoPorId } from "./dadosAlunos.js";

const abas = ["Resumo", "Presença", "Graduação", "Responsáveis", "Observações"];

function PerfilAluno() {
    const navigate = useNavigate();
    const { id } = useParams();
    const aluno = buscarAlunoPorId(id);

    const [abaAtiva, setAbaAtiva] = useState("Resumo");

    if (!aluno) {
        return (
            <main className={estilo.container}>
                <section className={estilo.section_main}>
                    <div className={estilo.cartao}>
                        <h2>Aluno não encontrado</h2>
                        <p className={estilo.descricao_cartao}>
                            O aluno com id {id} não existe.
                        </p>
                        <button
                            type="button"
                            className={estilo.botao_voltar}
                            onClick={() => navigate("/Dashboard/alunos")}
                        >
                            Voltar para Alunos
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    return (
        <main className={estilo.container}>
            <header className={estilo.header}>
                <div className={estilo.titulo_header}>
                    <strong>Perfil do aluno</strong>
                    <p>{dataHoje}</p>
                </div>
                <div className={estilo.perfil_header}>
                    <LuBell size={22} className={estilo.icone_header} />
                    <div className={estilo.conteudo_perfil}>
                        <p>CM</p>
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
                        <h1>Perfil do aluno</h1>
                        <p>Informações, presença e evolução.</p>
                    </div>

                    <div className={estilo.acoes_topo}>
                        <button
                            type="button"
                            className={estilo.botao_voltar}
                            onClick={() => navigate("/Dashboard/alunos")}
                        >
                            <LuArrowLeft size={16} /> Alunos
                        </button>
                        <button
                            type="button"
                            className={estilo.botao_editar}
                            onClick={() => navigate(`/Dashboard/alunos/perfil/${aluno.id}/editar`)}
                        >
                            <LuPencil size={16} /> Editar cadastro
                        </button>
                    </div>
                </div>

                {/* Cartão de identificação do aluno */}
                <div className={estilo.cartao_aluno}>
                    <div className={estilo.identificacao}>
                        <div className={estilo.avatar}>{aluno.iniciais}</div>

                        <div className={estilo.dados_aluno}>
                            <h2>{aluno.nome}</h2>
                            <span>
                                {aluno.categoria} · {aluno.turma}
                            </span>
                            <span className={estilo.badge_ativo}>{aluno.situacao}</span>
                        </div>
                    </div>

                    <img
                        className={estilo.faixa_aluno}
                        src={aluno.faixa.imagem}
                        alt={`Faixa ${aluno.faixa.nome.toLowerCase()}`}
                    />
                </div>

                {/* Abas */}
                <nav className={estilo.abas}>
                    {abas.map((aba) => (
                        <button
                            key={aba}
                            type="button"
                            className={
                                abaAtiva === aba
                                    ? `${estilo.aba} ${estilo.aba_ativa}`
                                    : estilo.aba
                            }
                            onClick={() => setAbaAtiva(aba)}
                        >
                            {aba}
                        </button>
                    ))}
                </nav>

                {abaAtiva === "Resumo" ? (
                    <>
                        {/* Indicadores */}
                        <div className={estilo.grade_indicadores}>
                            <div className={estilo.cartao_indicador}>
                                <div className={estilo.topo_indicador}>
                                    <span>Presença</span>
                                    <LuCheck size={18} className={estilo.icone_indicador} />
                                </div>
                                <strong>{aluno.presenca}%</strong>
                                <small>Este mês registrou</small>
                            </div>

                            <div className={estilo.cartao_indicador}>
                                <div className={estilo.topo_indicador}>
                                    <span>Graus</span>
                                    <LuMedal size={18} className={estilo.icone_indicador} />
                                </div>
                                <strong>{aluno.faixa.graus}</strong>
                                <small>Recebidos no mês</small>
                            </div>

                            <div className={estilo.cartao_indicador}>
                                <div className={estilo.topo_indicador}>
                                    <span>Aulas faltas</span>
                                    <LuCalendarDays
                                        size={18}
                                        className={estilo.icone_indicador}
                                    />
                                </div>
                                <strong>{aluno.faltas}</strong>
                                <small>Justificadas automaticamente</small>
                            </div>

                            <div className={estilo.cartao_indicador}>
                                <div className={estilo.topo_indicador}>
                                    <span>Avaliações</span>
                                    <LuLayers3
                                        size={18}
                                        className={estilo.icone_indicador}
                                    />
                                </div>
                                <strong>{aluno.avaliacoes}</strong>
                                <small>Nenhuma registrada</small>
                            </div>
                        </div>

                        {/* Informações do percurso */}
                        <div className={estilo.cartao}>
                            <h2>Informações do percurso</h2>

                            <div className={estilo.grade_percurso}>
                                <div>
                                    <small>Matrícula</small>
                                    <p>{aluno.perfil.matricula}</p>
                                </div>
                                <div>
                                    <small>Última graduação</small>
                                    <p>{aluno.perfil.ultimaGraduacao}</p>
                                </div>
                                <div>
                                    <small>Professor</small>
                                    <p>{aluno.perfil.professor}</p>
                                </div>
                                <div>
                                    <small>Programa</small>
                                    <p>{aluno.categoria}</p>
                                </div>
                                <div>
                                    <small>Programa auxiliar</small>
                                    <p>{aluno.perfil.programaAuxiliar}</p>
                                </div>
                                <div>
                                    <small>Faixa</small>
                                    <p>
                                        {aluno.faixa.nome} · {aluno.faixa.graus}{" "}
                                        {aluno.faixa.graus === 1 ? "grau" : "graus"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dados cadastrais */}
                        <div className={estilo.cartao}>
                            <h2>Dados cadastrais</h2>
                            <p className={estilo.descricao_cartao}>
                                Informações da ficha e do cadastro do aluno.
                            </p>

                            <div className={estilo.grade_cadastral}>
                                <div>
                                    <small>Nome do aluno</small>
                                    <p>{aluno.nome}</p>
                                </div>
                                <div>
                                    <small>Idade</small>
                                    <p>{aluno.perfil.idade} anos</p>
                                </div>
                                <div>
                                    <small>Nome da mãe</small>
                                    <p>{aluno.perfil.nomeMae}</p>
                                </div>
                                <div>
                                    <small>Nome do pai (opcional)</small>
                                    <p>{aluno.perfil.nomePai || "Não informado"}</p>
                                </div>
                                <div>
                                    <small>Escola onde estuda</small>
                                    <p>{aluno.perfil.escola}</p>
                                </div>
                                <div>
                                    <small>Telefone</small>
                                    <p>{aluno.perfil.telefone}</p>
                                </div>
                                <div className={estilo.linha_inteira}>
                                    <small>Endereço</small>
                                    <p>{aluno.perfil.endereco}</p>
                                </div>
                            </div>

                            <h3>Documentos</h3>

                            <div className={estilo.lista_documentos}>
                                <div>
                                    <strong>Identidade ou certidão do aluno</strong>
                                    <a href="#">{aluno.perfil.documentoAluno}</a>
                                </div>
                                <div>
                                    <strong>Documento do responsável</strong>
                                    <a href="#">{aluno.perfil.documentoResponsavel}</a>
                                </div>
                            </div>

                            <small className={estilo.nota_documentos}>
                                Os documentos aparecem aqui depois de salvos. Não são
                                exibidos para outras pessoas.
                            </small>
                        </div>
                    </>
                ) : (
                    <div className={estilo.cartao}>
                        <p className={estilo.descricao_cartao}>
                            A aba <strong>{abaAtiva}</strong> ainda será implementada.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default PerfilAluno;
