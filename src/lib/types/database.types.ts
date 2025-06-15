import type { ISynced } from "@/hooks/useCropManager";
import type { ICurrentMix } from "@/hooks/useMixManger";
import type { MergeDeep } from "type-fest";
import type { ITheme } from "./app";
import type { Database as DatabaseGenerated, Tables } from "./supabase.types";
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

interface IDatabaseTheme extends Tables<"user_preferences"> {
	preference_type: "theme";
	value: ITheme;
}
interface IDatabaseCurMix extends Tables<"user_preferences"> {
	preference_type: "cur_mix";
	value: ICurrentMix;
}

interface IDatabaseCropPlanner extends Tables<"user_preferences"> {
	preference_type: "crop_planner";
	value: ISynced;
}
