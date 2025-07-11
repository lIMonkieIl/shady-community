"use client";

import { useMixManager } from "@/hooks/useMixManager";
import { useMixesManager } from "@/hooks/useMixesManager";
import { Show, useObservable } from "@legendapp/state/react";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	CircleHelpIcon,
	PlusIcon,
	Trash2Icon,
	TriangleAlertIcon,
} from "lucide-react";
import { useState } from "react";
import { formatUSD, getInitials } from "../../lib/utils/helpers";
import { useAuth } from "../auth/authProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../shared/ui/avatar";
import { Button } from "../shared/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../shared/ui/hover-card";
import { toast } from "../toast/toast";
import MixActionIngredientsSelect from "./mixActionsIngredientsSelect";
import { ScaleMixInput } from "./mixScaleInput";
export default function CropPlannerActions() {
	const showMore = useObservable(false);
	const {
		state,
		actions: {
			resetMix,
			setRecipeDescription,
			setRecipeInformation,
			setRecipeCategory,
			setRecipeSellPrice,
			setMaxAllowedWeight,
			setRecipeImage,
			setISGangMix,
			setRecipeName,
		},
	} = useMixManager();

	const { currentMixData, errors, canSave } = state;
	const {
		actions: { addMix },
	} = useMixesManager();
	const { isAuthed } = useAuth();
	const [open, setOpen] = useState(false);
	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const {
		category,
		maxAllowedWeight,
		sellPrice,
		description,
		information,
		image,
		name,
		gang: { isGangOrder },
		recommended_sell_prices,
	} = currentMixData;

	async function saveMix() {
		// scaleToLowest();
		const { success, message } = addMix(state);
		if (!success) {
			toast({ variant: "filled-error", title: "Error", description: message });
			return;
		}
		toast({
			variant: "filled-success",
			title: "Success",
			description: `${category} successfully saved`,
		});

		await resetMix();
	}

	return (
		<div className="card w-full h-fit bg-surface-50-950/50 p-2 relative space-y-2 flex flex-col">
			<div className="flex items-center">
				<span className="h6">Actions:</span>
				{!canSave && (
					<span className="text-error-400-600/60 text-sm">Fix the validation errors</span>
				)}
			</div>
			<div className="space-y-2 p-2">
				<div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:items-center md:gap-2">
					<MixActionIngredientsSelect />

					<Button onClick={resetMix} variant="tonal-error" size="sm" className="justify-start">
						<Trash2Icon />
						Reset {category}
					</Button>
					<Show
						if={isAuthed}
						else={
							<Button
								variant="tonal-secondary"
								size="sm"
								disabled
								className="col-span-2 disabled:cursor-not-allowed justify-start"
							>
								<PlusIcon />
								Sign in to save
							</Button>
						}
					>
						<Button
							onClick={saveMix}
							variant="tonal-secondary"
							size="sm"
							disabled={!canSave}
							className="col-span-2 disabled:cursor-not-allowed justify-start"
						>
							<PlusIcon />
							Save
						</Button>
					</Show>
				</div>

				<div className="space-y-2 grid lg:grid-cols-2 gap-2">
					<div className="space-x-2 space-y-2">
						<label className="label flex-1">
							<span className="label-text capitalize">name</span>
							<input
								value={name}
								onChange={(event) => setRecipeName(event.currentTarget.value)}
								className="input"
								type="text"
								placeholder="MonkiesNut"
							/>
							{errors?.name && <p className="text-error-400-600/60 text-sm">{errors?.name}</p>}
						</label>
						<Show if={showMore}>
							<label className="label flex-1">
								<span className="label-text capitalize">description</span>
								<textarea
									value={description ?? ""}
									onChange={(event) => setRecipeDescription(event.currentTarget.value)}
									className="input"
									placeholder={"Tell users about the recipe"}
								/>
							</label>
							<label className="label flex-1">
								<span className="label-text capitalize">information</span>
								<textarea
									value={information ?? ""}
									onChange={(event) => setRecipeInformation(event.currentTarget.value)}
									className="input"
									placeholder="Give users information. example (instructions)"
								/>
							</label>
							<label className="label flex-1">
								<div className="flex space-x-1 items-center">
									<div>
										<span className="label-text capitalize">Image URL</span>
									</div>
									<HoverCard open={open2} onOpenChange={setOpen2} openDelay={10}>
										<HoverCardTrigger onClick={() => setOpen2(true)} className="cursor-help">
											<CircleHelpIcon size={18} />
										</HoverCardTrigger>
										<HoverCardContent
											side="right"
											align="start"
											className="w-50 card preset-tonal-surface border-surface-500/50 border-2 p-2"
										>
											<div className="flex flex-col">
												<span className="font-bold capitalize">information:</span>
												<span>Image must be a value image url.</span>
											</div>
										</HoverCardContent>
									</HoverCard>
								</div>
								<div className="flex space-x-2 items-end">
									<Avatar className="size-12">
										{image.length > 0 && <AvatarImage src={image} />}
										<AvatarFallback className="bg-secondary-400-600">
											{getInitials(name)}
										</AvatarFallback>
									</Avatar>
									<div className="input-group grid-cols-[auto_1fr] w-full">
										<div className="ig-cell capitalize preset-filled-primary-400-600 text-xs">
											url
										</div>
										<input
											value={image}
											onChange={(event) => setRecipeImage(event.currentTarget.value)}
											className="ig-input w-full"
											type="url"
										/>
									</div>
								</div>
							</label>
						</Show>
					</div>
					<div className="space-x-2 space-y-2">
						<label className="label flex-1">
							<div className="flex space-x-1 items-center">
								<span className="label-text capitalize">sell price</span>
								<HoverCard open={open} onOpenChange={setOpen} openDelay={10}>
									<HoverCardTrigger onClick={() => setOpen(true)} className="cursor-help">
										<CircleHelpIcon size={18} />
									</HoverCardTrigger>
									<HoverCardContent
										side="right"
										align="start"
										className="w-50 card preset-tonal-surface border-surface-500/50 border-2 p-2"
									>
										<div className="flex capitalize flex-col">
											<span className="font-bold">recommended sell price:</span>
											<span>min: {formatUSD(recommended_sell_prices?.max_price ?? 0)}</span>
											<span>Max: {formatUSD(recommended_sell_prices?.max_price ?? 0)}</span>
										</div>
									</HoverCardContent>
								</HoverCard>
							</div>
							<div className="input-group grid-cols-[auto_1fr_auto]">
								<div className="ig-cell preset-filled-primary-400-600 text-xs">$</div>
								<input
									disabled={!recommended_sell_prices}
									value={sellPrice ? sellPrice.toString() : ""}
									onChange={(event) =>
										setRecipeSellPrice(Number.parseInt(event.currentTarget.value))
									}
									className="ig-input"
									type="number"
									placeholder="10"
								/>
							</div>
						</label>
						<Show if={showMore}>
							<div className="label flex flex-col">
								<span className="label-text  capitalize">Gang Mix</span>
								<nav className="btn-group preset-outlined-surface-200-800 p-1.5 flex w-fit">
									<Button
										size={"sm"}
										variant={isGangOrder ? "filled-primary" : "tonal"}
										className={"capitalize"}
										onClick={() => setISGangMix(true)}
									>
										yes
									</Button>
									<Button
										size={"sm"}
										variant={!isGangOrder ? "filled-primary" : "tonal"}
										className={"capitalize"}
										onClick={() => setISGangMix(false)}
									>
										no
									</Button>
								</nav>
							</div>
							<div className="label flex flex-col">
								<span className="label-text  capitalize">category</span>
								<nav className="btn-group preset-outlined-surface-200-800 p-1.5 flex w-fit">
									<Button
										size={"sm"}
										variant={category === "Mix" ? "filled-primary" : "tonal"}
										className={"capitalize"}
										onClick={() => setRecipeCategory("Mix")}
									>
										Mix
									</Button>
									<Button
										size={"sm"}
										variant={category !== "Mix" ? "filled-primary" : "tonal"}
										className={"capitalize"}
										onClick={() => setRecipeCategory("Pre-mix")}
									>
										Pre-Mix
									</Button>
								</nav>
							</div>
							<ScaleMixInput />
							<label className="label flex-1">
								<div className="flex space-x-1 items-center">
									<span className="label-text capitalize">Max Weight</span>
									<HoverCard open={open1} onOpenChange={setOpen1} openDelay={10}>
										<HoverCardTrigger onClick={() => setOpen1(true)} className="cursor-help">
											<TriangleAlertIcon size={18} />
										</HoverCardTrigger>
										<HoverCardContent
											side="right"
											align="start"
											className="w-50 card preset-tonal-surface border-surface-500/50 border-2 p-2"
										>
											<div className="flex flex-col">
												<span className="capitalize font-bold">warning:</span>
												<span>
													Only change this if you are using mods that allow higher mix weight.
												</span>
											</div>
										</HoverCardContent>
									</HoverCard>
								</div>
								<div className="input-group grid-cols-[1fr_auto]">
									<input
										value={maxAllowedWeight}
										onChange={(event) =>
											setMaxAllowedWeight(Number.parseInt(event.currentTarget.value))
										}
										className="ig-input"
										type="number"
										placeholder="10"
									/>
									<div className="ig-cell preset-filled-primary-400-600 text-xs">Grams</div>
								</div>
							</label>
						</Show>
					</div>
				</div>

				<div className="flex justify-end">
					<Button
						className="btn btn-sm gap-0 pl-0 pr-1 pb-0 pt-0 capitalize font-semibold"
						unstyled
						size="sm"
						onClick={() => showMore.toggle()}
					>
						<Show
							if={showMore}
							else={
								<>
									More Options
									<ChevronDownIcon />
								</>
							}
						>
							Less Options
							<ChevronUpIcon />
						</Show>
					</Button>
				</div>
			</div>
		</div>
	);
}
