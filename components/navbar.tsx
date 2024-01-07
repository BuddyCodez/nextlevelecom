'use client';
import { useState } from "react";
import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,

} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem
} from "@nextui-org/dropdown";
import { FaChevronDown, FaGoogle, FaUser } from "react-icons/fa6";
import { FiLogOut, FiUser } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { link as linkStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import {

	SearchIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";
import { useEffect } from "react";
import { CaretDownIcon, Cross1Icon, DashboardIcon, HeartFilledIcon, PersonIcon } from "@radix-ui/react-icons";
import { Box, Dialog, Flex, Button as RadixButton, Tabs, Text, TextField, DropdownMenu as RadixDropDownMenu, } from "@radix-ui/themes";
import * as Form from '@radix-ui/react-form';

import { useUser } from "@/store/UserStore";
import { useRouter } from 'next-nprogress-bar';
import NextTopLoader from 'nextjs-toploader';
import { supabase } from "@/store/client";
import { TfiEmail } from "react-icons/tfi";
import { notification } from 'antd';
async function isAdminCheck(user: any): Promise<boolean> {
	const { data, error: e } = await supabase.from('users').select('*').eq(user?.id ? 'id' : 'email', user?.id || user?.email);
	if (e) return false;
	return data[0]?.is_admin || false;
}
export const Navbar = () => {
	const { user } = useUser();
	const [showPass, setShowPass] = useState<Boolean>(false);
	const [username, setusername] = useState<string>("");
	const [password, setpassword] = useState<string>("");
	const [email, setemail] = useState<string>("");
	const [error, seterror] = useState<any>(null);
	const [emailVerification, setemailVerification] = useState<boolean>(false);
	const [isAdmin, setAdmin] = useState<boolean>(false);
	const router = useRouter();
	const [api, contextHolder] = notification.useNotification({
		placement: 'topRight',
	});
	useEffect(() => {
		if (!user) return;
		isAdminCheck(user).then(v => {
			// console.log(v);
			setAdmin(v);
		});
		return () => {
			setAdmin(false);
		};
	}, [user]);
	const openNotification = (title: string, description: string, icon: any | null = null) => {
		api.open({
			message: title,
			description: description,
			duration: 5,
			icon
		});
	};
	const googleLogin = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/callback`,
				scopes: "email profile",
			}
		})
		if (error) return openNotification("Google Login", error.message ?? error.status, <FaGoogle />);
		if (data) {
			openNotification("Google Login", "Login Successful");
			router.refresh();
		}
		return data;
	}
	const HandleAccount = async (type: string) => {
		const notiTitle = type === 'login' ? 'Login' : 'Register';
		if (!email || !username) return openNotification(notiTitle, 'Please Fill all fields');		// password Validation
		if (password.length < 6) return openNotification(notiTitle, 'Password must be 6 characters long and must have alteast 1 special character and Capital character.');
		// email validation
		const emailRegex = /\S+@\S+\.\S+/;
		if (!emailRegex.test(email)) return openNotification(notiTitle, 'Please enter a valid email address.');
		// get user form user to check.
		if (user) return openNotification(notiTitle, 'the user is already logged in.');
		if (type == "login") {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});
			console.log(error, data);
			if (error) return openNotification(notiTitle, error?.message ?? error?.status);
			if (data) {
				router.refresh();
			}
		} else {
			const { data, error } = await supabase.auth.signUp({
				email: email,
				password: password,
				options: {
					emailRedirectTo: `${location.origin}/auth/callback`,
					data: {
						full_name: username,
						image: null
					}
				}

			})
			if (error) return openNotification(notiTitle, error.message ?? error.stack);
			if (data) {
				setemailVerification(true);
				router.refresh();
			}
		}

	}
	const signOut = async () => {
		openNotification("Logout", "Logout Successful");
		await supabase.auth.signOut().then(() => window.location.reload());
	}
	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			if (e.key === "k" && e.ctrlKey) {
				e.preventDefault();
				document.getElementById("search")?.focus();
			}
		})
	}, []);
	const searchInput = (

		<Input
			id="search"
			aria-label="Search"
			radius="full"
			width="100%"
			style={{
				borderRadius: "50px"
			}}
			classNames={{
				inputWrapper: "bg-default-100",
				input: "text-sm",

			}}
			endContent={
				<Kbd className="hidden lg:inline-block" keys={["ctrl"]}>
					K
				</Kbd>
			}
			labelPlacement="outside"
			placeholder="Search Product"
			startContent={
				<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
			}
			type="search"
		/>
	);

	return (
		<>
			{contextHolder}
			<NextUINavbar maxWidth="xl" position="sticky" isBlurred isBordered >
				<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
					<NavbarBrand as="li" className="gap-3 max-w-fit">
						<NextLink className="flex justify-start items-center gap-1" href="/">
							<Logo />
							<p className="font-bold text-inherit">{siteConfig.name}</p>
						</NextLink>
					</NavbarBrand>
					<ul className="hidden lg:flex gap-4 justify-start ml-2 items-center">
						<Dropdown>
							<NavbarItem>
								<DropdownTrigger>
									<Button
										disableRipple
										className="p-0 bg-transparent data-[hover=true]:bg-transparent items-center"
										startContent={<FaChevronDown size={16} />}
										radius="sm"
										variant="light"
									>
										Categories
									</Button>
								</DropdownTrigger>
							</NavbarItem>
							<DropdownMenu
								aria-label="ACME features"
								className="w-[340px]"
								itemClasses={{
									base: "gap-4",
								}}
							>
								<DropdownItem
									key="autoscaling"
									description="ACME scales apps to meet user demand, automagically, based on load."
									startContent={<FaChevronDown />}
								>
									Autoscaling
								</DropdownItem>
								<DropdownItem
									key="usage_metrics"
									description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
									startContent={<FaChevronDown />}
								>
									Usage Metrics
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						{siteConfig.navItems.map((item) => (
							<NavbarItem key={item.href}>
								<NextLink
									className={clsx(
										linkStyles({ color: "foreground" }),
										"data-[active=true]:text-primary data-[active=true]:font-medium"
									)}
									color="foreground"
									href={item.href}
								>
									{item.label}
								</NextLink>
							</NavbarItem>
						))}
					</ul>
				</NavbarContent>

				<NavbarContent
					className="hidden sm:flex basis-1/5 sm:basis-full justify-center"
					justify="end"
				>
					<NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
					<NavbarItem className="hidden sm:flex gap-2">
						{user ? <>
							<RadixDropDownMenu.Root>
								<RadixDropDownMenu.Trigger>
									<RadixButton variant="soft">
										<FiUser /> {user?.user_metadata.full_name}
										<CaretDownIcon />
									</RadixButton>
								</RadixDropDownMenu.Trigger>
								<RadixDropDownMenu.Content className="w-[150px]">
									<RadixDropDownMenu.Item className="flex items-center justify-between">
										Profile <PersonIcon />
									</RadixDropDownMenu.Item>
									{isAdmin && <RadixDropDownMenu.Item className="flex items-center justify-center" onClick={() => router.push('/admin/dashboard')}>
										Dashboard <DashboardIcon />
									</RadixDropDownMenu.Item>}
									<RadixDropDownMenu.Item className="flex items-center justify-center">
										WishList <HeartFilledIcon />
									</RadixDropDownMenu.Item>
									<RadixDropDownMenu.Item className="flex items-center justify-center"
										onClick={signOut}
									>
										Logout <FiLogOut />
									</RadixDropDownMenu.Item>
								</RadixDropDownMenu.Content>
							</RadixDropDownMenu.Root>
						</> : <Dialog.Root>
							<Dialog.Trigger>
								<RadixButton>
									<PersonIcon /> Account
								</RadixButton>
							</Dialog.Trigger>
							<Dialog.Content style={{ maxWidth: 450 }}>
								{/* // tab for login/signup */}
								<Dialog.Title className="flex justify-between items-center">
									Access Your Account
									<Dialog.Close>
										<Cross1Icon className="cursor-pointer" />
									</Dialog.Close>
								</Dialog.Title>
								<Dialog.Description>
									Access your account to see your orders, wishlist, and more.
								</Dialog.Description>

								{emailVerification && <Flex direction="column">
									<Text>Hey {username},</Text>
									<Text>We have just sent a email to {email}\nPlease Check Your Inbox.</Text>
									<div className="gmailIcon mt-2">
										<RadixButton color="blue" onClick={() => window.location.assign('http://gmail.com/')}>
											<TfiEmail /> Open Gmail
										</RadixButton>
									</div>
								</Flex>}
								{!emailVerification && <Flex direction="column" gap="3">
									<Tabs.Root defaultValue="login">
										<Tabs.List>
											<Tabs.Trigger value="login">Login</Tabs.Trigger>
											<Tabs.Trigger value="register">Register</Tabs.Trigger>
										</Tabs.List>
										<Box px="4" pt="3" pb="2">
											<Form.Root>
												<Tabs.Content value="login" className="py-4">
													<label >
														<Text as="div" size="2" mb="1" weight="bold">
															Email
														</Text>
														<TextField.Input
															onChange={(e) => setemail(e.target.value)}
															type="email"
															placeholder="Enter your email"
														/>
													</label>
													<label>
														<Text as="div" size="2" mb="1" weight="bold">
															Password
														</Text>
														<TextField.Root>

															<TextField.Input
																onChange={(e) => setpassword(e.target.value)}
																type={showPass ? "text" : "password"}
																placeholder="Enter your password"
															/>
															<TextField.Slot className="cursor-pointer" onClick={
																() => setShowPass(!showPass)
															}>
																{
																	showPass ? <EyeIcon /> : <EyeIcon type="close" />
																}
															</TextField.Slot>
														</TextField.Root>
													</label>
													<RadixButton className="w-full" variant="outline" color="blue" mt="2" onClick={async () => await HandleAccount("login")}>
														Login
													</RadixButton>
													<div className="flex flex-col items-center justify-center my-3">
														<h2>OR</h2>
														{/* // google Login Btn */}
														<RadixButton className="w-[120px] font-poppin" variant="ghost" color="blue" mt="2" style={{
															fontFamily: "Poppins"
														}} onClick={googleLogin}>
															<FaGoogle />
															Google Login
														</RadixButton>
													</div>
												</Tabs.Content>
											</Form.Root>

											<Tabs.Content value="register" className="py-4 flex flex-col gap-2">
												<label >
													<Text as="div" size="2" mb="1" weight="bold">
														Username
													</Text>
													<TextField.Input
														onChange={(e) => setusername(e.target.value)}
														type="text"
														placeholder="Enter your name"
													/>
												</label>
												<label >
													<Text as="div" size="2" mb="1" weight="bold">
														Email
													</Text>
													<TextField.Input
														onChange={(e) => setemail(e.target.value)}
														type="email"
														placeholder="Enter your email"
													/>
												</label>
												<label>
													<Text as="div" size="2" mb="1" weight="bold">
														Password
													</Text>
													<TextField.Root>

														<TextField.Input
															onChange={(e) => setpassword(e.target.value)}
															type={showPass ? "text" : "password"}
															placeholder="Enter your password"
														/>
														<TextField.Slot style={{
															cursor: "pointer"
														}} onClick={
															() => setShowPass(!showPass)
														}>
															{
																showPass ? <EyeIcon /> : <EyeIcon type="close" />
															}
														</TextField.Slot>
													</TextField.Root>
												</label>
												<RadixButton className="w-full" variant="outline" color="blue"
													onClick={async () => await HandleAccount("register")}
												>
													Register
												</RadixButton>
												<div className="flex flex-col items-center justify-center my-3">
													<h2>OR</h2>
													{/* // google Login Btn */}
													<RadixButton className="w-[120px] font-poppin" variant="ghost" color="blue" mt="2" style={{
														fontFamily: "Poppins"
													}} onClick={googleLogin}>
														<FaGoogle />
														Google Login
													</RadixButton>
												</div>

											</Tabs.Content>

										</Box>
									</Tabs.Root>
								</Flex>}

							</Dialog.Content>
						</Dialog.Root>}

					</NavbarItem>
					<NavbarItem className="hidden sm:flex gap-2">
						<Button radius="full"
							startContent={<FiShoppingCart />}
							variant="flat"
							style={{
								backgroundColor: "transparent",
							}}
						>
							Cart
						</Button>
					</NavbarItem>
				</NavbarContent>

				<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
					<NavbarMenuToggle />
				</NavbarContent>

				<NavbarMenu>
					{searchInput}
					<div className="mx-4 mt-2 flex flex-col gap-2">
						{siteConfig.navMenuItems.map((item, index) => (
							<NavbarMenuItem key={`${item}-${index}`}>
								<Link
									color={
										index === 2
											? "primary"
											: index === siteConfig.navMenuItems.length - 1
												? "danger"
												: "foreground"
									}
									href="#"
									size="lg"
								>
									{item.label}
								</Link>
							</NavbarMenuItem>
						))}
					</div>
				</NavbarMenu>
			</NextUINavbar >
			<NextTopLoader
				color="var(--iris-10)"
				initialPosition={0.03}
				crawlSpeed={200}
				height={3}
				crawl={true}
				showSpinner={true}
				easing="ease"
				speed={200}
				shadow="0 0 10px var(--iris-10),0 0 5px var(--iris-10)"
			/>
		</>
	);
};
interface EyeIconProps {
	type?: "open" | "close";
}
const EyeIcon: React.FC<EyeIconProps> = ({ type = "open" }) => {
	// Your component logic here
	return (
		<div className="icon cursor-pointer">
			{type === "open" ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 12C19.25 13 17.5 18.25 12 18.25C6.5 18.25 4.75 13 4.75 12C4.75 11 6.5 5.75 12 5.75C17.5 5.75 19.25 11 19.25 12Z"></path>
				<circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
			</svg>
				: <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.6247 10C19.0646 10.8986 19.25 11.6745 19.25 12C19.25 13 17.5 18.25 12 18.25C11.2686 18.25 10.6035 18.1572 10 17.9938M7 16.2686C5.36209 14.6693 4.75 12.5914 4.75 12C4.75 11 6.5 5.75 12 5.75C13.7947 5.75 15.1901 6.30902 16.2558 7.09698"></path>
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 4.75L4.75 19.25"></path>
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.409 13.591C9.53033 12.7123 9.53033 11.2877 10.409 10.409C11.2877 9.5303 12.7123 9.5303 13.591 10.409"></path>
				</svg>}
		</div>
	);
};