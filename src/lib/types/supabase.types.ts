// biome-ignore lint/suspicious/noExplicitAny: Json type too complex, simplified for better IDE and TS experience
export type Json = Record<string, any>;

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ingredient_demand: {
        Row: {
          created_at: string | null
          demand_value: number
          id: string
          ingredient_id: string
          location: string
          sector: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          demand_value: number
          id?: string
          ingredient_id: string
          location: string
          sector: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          demand_value?: number
          id?: string
          ingredient_id?: string
          location?: string
          sector?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_demand_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_purchases: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string
          price: number
          source: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id: string
          price: number
          source: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string
          price?: number
          source?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_purchases_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_recipes: {
        Row: {
          amount: number
          child_ingredient_id: string
          created_at: string | null
          id: string
          order_index: number
          parent_ingredient_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          child_ingredient_id: string
          created_at?: string | null
          id?: string
          order_index: number
          parent_ingredient_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          child_ingredient_id?: string
          created_at?: string | null
          id?: string
          order_index?: number
          parent_ingredient_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_recipes_child_ingredient_id_fkey"
            columns: ["child_ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredient_recipes_parent_ingredient_id_fkey"
            columns: ["parent_ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_sell_prices: {
        Row: {
          created_at: string | null
          ingredient_id: string
          max_price: number
          min_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ingredient_id: string
          max_price: number
          min_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ingredient_id?: string
          max_price?: number
          min_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_sell_prices_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: true
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          addictiveness: number
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image: string | null
          information: string | null
          is_custom: boolean
          mix_strengthening: number
          name: string
          strength: number
          toxicity: number
          type: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          addictiveness: number
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          information?: string | null
          is_custom?: boolean
          mix_strengthening: number
          name: string
          strength: number
          toxicity: number
          type: string
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          addictiveness?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          information?: string | null
          is_custom?: boolean
          mix_strengthening?: number
          name?: string
          strength?: number
          toxicity?: number
          type?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preference_type: string
          updated_at: string | null
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          preference_type: string
          updated_at?: string | null
          user_id?: string
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          preference_type?: string
          updated_at?: string | null
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ingredient_market_data: {
        Args: { ingredient_uuid: string }
        Returns: {
          purchases: Json
          sell_prices: Json
          demand: Json
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

