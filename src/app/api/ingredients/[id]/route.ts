import { createClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const supabase = await createClient();

	// Fetch the ingredient with recipe
	const { data: ingredient, error: ingredientError } = await supabase
		.from("ingredients")
		.select(`
      *,
      recipe:ingredient_recipes!parent_ingredient_id(*)
    `)
		.eq("id", id)
		.single();

	if (ingredientError) {
		return new Response(JSON.stringify({ error: ingredientError.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (!ingredient) {
		return new Response(JSON.stringify({ error: "Ingredient not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	let enrichedIngredient: unknown;

	if (ingredient.is_custom && ingredient.recipe && ingredient.recipe.length > 0) {
		// Custom ingredient: get market data from first child ingredient
		const firstRecipeIngredient = ingredient.recipe.sort(
			(a, b) => a.order_index - b.order_index,
		)[0];
		const baseIngredientId = firstRecipeIngredient.child_ingredient_id;

		const [sellPricesResult, demandResult] = await Promise.all([
			supabase
				.from("ingredient_sell_prices")
				.select("*")
				.eq("ingredient_id", baseIngredientId)
				.single(),
			supabase.from("ingredient_demand").select("*").eq("ingredient_id", baseIngredientId),
		]);

		enrichedIngredient = {
			...ingredient,
			sell_prices: sellPricesResult.data,
			purchases: [], // No purchases for custom ingredients
			demand: demandResult.data || [],
		};
	} else {
		// Normal ingredient: fetch all market data
		const [sellPricesResult, purchasesResult, demandResult] = await Promise.all([
			supabase
				.from("ingredient_sell_prices")
				.select("*")
				.eq("ingredient_id", ingredient.id)
				.single(),
			supabase.from("ingredient_purchases").select("*").eq("ingredient_id", ingredient.id),
			supabase.from("ingredient_demand").select("*").eq("ingredient_id", ingredient.id),
		]);

		enrichedIngredient = {
			...ingredient,
			sell_prices: sellPricesResult.data,
			purchases: purchasesResult.data || [],
			demand: demandResult.data || [],
		};
	}

	return new Response(JSON.stringify({ success: true, ingredient: enrichedIngredient }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
