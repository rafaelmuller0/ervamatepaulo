export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      configuracoes: {
        Row: {
          criado_em: string
          id: string
          nome_empresa: string
          tema: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          nome_empresa?: string
          tema?: string
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          nome_empresa?: string
          tema?: string
          user_id?: string
        }
        Relationships: []
      }
      devedores: {
        Row: {
          criado_em: string
          endereco: string
          id: string
          nome: string
          observacoes: string
          telefone: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          endereco?: string
          id?: string
          nome: string
          observacoes?: string
          telefone?: string
          user_id: string
        }
        Update: {
          criado_em?: string
          endereco?: string
          id?: string
          nome?: string
          observacoes?: string
          telefone?: string
          user_id?: string
        }
        Relationships: []
      }
      dividas: {
        Row: {
          criado_em: string
          data_vencimento: string
          descricao: string
          devedor_id: string
          id: string
          saldo: number
          status: string
          user_id: string
          valor_original: number
        }
        Insert: {
          criado_em?: string
          data_vencimento: string
          descricao?: string
          devedor_id: string
          id?: string
          saldo: number
          status?: string
          user_id: string
          valor_original: number
        }
        Update: {
          criado_em?: string
          data_vencimento?: string
          descricao?: string
          devedor_id?: string
          id?: string
          saldo?: number
          status?: string
          user_id?: string
          valor_original?: number
        }
        Relationships: [
          {
            foreignKeyName: "dividas_devedor_id_fkey"
            columns: ["devedor_id"]
            isOneToOne: false
            referencedRelation: "devedores"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos_dividas: {
        Row: {
          divida_id: string
          id: string
          observacao: string
          pago_em: string
          user_id: string
          valor: number
        }
        Insert: {
          divida_id: string
          id?: string
          observacao?: string
          pago_em?: string
          user_id: string
          valor: number
        }
        Update: {
          divida_id?: string
          id?: string
          observacao?: string
          pago_em?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_dividas_divida_id_fkey"
            columns: ["divida_id"]
            isOneToOne: false
            referencedRelation: "dividas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria: string
          criado_em: string
          descricao: string
          estoque: number
          estoque_minimo: number
          id: string
          nome: string
          preco_custo: number
          preco_venda: number
          user_id: string
        }
        Insert: {
          categoria?: string
          criado_em?: string
          descricao?: string
          estoque?: number
          estoque_minimo?: number
          id?: string
          nome: string
          preco_custo?: number
          preco_venda?: number
          user_id: string
        }
        Update: {
          categoria?: string
          criado_em?: string
          descricao?: string
          estoque?: number
          estoque_minimo?: number
          id?: string
          nome?: string
          preco_custo?: number
          preco_venda?: number
          user_id?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente: string | null
          custo_total: number
          data_venda: string
          desconto: number
          forma_pagamento: string
          id: string
          produto_id: string
          quantidade: number
          user_id: string
          valor_bruto: number
          valor_liquido: number
        }
        Insert: {
          cliente?: string | null
          custo_total: number
          data_venda?: string
          desconto?: number
          forma_pagamento: string
          id?: string
          produto_id: string
          quantidade: number
          user_id: string
          valor_bruto: number
          valor_liquido: number
        }
        Update: {
          cliente?: string | null
          custo_total?: number
          data_venda?: string
          desconto?: number
          forma_pagamento?: string
          id?: string
          produto_id?: string
          quantidade?: number
          user_id?: string
          valor_bruto?: number
          valor_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      registrar_pagamento_divida: {
        Args: { p_divida_id: string; p_observacao?: string; p_valor: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
