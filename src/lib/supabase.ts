// Usa o cliente do Lovable Cloud (configurado automaticamente).
export { supabase } from "@/integrations/supabase/client";

export const isSupabaseConfigured = true;

export function getSupabaseSetupMessage() {
  return "Não foi possível conectar ao servidor. Tente novamente em instantes.";
}
