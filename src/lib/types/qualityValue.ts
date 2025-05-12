export type TQualitativeValue = "Very Low" | "Low" | "Medium" | "High" | "Very High" | "Deadly";

export interface IQualitativeRange {
	min: number;
	max: number;
	qualitative: TQualitativeValue;
	color: string;
}
