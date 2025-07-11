import DDS2MenuDrawer from "@/components/dds2/dds2MenuDrawer";
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
				<DDS2MenuDrawer />

				{/* <!-- Main --> */}
				<PageContainer>{children}</PageContainer>
			</div>
		</>
	);
}
