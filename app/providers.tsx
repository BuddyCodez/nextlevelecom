"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ParallaxProvider } from 'react-scroll-parallax';
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import UserProvider from "@/store/UserStore";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { usePathname, useSearchParams } from "next/navigation";
import * as NProgress from 'nprogress';
export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}
export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	React.useEffect(() => {
		NProgress.done();
	}, [pathname, searchParams])
	return (
		<ParallaxProvider>
			<NextUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>
					<AntdRegistry>
						<UserProvider>
							{children}
						</UserProvider>
					</AntdRegistry>
				</NextThemesProvider>
			</NextUIProvider>
		</ParallaxProvider>
	);
}
