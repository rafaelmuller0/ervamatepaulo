import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  url &&
    key &&
    url.startsWith("https://") &&
    !url.includes("SEU-PROJETO") &&
    !key.includes("SUA_CHAVE") &&
    !key.includes("placeholder"),
);

// O fallback permite que a tela de configuração seja exibida sem derrubar o app.
// A autenticação deve ser bloqueada na interface até que as credenciais reais existam.
export const supabase = createClient(
  url || "https://example.supabase.co",
  key || "public-anon-key-placeholder",
);

export function getSupabaseSetupMessage() {
  return "O Supabase ainda não está configurado neste computador. Crie um arquivo .env na pasta do projeto com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY do seu projeto Supabase. Depois pare e reinicie o servidor (Ctrl+C e npm run dev).";
}
