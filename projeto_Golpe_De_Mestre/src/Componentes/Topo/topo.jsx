import { useState } from "react";
import estilo from "./topo.module.css";
import imgLogo from "../../assets/imgLogo.PNG";

function Topo() {

    const [menuAberto, setMenuAberto] = useState(false);

    function fecharMenu() {
        setMenuAberto(false);
    }

    function irParaSecao(id) {
        fecharMenu();

        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth"
        });
    }

    return (
        <>
            <nav className={estilo.navbar}>

                <div className={estilo.container_logo}>

                    <img
                        src={imgLogo}
                        className={estilo.imgLogo}
                        alt="Logo Golpe de Mestre"
                    />

                    <div className={estilo.texto_logo}>
                        <strong>GOLPE DE MESTRE</strong>
                        <small>Tempo de Avançar</small>
                    </div>

                </div>


                <div className={estilo.container_links}>

                    <a href="#ong">A ONG</a>

                    <a href="#aulas">Aulas</a>

                    <a href="#visitar">Visitar o CT</a>

                    <a href="#doar">Doar</a>

                    <a href="#apoiadores">Apoiadores</a>

                </div>


                <button
                    className={estilo.butao_doar}
                    onClick={() => irParaSecao("doar")}
                >
                    Doar agora
                </button>


                <button
                    className={estilo.menu_mobile}
                    onClick={() => setMenuAberto(true)}
                >
                    ☰
                </button>

            </nav>


            {menuAberto && (
                <div
                    className={estilo.overlay}
                    onClick={fecharMenu}
                />
            )}


            <aside
                className={`${estilo.menu_lateral} ${menuAberto ? estilo.menu_lateral_aberto : ""
                    }`}
            >

                <div className={estilo.menu_header}>

                    <div className={estilo.menu_logo}>

                        <img
                            src={imgLogo}
                            alt="Logo"
                        />

                        <div>
                            <strong>GOLPE DE MESTRE</strong>
                            <small>Tempo de Avançar</small>
                        </div>

                    </div>


                    <button
                        className={estilo.fechar_menu}
                        onClick={fecharMenu}
                    >
                        ×
                    </button>

                </div>


                <div className={estilo.links_mobile}>

                    <a
                        href="#ong"
                        onClick={fecharMenu}
                    >
                        A ONG
                    </a>

                    <a
                        href="#aulas"
                        onClick={fecharMenu}
                    >
                        Aulas
                    </a>

                    <a
                        href="#visitar"
                        onClick={fecharMenu}
                    >
                        Visitar o CT
                    </a>

                    <a
                        href="#doar"
                        onClick={fecharMenu}
                    >
                        Doar
                    </a>

                    <a
                        href="#apoiadores"
                        onClick={fecharMenu}
                    >
                        Apoiadores
                    </a>

                    <button
                        className={estilo.doar_mobile}
                        onClick={() => irParaSecao("doar")}
                    >
                        Doar agora
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Topo;
