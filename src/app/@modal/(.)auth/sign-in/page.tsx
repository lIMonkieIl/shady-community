"use client";
import SignInForm from "@/components/auth/form/signInForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/shared/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";

export default function SiginInPage() {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const router = useRouter();

	const handleClose = () => {
		router.back(); // Go back to the previous page
	};
	if (isDesktop) {
		return (
			<Dialog open={true} defaultOpen={true} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[425px] border-0 p-0">
					<DialogHeader hidden>
						<DialogTitle>Sigin In</DialogTitle>
					</DialogHeader>
					<SignInForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={true} defaultOpen={true} onOpenChange={handleClose}>
			<DrawerContent className="bg-surface-50-950">
				<DrawerHeader hidden className="text-left">
					<DrawerTitle>Sign in</DrawerTitle>
					<DrawerDescription>Sign in to your account</DrawerDescription>
				</DrawerHeader>
				<SignInForm />
			</DrawerContent>
		</Drawer>
	);
}
