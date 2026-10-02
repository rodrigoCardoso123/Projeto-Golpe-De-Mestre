import estilo from "./sidebar.module.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import imgLogo from "../../assets/imgLogo.png";

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
    LuMenu,
    LuX
} from "react-icons/lu";


function ItemMenu({ to, end, children, onClick }) {
    return (
        <li>
            <NavLink
                to={to}
                end={end}
                onClick={onClick}
                className={({ isActive }) =>
                    isActive
                        ? `${estilo.nav} ${estilo.ativo}`
                        : estilo.nav
                }
            >
                {children}
            </NavLink>
        </li>
    );
}


function SideBar() {

    const [menuAberto, setMenuAberto] = useState(false);

    const fecharMenu = () => {
        setMenuAberto(false);
    };

    return (
        <>

            {/* Barra superior do celular */}
            <div className={estilo.mobileHeader}>

                <div className={estilo.mobileLogo}>

                    <img
                        src={imgLogo}
                        alt="Logo Golpe de Mestre"
                    />

                    <div>
                        <strong>Golpe de Mestre</strong>
                        <small>Centro do projeto</small>
                    </div>

                </div>

                <button
                    className={estilo.menuButton}
                    onClick={() => setMenuAberto(!menuAberto)}
                    aria-label="Abrir menu"
                >
                    {menuAberto
                        ? <LuX size={25} />
                        : <LuMenu size={25} />
                    }
                </button>

            </div>


            {/* Fundo escuro quando o menu está aberto */}
            {menuAberto && (
                <div
                    className={estilo.overlay}
                    onClick={fecharMenu}
                />
            )}


            {/* Sidebar */}
            <aside
                className={`${estilo.sidebar} ${menuAberto ? estilo.sidebarAberta : ""
                    }`}
            >

                <div>

                    <div className={estilo.container_logo}>

                        <img
                            src={imgLogo}
                            className={estilo.imgLogo}
                            alt="Logo"
                        />

                        <div className={estilo.texto_logo}>

                            <strong>Golpe de Mestre</strong>

                            <small>
                                Centro do projeto
                            </small>

                        </div>

                    </div>


                    <ul className={estilo.menu}>

                        <h1>Gestão educacional</h1>

                        <ItemMenu
                            to="/Dashboard"
                            end
                            onClick={fecharMenu}
                        >
                            <LuLayoutGrid size={18} />
                            Visão geral
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/inscricoes"
                            onClick={fecharMenu}
                        >
                            <LuFilePlus2 size={18} />
                            Inscrições e matrículas
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/alunos"
                            onClick={fecharMenu}
                        >
                            <LuUsersRound size={18} />
                            Alunos
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/turmas"
                            onClick={fecharMenu}
                        >
                            <LuLayers3 size={18} />
                            Turmas e horários
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/diario"
                            onClick={fecharMenu}
                        >
                            <LuBookOpen size={18} />
                            Diário de aula
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/presenca"
                            onClick={fecharMenu}
                        >
                            <LuCheck size={18} />
                            Presença
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/desenvolvimento"
                            onClick={fecharMenu}
                        >
                            <LuPresentation size={18} />
                            Desenvolvimento
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/atividades"
                            onClick={fecharMenu}
                        >
                            <LuClipboardList size={18} />
                            Atividades
                        </ItemMenu>


                        <h1>Relacionamento</h1>


                        <ItemMenu
                            to="/Dashboard/comunicados"
                            onClick={fecharMenu}
                        >
                            <LuBell size={18} />
                            Comunicados
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/solicitacoes"
                            onClick={fecharMenu}
                        >
                            <LuMail size={18} />
                            Solicitações
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/visitas"
                            onClick={fecharMenu}
                        >
                            <LuCalendarDays size={18} />
                            Visitas ao projeto
                        </ItemMenu>


                        <h1>Institucional</h1>


                        <ItemMenu
                            to="/Dashboard/relatorios"
                            onClick={fecharMenu}
                        >
                            <LuChartNoAxesColumnIncreasing size={18} />
                            Relatórios
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/doacoes"
                            onClick={fecharMenu}
                        >
                            <LuHeart size={18} />
                            Doações
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/financeiro"
                            onClick={fecharMenu}
                        >
                            <LuWalletCards size={18} />
                            Financeiro
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/apoiadores"
                            onClick={fecharMenu}
                        >
                            <LuShield size={18} />
                            Apoiadores
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/equipe"
                            onClick={fecharMenu}
                        >
                            <LuUserRoundCheck size={18} />
                            Equipe e acessos
                        </ItemMenu>


                        <ItemMenu
                            to="/Dashboard/configuracoes"
                            onClick={fecharMenu}
                        >
                            <LuSun size={18} />
                            Configurações
                        </ItemMenu>

                    </ul>

                </div>


                <div className={estilo.rodape_sidebar}>

                    <span className={estilo.badge_perfil}>
                        Administrador
                    </span>

                    <p>
                        <strong>Mais que lutas.</strong>
                        <span>Acompanhamos pessoas.</span>
                    </p>

                </div>

            </aside>

        </>
    );
}

export default SideBar;