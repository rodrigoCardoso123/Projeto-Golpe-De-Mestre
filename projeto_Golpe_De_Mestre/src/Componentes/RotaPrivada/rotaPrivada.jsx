import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { podeAcessar } from "../../lib/permissoes";

// Bloqueia o acesso a rotas internas enquanto não houver sessão do Supabase Auth.
// A rota pretendida é guardada para voltar a ela depois do login.
export function RotaPrivada({ children }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return null;
  if (!usuario) return <Navigate to="/Login" replace state={{ de: location.pathname }} />;

  return children;
}

// Restringe uma rota a determinados cargos.
// Ao contrário de RotaPrivada, espera a sessão carregar antes de decidir —
// sem isso, um administrador seria barrado por um piscar na hora do refresh.
export function SomenteAdministrador({ children }) {
  const { perfil, usuario, carregando } = useAuth();

  if (carregando) return null;
  if (!usuario) return <Navigate to="/Login" replace />;
  if (perfil?.papel !== "administrador") return <Navigate to="/Dashboard" replace />;

  return children;
}

// Guarda genérica: recebe a área e consulta o mapa de permissões.
// É esta que protege cada rota do dashboard.
export function SomenteCargos({ area, children }) {
  const { perfil, usuario, carregando } = useAuth();

  if (carregando) return <Carregando />;
  if (!usuario) return <Navigate to="/Login" replace />;
  if (!podeAcessar(perfil?.papel, area)) return <AcessoNegado />;

  return children;
}

function Carregando() {
  return (
    <div style={{ padding: "40px", color: "#626B76", fontFamily: "inherit" }}>
      Carregando...
    </div>
  );
}

// Explica o bloqueio em vez de redirecionar em silêncio: a pessoa precisa
// saber que o acesso existe, mas não é liberado para o cargo dela.
export function AcessoNegado() {
  const { perfil } = useAuth();

  return (
    <div style={{ padding: "40px", fontFamily: "inherit" }}>
      <h2 style={{ color: "#1C1F24", fontSize: "22px", marginBottom: "8px" }}>
        Acesso restrito
      </h2>
      <p style={{ color: "#626B76", fontSize: "14px", marginBottom: "20px" }}>
        Seu cargo ({perfil?.papel ?? "não informado"}) não tem permissão para esta
        área. Se precisar de acesso, fale com um administrador do projeto.
      </p>
      <a
        href="/Dashboard"
        style={{
          display: "inline-block",
          padding: "10px 18px",
          background: "#173F73",
          color: "#fff",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        Voltar ao painel
      </a>
    </div>
  );
}