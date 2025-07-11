// import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request) {
	// const supabase = await createClient();

	// Get ingredients with recipe data
	// const { data: ingredients, error: ingredientsError } = await supabase
	// 	.from("ingredients")
	// 	.select(`
	//         *,
	//         recipe:ingredient_recipes!parent_ingredient_id(*)
	//     `)
	// 	.order("name");

	// if (ingredientsError) {
	// 	return new Response(JSON.stringify(ingredientsError.message), {
	// 		status: 500,
	// 		headers: { "Content-Type": "application/json" },
	// 	});
	// }

	// // Process each ingredient to get the appropriate market data
	// const enrichedIngredients = await Promise.all(
	// 	ingredients.map(async (ingredient) => {
	// 		if (ingredient.is_custom && ingredient.recipe && ingredient.recipe.length > 0) {
	// 			// For custom ingredients: get sell_prices and demand from first recipe ingredient, but no purchases
	// 			const firstRecipeIngredient = ingredient.recipe.sort(
	// 				(a, b) => a.order_index - b.order_index,
	// 			)[0];
	// 			const baseIngredientId = firstRecipeIngredient.child_ingredient_id;

	// 			// Get only sell prices and demand for custom ingredients (no purchases since they're crafted)
	// 			const [sellPricesResult, demandResult] = await Promise.all([
	// 				supabase
	// 					.from("ingredient_sell_prices")
	// 					.select("*")
	// 					.eq("ingredient_id", baseIngredientId)
	// 					.single(),
	// 				supabase.from("ingredient_demand").select("*").eq("ingredient_id", baseIngredientId),
	// 			]);

	// 			return {
	// 				...ingredient,
	// 				sell_prices: sellPricesResult.data,
	// 				purchases: [], // Custom ingredients have no purchases - they're crafted
	// 				demand: demandResult.data || [],
	// 			};
	// 		}
	// 		// For non-custom ingredients, get all their market data including purchases
	// 		const [sellPricesResult, purchasesResult, demandResult] = await Promise.all([
	// 			supabase
	// 				.from("ingredient_sell_prices")
	// 				.select("*")
	// 				.eq("ingredient_id", ingredient.id)
	// 				.single(),
	// 			supabase.from("ingredient_purchases").select("*").eq("ingredient_id", ingredient.id),
	// 			supabase.from("ingredient_demand").select("*").eq("ingredient_id", ingredient.id),
	// 		]);

	// 		return {
	// 			...ingredient,
	// 			sell_prices: sellPricesResult.data,
	// 			purchases: purchasesResult.data || [],
	// 			demand: demandResult.data || [],
	// 		};
	// 	}),
	// );

	// // Get counts for each related table
	// const { count: totalIngredients, error: countError } = await supabase
	// 	.from("ingredients")
	// 	.select("*", { count: "exact", head: true });

	// const { count: totalPurchases, error: purchasesCountError } = await supabase
	// 	.from("ingredient_purchases")
	// 	.select("*", { count: "exact", head: true });

	// const { count: totalDemand, error: demandCountError } = await supabase
	// 	.from("ingredient_demand")
	// 	.select("*", { count: "exact", head: true });

	// // Check for any count errors
	// if (countError || purchasesCountError || demandCountError) {
	// 	return new Response(JSON.stringify("Error fetching counts"), {
	// 		status: 500,
	// 		headers: { "Content-Type": "application/json" },
	// 	});
	// }

	return new Response(
		JSON.stringify({
			success: true,
			ingredients: [],
			counts: {
				ingredients: 0 || 0,
				purchases: 0 || 0,
				demand: 0 || 0,
			},
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
}
