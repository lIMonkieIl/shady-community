"use client";
import { type FullMixData, useMixesManager } from "@/hooks/useMixesManager";
import { use$, useEffectOnce, useObservable } from "@legendapp/state/react";
import { AlertTriangleIcon, ArrowRightIcon, DatabaseIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../shared/ui/dialog";

export default function MixMigration() {
	const [oldMixesDetected, setOldMixesDetected] = useState(false);
	const [data, setData] = useState<FullMixData>();
	const isOpen = useObservable(false);
	const open = use$(isOpen);
	const [migrationResult, setMigrationResult] = useState<{
		success: string[];
		failed: { name: string; error: string }[];
		summary: string;
	} | null>(null);
	const {
		actions: { migrateOldMixes },
	} = useMixesManager();
	useEffectOnce(() => {
		const dataString = localStorage.getItem("persist:root");
		if (!dataString) {
			setOldMixesDetected(false);
			return;
		}

		try {
			const raw = JSON.parse(dataString);

			const parsed: FullMixData = {
				mix: JSON.parse(raw.mix),
				premixes: JSON.parse(raw.premixes),
				savedMixes: JSON.parse(raw.savedMixes),
				_persist: JSON.parse(raw._persist),
			};
			setData(parsed);
			setOldMixesDetected(true);
			isOpen.set(true);
		} catch (e) {
			console.error("Failed to parse persisted data:", e);
		}
	}, []);

	const handleDelete = () => {
		try {
			localStorage.removeItem("persist:root");

			isOpen.set(false);
			setOldMixesDetected(false);
		} catch (error) {
			console.error("Delete failed:", error);
		}
	};

	const handleMigrate = () => {
		const result = migrateOldMixes(data);
		setMigrationResult(result);
		localStorage.removeItem("persist:root");
		setOldMixesDetected(false);
		isOpen.set(false);
	};

	return (
		<>
			<Dialog modal open={oldMixesDetected && open}>
				<DialogContent className="card w-[calc(100vw-3rem)] max-w-md mx-auto preset-filled-surface-50-950 preset-outlined-primary-50-950 rounded-xl">
					<DialogHeader className="space-y-3">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
								<AlertTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
							</div>
							<div>
								<DialogTitle className="text-lg font-semibold text-left">Migration</DialogTitle>
								<DialogDescription className="text-sm text-muted-foreground text-left">
									Old mixes/pre-mixes detected
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							We've found some old mixes from old shady community site. Please choose how you'd like
							to proceed:
						</p>

						<div className="space-y-3">
							<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mt-0.5">
									<ArrowRightIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</div>
								<div className="flex-1 space-y-1">
									<p className="font-medium text-sm">Migrate (Recommended)</p>
									<p className="text-xs text-muted-foreground">
										Convert old mixes to the new format and remove the old ones
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/20 mt-0.5">
									<DatabaseIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
								</div>
								<div className="flex-1 space-y-1">
									<p className="font-medium text-sm">Do Nothing (Not Recommended)</p>
									<p className="text-xs text-muted-foreground">
										Don't remove old mixes and do not migrate (old mixes will not work)
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mt-0.5">
									<Trash2Icon className="h-4 w-4 text-red-600 dark:text-red-400" />
								</div>
								<div className="flex-1 space-y-1">
									<p className="font-medium text-sm">Delete</p>
									<p className="text-xs text-muted-foreground">
										Permanently remove old mixes (cannot be undone)
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
						<Button
							variant="tonal"
							onClick={() => {
								isOpen.set(false);
							}}
							className="sm:w-auto"
						>
							Do Nothing
						</Button>
						<Button variant="tonal-error" onClick={handleDelete} className="sm:w-auto">
							Delete
						</Button>
						<Button variant="tonal-success" onClick={handleMigrate} className="sm:w-auto">
							Migrate
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog modal open={!!migrationResult}>
				<DialogContent className="card w-[calc(100vw-3rem)] max-w-md mx-auto preset-filled-surface-50-950 preset-outlined-primary-50-950 rounded-xl">
					<DialogHeader>
						<DialogTitle className="text-left">Migration Summary</DialogTitle>
						<DialogDescription className="text-left">{migrationResult?.summary}</DialogDescription>
					</DialogHeader>

					<div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto text-sm">
						{migrationResult && migrationResult.success.length > 0 && (
							<div>
								<p className="font-semibold text-green-600 dark:text-green-400">Succeeded:</p>
								<ul className="list-disc list-inside">
									{migrationResult.success.map((name) => (
										<li key={name}>{name}</li>
									))}
								</ul>
							</div>
						)}

						{migrationResult && migrationResult.failed.length > 0 && (
							<div>
								<p className="font-semibold text-red-600 dark:text-red-400">Failed:</p>
								<ul className="list-disc list-inside">
									{migrationResult.failed.map((fail) => (
										<li key={fail.name}>
											<strong>{fail.name}</strong>: {fail.error}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<div className="flex justify-end pt-4">
						<Button onClick={() => setMigrationResult(null)}>Close</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
