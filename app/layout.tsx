import "@/styles/globals.css";
import "@/styles/index.css";
import "@/styles/utils.css";
import '@radix-ui/themes/styles.css';
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { FontPoppins } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import { Theme } from '@radix-ui/themes';
import clsx from "clsx";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					FontPoppins.variable
				)}
			>
				<Theme appearance="light">
					<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
						<div className="relative flex flex-col h-screen">
							<Navbar />
							<main className="w-full flex-grow">
								{children}
							</main>
							<footer className="w-full flex items-center justify-center py-3">
								<Link
									isExternal
									className="flex items-center gap-1 text-current"
									href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
									title="nextui.org homepage"
								>
									<span className="text-default-600">Powered by</span>
									<p className="text-primary">NextUI</p>
								</Link>
							</footer>
						</div>
					</Providers>
				</Theme>
			</body>
		</html>
	);
}
