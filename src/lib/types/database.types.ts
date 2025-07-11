import type { ISynced } from "@/hooks/useCropManager";
import type { ICurrentMix } from "@/hooks/useMixManager";
import type { MergeDeep } from "type-fest";
import type { ITheme } from "./app";
import type { Database as DatabaseGenerated } from "./supabase.types";

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Tables: {
				user_preferences: {
					Row: IDatabaseTheme | IDatabaseCurMix | IDatabaseCropPlanner;
					Insert: IDatabaseTheme | IDatabaseCurMix | IDatabaseCropPlanner;
					Update: IDatabaseTheme | IDatabaseCurMix | IDatabaseCropPlanner;
				};
			};
		};
	}
>;

// Helper to extract base structure
type BaseUserPreference = Omit<
	DatabaseGenerated["public"]["Tables"]["user_preferences"]["Row"],
	"value" | "preference_type"
>;

// Extend base for each variant
export interface IDatabaseTheme extends BaseUserPreference {
	preference_type: "theme";
	value: ITheme;
}

export interface IDatabaseCurMix extends BaseUserPreference {
	preference_type: "cur_mix";
	value: ICurrentMix;
}

export interface IDatabaseCropPlanner extends BaseUserPreference {
	preference_type: "crop_planner";
	value: ISynced;
}
