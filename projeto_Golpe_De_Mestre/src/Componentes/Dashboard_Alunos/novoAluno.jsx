import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import estilo from "./novoAluno.module.css";
import { LuBell } from "react-icons/lu";

function NovoAluno() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nomeAluno: "",
        idade: "",
        escola: "",
        endereco: "",
        nomeMae: "",
        nomePai: "",
        telefone: ""
    });

    const [arquivoAluno, setArquivoAluno] = useState(null);
    const [arquivoResponsavel, setArquivoResponsavel] = useState(null);

    const inputArquivoAluno = useRef(null);
    const inputArquivoResponsavel = useRef(null);

    const atualizarCampo = (campo, valor) => {
        setForm((estadoAnterior) => ({
            ...estadoAnterior,
            [campo]: valor
        }));
    };

    const aoSelecionarArquivo = (evento, setter) => {
        const arquivo = evento.target.files[0];
        if (arquivo) {
            setter(arquivo.name);
        }
    };

    const aoSalvar = (evento) => {
        evento.preventDefault();
        // Por enquanto só volta para a lista. Aqui entrará o envio para a API.
        navigate("/Dashboard/alunos");
    };

    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    return (
        <main className={estilo.container}>
            <header className={estilo.header}>
                <div className={estilo.titulo_header}>
                    <strong>Novo aluno</strong>
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
                <nav className={estilo.breadcrumb}>
                    <button onClick={() => navigate("/Dashboard/alunos")}>
                        Alunos
                    </button>
                    <span>/</span>
                    <span>Novo cadastro</span>
                </nav>

                <div className={estilo.container_titulo}>
                    <h1>Novo aluno</h1>
                    <p>
                        Cadastre diretamente um aluno já admitido. Para candidaturas
                        em análise, use Nova inscrição.
                    </p>
                    <small>* Campos obrigatórios. Nome do pai é opcional.</small>
                </div>

                <form onSubmit={aoSalvar}>
                    <div className={estilo.cartao}>
                        <h2>1. Dados do aluno</h2>

                        <div className={estilo.grade_2}>
                            <div className={estilo.campo}>
                                <label htmlFor="nome-aluno">
                                    Nome do aluno <span>*</span>
                                </label>
                                <input
                                    id="nome-aluno"
                                    type="text"
                                    placeholder="Nome completo do aluno"
                                    value={form.nomeAluno}
                                    onChange={(e) =>
                                        atualizarCampo("nomeAluno", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className={estilo.campo}>
                                <label htmlFor="idade">
                                    Idade <span>*</span>
                                </label>
                                <input
                                    id="idade"
                                    type="number"
                                    min="0"
                                    max="120"
                                    placeholder="Idade em anos"
                                    value={form.idade}
                                    onChange={(e) =>
                                        atualizarCampo("idade", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className={`${estilo.campo} ${estilo.linha_inteira}`}>
                                <label htmlFor="escola">
                                    Escola onde estuda <span>*</span>
                                </label>
                                <input
                                    id="escola"
                                    type="text"
                                    placeholder="Nome da escola"
                                    value={form.escola}
                                    onChange={(e) =>
                                        atualizarCampo("escola", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className={`${estilo.campo} ${estilo.linha_inteira}`}>
                                <label htmlFor="endereco">
                                    Endereço <span>*</span>
                                </label>
                                <input
                                    id="endereco"
                                    type="text"
                                    placeholder="Rua, número, complemento, bairro e cidade"
                                    value={form.endereco}
                                    onChange={(e) =>
                                        atualizarCampo("endereco", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={estilo.cartao}>
                        <h2>2. Família e contato</h2>

                        <div className={estilo.grade_2}>
                            <div className={estilo.campo}>
                                <label htmlFor="nome-mae">
                                    Nome da mãe <span>*</span>
                                </label>
                                <input
                                    id="nome-mae"
                                    type="text"
                                    placeholder="Nome completo da mãe"
                                    value={form.nomeMae}
                                    onChange={(e) =>
                                        atualizarCampo("nomeMae", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className={estilo.campo}>
                                <label htmlFor="nome-pai">
                                    Nome do pai <small>(opcional)</small>
                                </label>
                                <input
                                    id="nome-pai"
                                    type="text"
                                    placeholder="Nome completo do pai, se informado"
                                    value={form.nomePai}
                                    onChange={(e) =>
                                        atualizarCampo("nomePai", e.target.value)
                                    }
                                />
                            </div>

                            <div className={`${estilo.campo} ${estilo.linha_inteira}`}>
                                <label htmlFor="telefone">
                                    Telefone <span>*</span>
                                </label>
                                <input
                                    id="telefone"
                                    type="tel"
                                    placeholder="Telefone para contato com DDD"
                                    value={form.telefone}
                                    onChange={(e) =>
                                        atualizarCampo("telefone", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={estilo.cartao}>
                        <h2>3. Documentos</h2>
                        <p className={estilo.descricao_documentos}>
                            Anexe um documento do aluno e um documento do responsável.
                        </p>

                        <div className={estilo.grade_2}>
                            <div className={estilo.area_arquivo}>
                                <strong>
                                    Identidade ou certidão do aluno <span>*</span>
                                </strong>
                                <p>
                                    {arquivoAluno
                                        ? arquivoAluno
                                        : "Nenhum arquivo selecionado"}
                                </p>
                                <small>Escolha um arquivo legível</small>
                                <input
                                    ref={inputArquivoAluno}
                                    type="file"
                                    accept="image/*,.pdf"
                                    hidden
                                    onChange={(e) =>
                                        aoSelecionarArquivo(e, setArquivoAluno)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => inputArquivoAluno.current.click()}
                                >
                                    Selecionar arquivo
                                </button>
                            </div>

                            <div className={estilo.area_arquivo}>
                                <strong>
                                    Documento do responsável <span>*</span>
                                </strong>
                                <p>
                                    {arquivoResponsavel
                                        ? arquivoResponsavel
                                        : "Nenhum arquivo selecionado"}
                                </p>
                                <small>Escolha um arquivo legível</small>
                                <input
                                    ref={inputArquivoResponsavel}
                                    type="file"
                                    accept="image/*,.pdf"
                                    hidden
                                    onChange={(e) =>
                                        aoSelecionarArquivo(e, setArquivoResponsavel)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        inputArquivoResponsavel.current.click()
                                    }
                                >
                                    Selecionar arquivo
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={estilo.acoes}>
                        <button
                            type="button"
                            className={estilo.botao_cancelar}
                            onClick={() => navigate("/Dashboard/alunos")}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className={estilo.botao_salvar}>
                            Cadastrar aluno
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default NovoAluno;
