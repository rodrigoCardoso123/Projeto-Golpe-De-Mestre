import estilo from "./dashboard.module.css"
import { Routes, Route } from "react-router-dom";
import SideBar from "../../Componentes/SideBar/sidebar";
import VisaoGeral from "../../Componentes/Dashboard_Visão_Geral/visaoGeral";
function Dashboard(){
    return(
        <>
        <div className={estilo.container_principal}>
            <SideBar/>

            <main className={estilo.dashboard}>
                <Routes>
                    <Route path="/" element={<VisaoGeral/>} />
                </Routes>
            </main>
        </div>
        </>
    )
}
export default Dashboard;