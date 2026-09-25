import estilo from "./Doacoes.module.css";
import {
    LuBell, LuPlus
} from "react-icons/lu";
const Doadores = [
    {
        id: 1,
        doador: "Anônimo",
        valor: 80.00,
        data: "03/09/2026",
        situacao: "Pendente",
        forma: "Transferência",
        recorrente: "Não"
    },
    {
        id: 2,
        doador: "Doador",
        valor: 150.00,
        data: "02/09/2026",
        situacao: "confirmada",
        forma: "Pix",
        recorrente: "Não"
    }
];

function Doacoes(){
    const Hoje = new Date();
    
    return(
        <>
            <main className={estilo.container}>
                <header className={estilo.header}>
                    <div className={estilo.titulo_header}>
                        <strong>Doações</strong>
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
                            <h1>Doações</h1>
                            <p>Registros administrativos de contribuições. Sem processamento de pagamentos.</p>
                        </div>
                        <button>
                            <LuPlus size={16} />
                            Registrar doação
                        </button>
                    </div>

                    <div className={estilo.container_form}>
                        <div>
                            <label>Buscar doador</label>
                            <input type="text" name="" id="" />
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
                            <input type="text" name="" id="" />
                        </div>
                    </div>

                    <div className={estilo.container_tabela}>
                        <table className={estilo.tabela}>
                            <thead>
                                <tr>
                                    <th>DOADOR</th>
                                    <th>DATA</th>
                                    <th>VALOR</th>
                                    <th>FORMA</th>
                                    <th>SITUAÇÃO</th>
                                    <th>RECORRENTE</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Doadores.map((doador) => (
                                    <tr key={doador.id}>

                                        <td>
                                            {doador.doador}
                                        </td>

                                        <td>
                                            {doador.data}
                                        </td>

                                        <td>
                                            R${doador.valor}
                                        </td>

                                        <td>
                                            {doador.forma}
                                        </td>

                                        <td>
                                            <span>{doador.situacao}</span>
                                        </td>

                                        <td>
                                            {doador.recorrente ? 'Sim' : 'Não'}
                                        </td>
                                        <td className={estilo.coluna_acao}>
                                            <button className={estilo.botao_analisar}>
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p>{Doadores.length} registro(s). Confirmadas na seleção: R$ 150,00. </p>
                </section>
            </main>
        </>
    )
}
export default Doacoes;