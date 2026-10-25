// Usa o cliente do Lovable Cloud (configurado automaticamente).
import { supabase as cloudClient } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = cloudClient as any;

export const isSupabaseConfigured = true;

export function getSupabaseSetupMessage() {
  return "Não foi possível conectar ao servidor. Tente novamente em instantes.";
}
