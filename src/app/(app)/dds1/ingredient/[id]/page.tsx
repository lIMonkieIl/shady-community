export default async function AboutIngredientPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const par = await params;
	return <span>{par.id}</span>;
}
