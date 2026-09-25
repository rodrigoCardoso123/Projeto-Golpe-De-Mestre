import estilo from "./financeiro.module.css";

import {
    LuBell,
    LuDownload,
    LuPlus,
    LuWalletCards,
    LuLayers3,
    LuChevronRight
} from "react-icons/lu";

function Financeiro() {
    const dataHoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const lancamentos = [
        {
            id: 1,
            data: "03/09/2026",
            descricao: "Material de treino",
            categoria: "Materiais",
            tipo: "Saída",
            valor: "- R$ 65,00",
        },
        {
            id: 2,
            data: "02/09/2026",
            descricao: "Doação - Doador",
            categoria: "Doações",
            tipo: "Entrada",
            valor: "+ R$ 150,00",
        }
    ];

    return (
        <div className={estilo.container}>

            <header className={estilo.header}>
                <div className={estilo.titulo_header}>
                    <strong>Financeiro</strong>
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



            <main className={estilo.main}>
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
                            <LuDownload size={16} />
                            Exportar CSV
                        </button>
                        <button
                            className={estilo.botao_imprimir}
                        >
                            <LuPlus size={16} />
                            Novo lançamento
                        </button>
                    </div>
                </div>


                <div className={estilo.filtros}>

                    <div className={estilo.campo}>
                        <label>Mês</label>

                        <input
                            type="text"
                            placeholder=""
                        />
                    </div>

                    <div className={estilo.campo}>
                        <label>Tipo</label>

                        <select>
                            <option>Todos</option>
                            <option>Entrada</option>
                            <option>Saída</option>
                        </select>
                    </div>

                    <div className={estilo.campo}>
                        <label>Categoria</label>

                        <select>
                            <option>Todas</option>
                            <option>Doações</option>
                            <option>Materiais</option>
                        </select>
                    </div>

                </div>



                <div className={estilo.resumo}>

                    <div className={estilo.card_resumo}>

                        <div className={estilo.card_topo}>
                            <span>Entradas</span>
                            <LuWalletCards size={18} />
                        </div>

                        <strong>R$ 150,00</strong>

                        <small>Período selecionado</small>

                    </div>


                    <div className={estilo.card_resumo}>

                        <div className={estilo.card_topo}>
                            <span>Saídas</span>
                            <LuWalletCards size={18} />
                        </div>

                        <strong>R$ 65,00</strong>

                        <small>Período selecionado</small>

                    </div>


                    <div className={estilo.card_resumo}>

                        <div className={estilo.card_topo}>
                            <span>Saldo do período</span>
                            <LuLayers3 size={18} />
                        </div>

                        <strong>R$ 85,00</strong>

                        <small>Entradas menos saídas</small>

                    </div>

                </div>


                <div className={estilo.grid_graficos}>

                    <section className={estilo.card_grafico}>

                        <h2>Entradas e saídas</h2>

                        <p>Resumo do período selecionado</p>

                        <div className={estilo.legenda}>

                            <span>
                                <i className={estilo.legenda_entrada}></i>
                                Entradas: R$ 150,00
                            </span>

                            <span>
                                <i className={estilo.legenda_saida}></i>
                                Saídas: R$ 65,00
                            </span>

                        </div>


                        <div className={estilo.barra_item}>

                            <span>Entradas</span>

                            <div className={estilo.barra_fundo}>
                                <div
                                    className={estilo.barra_entrada}
                                />
                            </div>

                            <strong>R$ 150,00</strong>

                        </div>


                        <div className={estilo.barra_item}>

                            <span>Saídas</span>

                            <div className={estilo.barra_fundo}>
                                <div
                                    className={estilo.barra_saida}
                                />
                            </div>

                            <strong>R$ 65,00</strong>

                        </div>

                    </section>


                    <section className={estilo.card_grafico}>

                        <h2>Saídas por categoria</h2>

                        <div className={estilo.categoria_item}>

                            <span>Materiais</span>

                            <div className={estilo.categoria_barra}>
                                <div />
                            </div>

                            <strong>R$ 65,00</strong>

                        </div>

                    </section>

                </div>



                <section className={estilo.card_fluxo}>

                    <h2>Fluxo de caixa mensal</h2>

                    <p>
                        Saldo de cada mês em R$. Últimos seis meses até
                        setembro de 2026. Considera todas as categorias e tipos.
                    </p>


                    <div className={estilo.grafico_linha}>

                        <div className={estilo.eixo_y}>
                            <span>85</span>
                            <span>0</span>
                        </div>

                        <div className={estilo.area_grafico}>

                            <svg
                                viewBox="0 0 700 190"
                                preserveAspectRatio="none"
                            >


                                <line
                                    x1="0"
                                    y1="25"
                                    x2="700"
                                    y2="25"
                                    className={estilo.linha_grade}
                                />

                                <line
                                    x1="0"
                                    y1="155"
                                    x2="700"
                                    y2="155"
                                    className={estilo.linha_grade}
                                />

                                <polyline
                                    points="
                                        20,155
                                        150,155
                                        280,155
                                        410,155
                                        540,155
                                        670,25
                                    "
                                    className={estilo.linha_valores}
                                />

                                <circle cx="20" cy="155" r="4" />
                                <circle cx="150" cy="155" r="4" />
                                <circle cx="280" cy="155" r="4" />
                                <circle cx="410" cy="155" r="4" />
                                <circle cx="540" cy="155" r="4" />
                                <circle cx="670" cy="25" r="4" />

                            </svg>


                            <div className={estilo.meses}>

                                <span>abr. de 26</span>
                                <span>mai. de 26</span>
                                <span>jun. de 26</span>
                                <span>jul. de 26</span>
                                <span>ago. de 26</span>
                                <span>set. de 26</span>

                            </div>

                        </div>

                    </div>


                    <button className={estilo.link_valores}>
                        Ver valores por mês
                        <LuChevronRight size={14} />
                    </button>

                </section>

                <div className={estilo.tabela_container}>

                    <table>

                        <thead>

                            <tr>
                                <th>DATA</th>
                                <th>DESCRIÇÃO</th>
                                <th>CATEGORIA</th>
                                <th>TIPO</th>
                                <th>VALOR</th>
                            </tr>

                        </thead>

                        <tbody>

                            {lancamentos.map((lancamento) => (

                                <tr key={lancamento.id}>

                                    <td>
                                        {lancamento.data}
                                    </td>

                                    <td>
                                        {lancamento.descricao}
                                    </td>

                                    <td>
                                        {lancamento.categoria}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                lancamento.tipo === "Entrada"
                                                    ? estilo.badge_entrada
                                                    : estilo.badge_saida
                                            }
                                        >
                                            {lancamento.tipo}
                                        </span>

                                    </td>

                                    <td
                                        className={
                                            lancamento.tipo === "Entrada"
                                                ? estilo.valor_entrada
                                                : estilo.valor_saida
                                        }
                                    >
                                        {lancamento.valor}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </main>

        </div>
    );
}

export default Financeiro;