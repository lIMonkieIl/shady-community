import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ToastListener } from "../components/layout/toast-notify";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Shady Community – Drug Dealer Simulator Tools & Mixes",
	description:
		"Shady Community is your ultimate companion for Drug Dealer Simulator. Calculate mixes, plan crops, and explore community-made mixes.",
	keywords:
		"drug dealer simulator, shady community, dds calculator, drug mixes, crop planner, simulator tools, DDS2, DDS1",
	authors: [{ name: "Monkie.dev" }],
	openGraph: {
		title: "Shady Community – Drug Dealer Simulator Tools & Mixes",
		description:
			"Shady Community is your ultimate companion for Drug Dealer Simulator. Calculate mixes, plan crops, and explore community-made mixes.",
		images: ["https://shady-community-new.vercel.app/icon-512.png"],
		url: "https://shady-community-new.vercel.app/",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Shady Community – Drug Dealer Simulator Tools & Mixes",
		description:
			"Shady Community is your ultimate companion for Drug Dealer Simulator. Calculate mixes, plan crops, and explore community-made mixes.",
		images: ["https://shady-community-new.vercel.app/icon-512.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html data-decorator="hemp" data-mode="dark" data-theme="DDS" lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no"
				/>
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<div className="grid h-screen grid-rows-[auto_1fr_auto]">
					{children}
					{/* <!-- Footer --> */}
					{/* <footer className="p-4">(footer)</footer> */}
				</div>
				<Toaster position="top-right" />
				<ToastListener />
			</body>
		</html>
	);
}
