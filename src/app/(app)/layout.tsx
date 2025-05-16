import MenuDrawer from "@/components/layout/menuDrawer";
import MenuHeader from "@/components/layout/menuHeader";
import { createClient } from "@/lib/supabase/server";
export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user?.id ?? "")
		.single();
	return (
		<>
			{/* MenuHeader */}
			<MenuHeader />
			<div className="grid grid-cols-[auto_1fr_auto]">
				{/* <!-- Sidebar (Left) --> */}
				<MenuDrawer serverProfile={profile} />

				{/* <!-- Main --> */}
				<main className="space-y-4 p-4 overflow-hidden">{children}</main>
			</div>
		</>
	);
}
