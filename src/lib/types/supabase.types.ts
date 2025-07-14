// biome-ignore lint/suspicious/noExplicitAny: Json type too complex, simplified for better IDE and TS experience
export type Json = Record<string, any>;

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					query?: string;
					variables?: Json;
					extensions?: Json;
					operationName?: string;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			mix_recipes: {
				Row: {
					amount: number;
					child_ingredient_id: string;
					created_at: string;
					id: string;
					order_index: number;
					parent_ingredient_id: string | null;
					updated_at: string;
				};
				Insert: {
					amount: number;
					child_ingredient_id: string;
					created_at?: string;
					id?: string;
					order_index: number;
					parent_ingredient_id?: string | null;
					updated_at?: string;
				};
				Update: {
					amount?: number;
					child_ingredient_id?: string;
					created_at?: string;
					id?: string;
					order_index?: number;
					parent_ingredient_id?: string | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "mix_recipes_parent_ingredient_id_fkey";
						columns: ["parent_ingredient_id"];
						isOneToOne: false;
						referencedRelation: "mixes";
						referencedColumns: ["id"];
					},
				];
			};
			mixes: {
				Row: {
					addictiveness: number;
					category: Database["public"]["Enums"]["mix_category_enum"];
					created_at: string;
					created_by: string | null;
					description: string | null;
					id: string;
					image: string;
					information: string | null;
					mix_strengthening: number;
					name: string;
					parent_ingredient_id: string | null;
					strength: number;
					toxicity: number;
					type: Database["public"]["Enums"]["mix_type_enum"];
					updated_at: string;
					visibility: Database["public"]["Enums"]["mix_visibility_enum"];
				};
				Insert: {
					addictiveness: number;
					category: Database["public"]["Enums"]["mix_category_enum"];
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					id?: string;
					image: string;
					information?: string | null;
					mix_strengthening: number;
					name: string;
					parent_ingredient_id?: string | null;
					strength: number;
					toxicity: number;
					type: Database["public"]["Enums"]["mix_type_enum"];
					updated_at?: string;
					visibility?: Database["public"]["Enums"]["mix_visibility_enum"];
				};
				Update: {
					addictiveness?: number;
					category?: Database["public"]["Enums"]["mix_category_enum"];
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					id?: string;
					image?: string;
					information?: string | null;
					mix_strengthening?: number;
					name?: string;
					parent_ingredient_id?: string | null;
					strength?: number;
					toxicity?: number;
					type?: Database["public"]["Enums"]["mix_type_enum"];
					updated_at?: string;
					visibility?: Database["public"]["Enums"]["mix_visibility_enum"];
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					id: string;
					updated_at: string | null;
					username: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					id: string;
					updated_at?: string | null;
					username?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					id?: string;
					updated_at?: string | null;
					username?: string | null;
				};
				Relationships: [];
			};
			user_preferences: {
				Row: {
					created_at: string;
					id: string;
					preference_type: string;
					updated_at: string;
					user_id: string | null;
					value: Json;
				};
				Insert: {
					created_at?: string;
					id?: string;
					preference_type: string;
					updated_at?: string;
					user_id?: string | null;
					value: Json;
				};
				Update: {
					created_at?: string;
					id?: string;
					preference_type?: string;
					updated_at?: string;
					user_id?: string | null;
					value?: Json;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			mix_category_enum: "Mix" | "Pre-Mix";
			mix_type_enum:
				| "Liquid"
				| "Powder"
				| "Crystal"
				| "Pills"
				| "Granulate"
				| "Dried Plant"
				| "Mushrooms";
			mix_visibility_enum: "Public" | "Private";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			mix_category_enum: ["Mix", "Pre-Mix"],
			mix_type_enum: [
				"Liquid",
				"Powder",
				"Crystal",
				"Pills",
				"Granulate",
				"Dried Plant",
				"Mushrooms",
			],
			mix_visibility_enum: ["Public", "Private"],
		},
	},
} as const;
