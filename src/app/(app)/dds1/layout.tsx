import DDS1MenuDrawer from "@/components/dds1/dds1MenuDrawer";
import MenuHeader from "@/components/layout/menuHeader";
import PageContainer from "@/components/layout/pageContainer";
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
				<DDS1MenuDrawer />

				{/* <!-- Main --> */}
				<PageContainer>{children}</PageContainer>
			</div>
		</>
	);
}
