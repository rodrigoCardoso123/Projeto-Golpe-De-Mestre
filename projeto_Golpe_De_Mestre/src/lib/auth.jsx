import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Contexto de autenticação: expõe usuário, perfil, loading e as ações de login/logout.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega a sessão atual e o perfil público (papel/situação) do usuário.
  useEffect(() => {
    let cancelado = false;

    async function carregarSessao() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelado) return;
      setUsuario(session?.user ?? null);
      await carregarPerfil(session?.user);
      if (!cancelado) setCarregando(false);
    }

    async function carregarPerfil(user) {
      if (!user) {
        setPerfil(null);
        return;
      }

      const { data } = await supabase
        .from("perfis")
        .select("id, nome, email, papel, situacao")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelado) setPerfil(data ?? null);
    }

    carregarSessao();

    // Mantém o estado em sincronia: login, logout ou refresh em outra aba.
    const { data: inscricao } = supabase.auth.onAuthStateChange(
      async (_evento, session) => {
        setUsuario(session?.user ?? null);
        await carregarPerfil(session?.user);
        setCarregando(false);
      }
    );

    return () => {
      cancelado = true;
      inscricao.subscription.unsubscribe();
    };
  }, []);

  async function login(email, senha) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) throw error;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const ehEquipe =
    perfil?.papel === "administrador" || perfil?.papel === "professor";

  return (
    <AuthContext.Provider
      value={{ usuario, perfil, carregando, ehEquipe, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  }

  return contexto;
}