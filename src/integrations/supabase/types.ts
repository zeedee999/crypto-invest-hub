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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      coin_swaps: {
        Row: {
          created_at: string
          exchange_rate: number
          from_amount: number
          from_symbol: string
          from_wallet_id: string
          id: string
          status: string
          to_amount: number
          to_symbol: string
          to_wallet_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exchange_rate: number
          from_amount: number
          from_symbol: string
          from_wallet_id: string
          id?: string
          status?: string
          to_amount: number
          to_symbol: string
          to_wallet_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          exchange_rate?: number
          from_amount?: number
          from_symbol?: string
          from_wallet_id?: string
          id?: string
          status?: string
          to_amount?: number
          to_symbol?: string
          to_wallet_id?: string
          user_id?: string
        }
        Relationships: []
      }
      crypto_wallet_addresses: {
        Row: {
          chain: string
          coin_name: string
          coin_symbol: string
          created_at: string | null
          id: string
          is_active: boolean | null
          qr_code_url: string | null
          updated_at: string | null
          wallet_address: string
        }
        Insert: {
          chain: string
          coin_name: string
          coin_symbol: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          qr_code_url?: string | null
          updated_at?: string | null
          wallet_address: string
        }
        Update: {
          chain?: string
          coin_name?: string
          coin_symbol?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          qr_code_url?: string | null
          updated_at?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      investment_plans: {
        Row: {
          amount: number
          apy: number
          created_at: string
          current_value: number
          id: string
          last_gain_calculated: string | null
          plan_type: string
          start_date: string
          status: string
          term_months: number
          unlock_date: string | null
          updated_at: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          apy: number
          created_at?: string
          current_value?: number
          id?: string
          last_gain_calculated?: string | null
          plan_type: string
          start_date?: string
          status?: string
          term_months?: number
          unlock_date?: string | null
          updated_at?: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          apy?: number
          created_at?: string
          current_value?: number
          id?: string
          last_gain_calculated?: string | null
          plan_type?: string
          start_date?: string
          status?: string
          term_months?: number
          unlock_date?: string | null
          updated_at?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          asset_symbol: string
          created_at: string | null
          fee: number | null
          id: string
          notes: string | null
          price_usd: number | null
          status: string | null
          tx_hash: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          asset_symbol: string
          created_at?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          price_usd?: number | null
          status?: string | null
          tx_hash?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          asset_symbol?: string
          created_at?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          price_usd?: number | null
          status?: string | null
          tx_hash?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          created_at: string
          deposit_balance: number
          id: string
          profit_balance: number
          total_bonus: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deposit_balance?: number
          id?: string
          profit_balance?: number
          total_bonus?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deposit_balance?: number
          id?: string
          profit_balance?: number
          total_bonus?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_settings: {
        Row: {
          btc_address: string | null
          btc_qr: string | null
          created_at: string | null
          eth_address: string | null
          eth_qr: string | null
          id: string
          updated_at: string | null
          usdt_address: string | null
          usdt_qr: string | null
        }
        Insert: {
          btc_address?: string | null
          btc_qr?: string | null
          created_at?: string | null
          eth_address?: string | null
          eth_qr?: string | null
          id?: string
          updated_at?: string | null
          usdt_address?: string | null
          usdt_qr?: string | null
        }
        Update: {
          btc_address?: string | null
          btc_qr?: string | null
          created_at?: string | null
          eth_address?: string | null
          eth_qr?: string | null
          id?: string
          updated_at?: string | null
          usdt_address?: string | null
          usdt_qr?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          asset_name: string
          asset_symbol: string
          balance: number | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          asset_name: string
          asset_symbol: string
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          asset_name?: string
          asset_symbol?: string
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_daily_bonus: { Args: never; Returns: undefined }
      calculate_daily_profits: { Args: never; Returns: undefined }
      calculate_investment_gains: { Args: never; Returns: undefined }
      create_notification: {
        Args: {
          _message: string
          _title: string
          _type: string
          _user_id: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_deposit_balance: {
        Args: { p_amount: number; p_user_id: string }
        Returns: undefined
      }
      notify_profit_gain: {
        Args: { _amount: number; _plan_type: string; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
