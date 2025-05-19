import type { MergeDeep } from "type-fest";
import type { ITheme } from "./app";
import type { Database as DatabaseGenerated } from "./supabase.types";
// Override the type for a specific column in a view:export
export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Tables: {
				user_preferences: {
					Row: {
						value: ITheme | null;
					};
					Insert: {
						value?: ITheme | null;
					};
					Update: {
						value?: ITheme | null;
					};
				};
			};
		};
	}
>;
