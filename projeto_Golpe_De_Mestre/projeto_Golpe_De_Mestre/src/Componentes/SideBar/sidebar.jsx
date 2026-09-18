import estilo from "./sidebar.module.css"
import { NavLink } from "react-router-dom";
import imgLogo from "../../assets/imgLogo.png"
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
  LuSun
} from "react-icons/lu";
import { CiGrid41 } from "react-icons/ci";
function SideBar(){
    return(
        <>
          <aside className={estilo.sidebar}>
                  <div>
                    <div className={estilo.container_logo}>
                            <img src={imgLogo} className={estilo.imgLogo} />
                            <div className={estilo.texto_logo}>
                                <strong>GOLPE DE MESTRE</strong>
                                <small>Tempo de Avançar</small>
                            </div>
                    </div>
          
                    <ul className={estilo.menu}>
                        <h1>Gestão educacional</h1>

                        <li> 
                            <NavLink to="/" className={estilo.nav}>
                                <LuLayoutGrid size={18}/> Visão geral
                            </NavLink> 
                        </li>

                        <li> 
                            <NavLink to="/Dashboard/combos" className={estilo.nav}>
                                <LuFilePlus2 size={18}/> Inscrições e matrículas
                            </NavLink> 
                        </li>

                        <li> 
                            <NavLink to="/Dashboard/orcamentos" className={estilo.nav}>
                                <LuUsersRound size={18}/> Alunos
                            </NavLink> 
                        </li>

                        <li> 
                            <NavLink to="/Dashboard/config" className={estilo.nav}>
                                <LuLayers3 size={18}/> Turmas e horários
                            </NavLink> 
                        </li>

                        <li> 
                            <NavLink to="/Dashboard/config" className={estilo.nav}>
                                <LuBookOpen size={18}/> Diário de aula
                            </NavLink> 
                        </li>

                        <li> 
                            <NavLink to="/Dashboard/config" className={estilo.nav}>
                                <LuCheck size={18}/> Presença
                            </NavLink> 
                        </li>

                        <li> 
                            <NavLink to="/Dashboard/config" className={estilo.nav}>
                                <LuPresentation size={18}/> Desenvolvimento
                            </NavLink> 
                        </li>

                        <li> 
                            <NavLink to="/Dashboard/config" className={estilo.nav}>
                                <LuClipboardList size={18}/> Atividades
                            </NavLink> 
                        </li>

                      <h1>Relacionamento</h1>

                        <li> 
                            <NavLink to="/Dashboard/comunicados" className={estilo.nav}> 
                                <LuBell size={18} />
                                Comunicados 
                            </NavLink> 
                        </li> 

                        <li> 
                            <NavLink to="/Dashboard/solicitacoes" className={estilo.nav}> 
                                <LuMail size={18} />
                                Solicitações 
                            </NavLink> 
                        </li> 

                        <li> 
                            <NavLink to="/Dashboard/visitas" className={estilo.nav}> 
                                <LuCalendarDays size={18} />
                                Visitas ao projeto 
                            </NavLink> 
                        </li> 

                        <h1>Institucional</h1> 

                        <li> 
                            <NavLink to="/Dashboard/relatorios" className={estilo.nav}> 
                                <LuChartNoAxesColumnIncreasing size={18} />
                                Relatórios 
                            </NavLink> 
                        </li> 

                        <li> 
                            <NavLink to="/Dashboard/doacoes" className={estilo.nav}> 
                                <LuHeart size={18} />
                                Doações 
                            </NavLink> 
                        </li> 

                        <li> 
                            <NavLink to="/Dashboard/financeiro" className={estilo.nav}> 
                                <LuWalletCards size={18} />
                                Financeiro 
                            </NavLink> 
                        </li> 

                        <li> 
                            <NavLink to="/Dashboard/apoiadores" className={estilo.nav}> 
                                <LuShield size={18} />
                                Apoiadores 
                            </NavLink> 
                        </li> 

                        <li> 
                            <NavLink to="/Dashboard/equipe" className={estilo.nav}> 
                                <LuUserRoundCheck size={18} />
                                Equipe e acessos 
                            </NavLink> 
                        </li> 

                        <li> 
                            <NavLink to="/Dashboard/configuracoes" className={estilo.nav}> 
                                <LuSun size={18} />
                                Configurações 
                            </NavLink> 
                        </li>
                    </ul>
                  </div>
          
                </aside>
        </>
    )
}
export default SideBar;