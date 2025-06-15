import DDS2MenuDrawer from "@/components/dds2/dds2MenuDrawer";
import MenuHeader from "@/components/layout/menuHeader";
export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* MenuHeader */}
			<MenuHeader />
			<div className="grid grid-cols-[auto_1fr_auto]">
				{/* <!-- Sidebar (Left) --> */}
				<DDS2MenuDrawer />

				{/* <!-- Main --> */}
				<main className="space-y-4 p-4 overflow-hidden">{children}</main>
			</div>
		</>
	);
}
