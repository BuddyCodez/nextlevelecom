'use client';
import { DiscordIcon, GithubIcon } from "@/components/icons";
import { Card, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Avatar, Button, Flex, Inset, Skeleton } from "@radix-ui/themes";
import { Button as NextBtn } from "@nextui-org/button";
import { TfiArrowTopRight } from "react-icons/tfi";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { ParallaxBanner, ParallaxBannerLayer } from "react-scroll-parallax";
import { Card as RedixCard, Text, Strong, Button as RadixButton } from "@radix-ui/themes";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/store/client";
import { Spin } from 'antd';
import SlidingImage from "@/components/SlidingImage";
export default function Home() {
	const [categories, setCategories] = useState<any>([]);
	const [models, setModels] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [currentModel, setCurrentModel] = useState({
		name: '',
		src: ''
	})
	async function fetchCategories() {
		await supabase.from('categories').select('*').then(({ data, error }) => {
			if (error) {
				console.error(error);
				return;
			}
			// fetch categories 
			// we also need to get image url too.
			// so we will use supabase storage to get image url.
			const NewData: any[] | ((prevState: never[]) => never[]) = [];
			data.forEach(async (cat) => {
				if (cat.image_path) {
					const imagePath = cat.image_path.replace('/web_data/', '');
					const url = await supabase.storage.from('web_data').getPublicUrl(imagePath);
					// image may contain  a /web_data twice so we need to remove it.

					NewData.push({
						...cat,
						image_path: url
					})
				} else {
					NewData.push(cat);
				}
			})
			console.log('data', NewData);
			setCategories(NewData);
		}
		);
	}
	async function fetchModels() {
		await supabase.from('models').select('*').then(({ data, error }) => {
			if (error) {
				console.error(error);
				return;
			}
			// fetch categories 
			// we also need to get image url too.
			// so we will use supabase storage to get image url.
			const NewData: any[] | ((prevState: never[]) => never[]) = [];
			data.forEach(async (cat) => {
				if (cat.image_path) {
					const imagePath = cat.image_path.replace('/web_data/', '');
					const url = await supabase.storage.from('web_data').getPublicUrl(imagePath);
					// image may contain  a /web_data twice so we need to remove it.

					NewData.push({
						...cat,
						image_path: url
					})
				} else {
					NewData.push(cat);
				}
			})
			console.log('data', NewData);
			setModels(NewData);

		}
		);
	}
	useEffect(() => {
		fetchCategories();
		fetchModels()
		setLoading(false);
		return () => {
			setCategories([]);
			setModels([]);
		}
	}, []);
	useEffect(() => {
		if (models.length) {
			setCurrentModel({
				name: models[0]?.name,
				src: models[0]?.image_path?.data?.publicUrl
			})
		}
	}, [models]);

	return (
		<section className="flex flex-col items-start justify-center gap-4 py-8 md:py-10">
			{/* // shop by Category */}
			{/* // main  */}
			<div className="Main w-full flex flex-wrap md:flex-nowrap gap-3">
				<Flex className="w-full sm:w-[100%] md:w-[50%] hero" gap="3" direction="column" justify="center" px="8">
					<h1>
						Your Signature Style Awaits
					</h1>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut assumenda mollitia minus eos beatae tempore nam, quidem rerum dignissimos quae ratione minima ex fugiat quas dolorem earum ut nobis odit.
					</p>
					<Button variant="solid" size="4" className="w-[180px] bg-black .herofont cursor-pointer" radius="full" style={{ background: "black", cursor: "pointer" }}>
						Discover More
					</Button>
					<Flex gap="2">
						<Button variant="outline" size="2" >
							<InstagramLogoIcon />
						</Button>
						<Button variant="outline" size="2" >
							<LinkedInLogoIcon />
						</Button>
						<Button variant="outline" size="2" >
							<GithubIcon />
						</Button>
						<Button variant="outline" size="2" >
							<DiscordIcon />
						</Button>
					</Flex>
				</Flex>
				<div className="w-full sm:w-[100%] md:w-[50%] flex justify-center heroContainer">
					{
						loading && currentModel ? <Skeleton className="w-[50%] h-[50vh] rounded-2xl" /> :
							<div className="heroImageWrapper flex flex-col justify-end items-start pl-10  py-5 rounded-3xl">
								<Text as="span" className="italic font-curve text-2xl font-bold" style={{
									transform: 'translate(0px, 15px)'
								}}>
									{currentModel.name}
								</Text>
								<SlidingImage
									src={currentModel.src}
									alt="Hero Image"
									width={300}
									height={250}
								/>
								<div className="absolute extraIcons">
									<Avatar src="https://media.discordapp.net/attachments/1175003341214986295/1189076763326828544/image5.png?ex=659cd908&is=658a6408&hm=beea9c176ec68106ff6ab0ce56737eddec8b32c26e1a1d222e0568be27c12c50&=&format=webp&quality=lossless&width=565&height=565" fallback="A" radius="full" highContrast variant="soft" size="5"
										onClick={() => setCurrentModel({
											name: 'current',
											src: 'https://media.discordapp.net/attachments/1175003341214986295/1189076763326828544/image5.png?ex=659cd908&is=658a6408&hm=beea9c176ec68106ff6ab0ce56737eddec8b32c26e1a1d222e0568be27c12c50&=&format=webp&quality=lossless&width=565&height=565'

										})}
									/>
									<Avatar src="https://media.discordapp.net/attachments/1175003341214986295/1189076763670741034/image6.png?ex=659cd908&is=658a6408&hm=69320bebb31270e5c6d0557444d7147e7c2ba942289ea247aed166b5e2e4d762&=&format=webp&quality=lossless&width=565&height=565" fallback="A" radius="full" highContrast variant="soft" size="5"
										onClick={() => {
											setCurrentModel({
												name: 'current',
												src: 'https://media.discordapp.net/attachments/1175003341214986295/1189076763670741034/image6.png?ex=659cd908&is=658a6408&hm=69320bebb31270e5c6d0557444d7147e7c2ba942289ea247aed166b5e2e4d762&=&format=webp&quality=lossless&width=565&height=565'
										})
									}}
									
									/>
									<NextBtn variant="solid" size="lg" radius="full" isIconOnly startContent={
										<TfiArrowTopRight color="white" />
									} style={{ background: "black", width: "64px", height: "64px" }} />


								</div>
							</div>}
				</div>
			</div>
			<div className="spacer px-14">
				<h1 className="text-lg font-bold text-black">Shop By Category</h1>
			</div>
			{!categories.length && <div className="categoryScrollWrap">
				<Spin size="large" />
			</div>}
			{categories.length && <div className="categoryScrollWrap">
				{categories?.map((item: any, index: number) => (
					<RedixCard size="2" style={{ maxWidth: 240, transition: 'transform 0.2s ease-in-out', }} className="hover:scale-[1.02] cursor-pointer">
						<Inset clip="padding-box" side="top" pb="current" >
							<img
								src={item?.image_path?.data?.publicUrl}
								alt={item?.name || 'category image'}
								className=" hover:scale-110 transition-all duration-300 ease-in-out"
								style={{
									display: 'block',
									objectFit: 'cover',
									width: '170px',
									height: '140px',
									backgroundColor: 'var(--gray-5)',
								}}
							/>
						</Inset>
						<Strong >
							{item?.name}
						</Strong>
					</RedixCard>
				))}
			</div>}
			{/* shop by Brand */}
			{/* 8*8 grid */}
			<div className="spacer px-14">
				<h1 className="text-lg font-bold text-black">Choose By Brand</h1>
			</div>
			<div className="brandWrap items-center justify-center w-full p-0">
				{Array.from([1, 2, 3, 4, 5, 6, 7, 8]).map((item, index) => (
					<div key={index}>
						<Card
							isPressable
							isHoverable
							shadow="none"
							radius="sm"
							className="cardBrand p-2 lg:w-[220px] w-[150px]"
							style={{
								background: "#e3e1e1"
							}}
						>
							<CardHeader className="flex gap-3">
								<Image
									alt="nextui logo"
									height={40}
									radius="full"
									src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
									width={40}
								/>
								<div className="flex flex-col">
									<p className="text-md">NextUI</p>
									<p className="text-small text-default-500">nextui.org</p>
								</div>
							</CardHeader>
						</Card>
					</div>
				))}
			</div>
			{/* // parallax image */}
			<ParallaxBanner style={{ aspectRatio: '4 / 2' }} >
				<ParallaxBannerLayer image="https://img.freepik.com/free-photo/sofa-living-room-decorated-with-brazilian-folklore-design_23-2150794225.jpg?t=st=1703495157~exp=1703498757~hmac=216925911e8291f09f06b5e4d780ef83c2285c67cb3c47dcb3665153ce639786&w=996" speed={-20}
					scale={[2, 1]}
					expanded
				>
					{/* // cool card  */}
					<div className="cardWrap justify-center items-center lg:justify-end p-0 lg:px-[250px]">
						<div className="card gap-4">
							<h1>Get 5% Cash Back On $200</h1>
							<small>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, laudantium magnam sequi officiis voluptatibus nobis commodi non quibusdam suscipit eligendi blanditiis officia ea earum repellat nostrum dolores minus labore itaque!</small>
							<RadixButton variant="outline" color="gray" size="1" className="cursor-pointer text-sm w-[100px]" radius="full" style={{
								cursor: "pointer",
								border: "1px solid #fff",
								color: "white"
							}}>
								Learn More
							</RadixButton>
						</div>
					</div>
				</ParallaxBannerLayer>
			</ParallaxBanner>
		</section>
	);
}
