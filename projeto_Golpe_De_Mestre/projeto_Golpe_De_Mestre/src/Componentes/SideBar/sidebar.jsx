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

function ItemMenu({ to, children }){
    return(
        <li>
            <NavLink
                to={to}
                className={({isActive}) => isActive ? `${estilo.nav} ${estilo.ativo}` : estilo.nav}
            >
                {children}
            </NavLink>
        </li>
    )
}

function SideBar(){
    return(
        <>
          <aside className={estilo.sidebar}>
                  <div>
                    <div className={estilo.container_logo}>
                            <img src={imgLogo} className={estilo.imgLogo} />
                            <div className={estilo.texto_logo}>
                                <strong>Golpe de Mestre</strong>
                                <small>Centro do projeto</small>
                            </div>
                    </div>
          
                    <ul className={estilo.menu}>
                        <h1>Gestão educacional</h1>

                        <ItemMenu to="/">
                                <LuLayoutGrid size={18}/> Visão geral
                            </ItemMenu>

                        <ItemMenu to="/Dashboard/inscricoes">
                                <LuFilePlus2 size={18}/> Inscrições e matrículas
                            </ItemMenu>

                        <ItemMenu to="/Dashboard/alunos">
                                <LuUsersRound size={18}/> Alunos
                            </ItemMenu>

                        <ItemMenu to="/Dashboard/turmas">
                                <LuLayers3 size={18}/> Turmas e horários
                            </ItemMenu>

                        <ItemMenu to="/Dashboard/diario">
                                <LuBookOpen size={18}/> Diário de aula
                            </ItemMenu>

                        <ItemMenu to="/Dashboard/presenca">
                                <LuCheck size={18}/> Presença
                            </ItemMenu>

                        <ItemMenu to="/Dashboard/desenvolvimento">
                                <LuPresentation size={18}/> Desenvolvimento
                            </ItemMenu>

                        <ItemMenu to="/Dashboard/atividades">
                                <LuClipboardList size={18}/> Atividades
                            </ItemMenu>

                      <h1>Relacionamento</h1>

                        <ItemMenu to="/Dashboard/comunicados">
                                <LuBell size={18} />
                                Comunicados 
                            </ItemMenu> 

                        <ItemMenu to="/Dashboard/solicitacoes">
                                <LuMail size={18} />
                                Solicitações 
                            </ItemMenu> 

                        <ItemMenu to="/Dashboard/visitas">
                                <LuCalendarDays size={18} />
                                Visitas ao projeto 
                            </ItemMenu> 

                        <h1>Institucional</h1> 

                        <ItemMenu to="/Dashboard/relatorios">
                                <LuChartNoAxesColumnIncreasing size={18} />
                                Relatórios 
                            </ItemMenu> 

                        <ItemMenu to="/Dashboard/doacoes">
                                <LuHeart size={18} />
                                Doações 
                            </ItemMenu> 

                        <ItemMenu to="/Dashboard/financeiro">
                                <LuWalletCards size={18} />
                                Financeiro 
                            </ItemMenu> 

                        <ItemMenu to="/Dashboard/apoiadores">
                                <LuShield size={18} />
                                Apoiadores 
                            </ItemMenu> 

                        <ItemMenu to="/Dashboard/equipe">
                                <LuUserRoundCheck size={18} />
                                Equipe e acessos 
                            </ItemMenu> 

                        <ItemMenu to="/Dashboard/configuracoes">
                                <LuSun size={18} />
                                Configurações 
                            </ItemMenu>
                    </ul>
              </div>

              <div className={estilo.rodape_sidebar}>
                    <span className={estilo.badge_perfil}>Administrador</span>
                    <p>
                        <strong>Mais que lutas.</strong>
                        <span>Acompanhamos pessoas.</span>
                    </p>
              </div>
          </aside>
        </>
    )
}
export default SideBar;