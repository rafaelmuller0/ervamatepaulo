import { createClient } from "@supabase/supabase-js";

// Endereço e chave pública do Lovable Cloud (seguros para o navegador).
// Ficam fixos aqui como reserva caso a publicação não receba as variáveis.
const URL_PADRAO = "https://wuhhvmhtvidvyjhkgomr.supabase.co";
const CHAVE_PADRAO = "sb_publishable_UoRBfleOxTSS2fxcOtyRZA_muEgOb0P";

const url = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || URL_PADRAO;
const key = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) || CHAVE_PADRAO;

// Chaves novas não são JWT: enviar só como apikey.
const fetchComChave: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
  headers.set("apikey", key);
  return fetch(input, { ...init, headers });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = createClient(url, key, {
  global: { fetch: fetchComChave },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export const isSupabaseConfigured = true;

export function getSupabaseSetupMessage() {
  return "Não foi possível conectar ao servidor. Tente novamente em instantes.";
}
