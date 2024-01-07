import "@/styles/admin.css";
import { useUser } from '@/store/UserStore'
import { Avatar, Separator, Strong, Text } from '@radix-ui/themes';
import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import type { MenuProps } from 'antd';
import { ConfigProvider, Menu } from 'antd';
import { useRouter } from 'next-nprogress-bar';
import NextTopLoader from 'nextjs-toploader';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
    disabled?: boolean
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}
export const Searchbar = () => {
    return (<div className="search_outer">
        <div className="search_innner px-2">
            <div className="icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"></path>
                </svg>
            </div>
            <input type="text" placeholder='Search....' />
        </div>
        <Separator my="0" size="4" />
    </div>
    )
}
const SideBar = ({ children, activeKey = 'sub1', subkey = 'sub1' }: { children: React.ReactNode; activeKey?: string; subkey?: string }) => {
    const u = useUser();
    const user = u.user;
    const router = useRouter();
    const items: MenuProps['items'] = [
        getItem('Dashboard', '/admin/dashboard',
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75024 19.2502H17.2502C18.3548 19.2502 19.2502 18.3548 19.2502 17.2502V8.18322C19.2502 7.89772 19.1891 7.61553 19.071 7.35561L18.5332 6.17239C18.2086 5.45841 17.4967 5 16.7124 5H7.28807C6.50378 5 5.79188 5.45841 5.46734 6.1724L4.92951 7.35561C4.81137 7.61553 4.75024 7.89772 4.75024 8.18322V17.2502C4.75024 18.3548 5.64568 19.2502 6.75024 19.2502Z"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 7.75C9.5 8.99264 8.5 10.25 7 10.25C5.5 10.25 4.75 8.99264 4.75 7.75"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 7.75C19.25 8.99264 18.5 10.25 17 10.25C15.5 10.25 14.5 8.99264 14.5 7.75"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 7.75C14.5 8.99264 13.5 10.25 12 10.25C10.5 10.25 9.5 8.99264 9.5 7.75"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.74963 15.7493C9.74963 14.6447 10.6451 13.7493 11.7496 13.7493H12.2496C13.3542 13.7493 14.2496 14.6447 14.2496 15.7493V19.2493H9.74963V15.7493Z"></path>
            </svg>
        ),

        getItem('Customers', 'sub2',
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.8475 19.25H17.1525C18.2944 19.25 19.174 18.2681 18.6408 17.2584C17.8563 15.7731 16.068 14 12 14C7.93201 14 6.14367 15.7731 5.35924 17.2584C4.82597 18.2681 5.70558 19.25 6.8475 19.25Z"></path>
            </svg>,
            [
                getItem('View Customers', '/admin/customers/'),
                getItem('Customer Query', '/admin/customers/query'),
            ]
        ),

        getItem('Orders', 'sub3',
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5843 17.662L18.25 9.75H5.75L7.41569 17.662C7.61053 18.5875 8.42701 19.25 9.37279 19.25H14.6272C15.573 19.25 16.3895 18.5875 16.5843 17.662Z"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.75 9.5V7.75C8.75 6.09315 10.0931 4.75 11.75 4.75H12.25C13.9069 4.75 15.25 6.09315 15.25 7.75V9.5"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 9.75H4.75"></path>
            </svg>
        ),

        getItem('Payments', 'sub4',
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 8.75H11.375C10.4775 8.75 9.75 9.47754 9.75 10.375V10.375C9.75 11.2725 10.4775 12 11.375 12H12.625C13.5225 12 14.25 12.7275 14.25 13.625V13.625C14.25 14.5225 13.5225 15.25 12.625 15.25H9.75"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7.75V8.25"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15.75V16.25"></path>
            </svg>
        ),

        getItem('Configurations', 'sub5',
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 8H7.25"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.75 8H19.25"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 16H12.25"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.75 16H19.25"></path>
                <circle cx="10" cy="8" r="2.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
                <circle cx="15" cy="16" r="2.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
            </svg>,
            [
                getItem('Manage Categories', '/admin/manage/categories'),
                getItem('Manage Products', '/admin/manage/products'),
                getItem('Manage Brands', '/admin/manage/brands'),
                getItem('Manage Tags', '/admin/manage/tags'),
                getItem('Manage Blogs', '/admin/manage/blogs'),
                getItem('Manage Users', '/admin/manage/users'),
                getItem('Manage Settings', '/admin/manage/settings'),
            ]
        ),
    ];
    return (
        <div className='Sidebar'>
            <div className="flex h-screen bg-white">
                {/* Sidebar */}

                <div className="flex flex-col p-2">
                    <div className="flex px-4 my-3">
                        <Avatar src={user?.user_metadata?.picture} size="4" radius='full' fallback />
                        <div className="flex flex-col ml-2">
                            <Text size='4' className='capitalize font-poppin'>{user?.user_metadata?.full_name}</Text>
                            <Text size='2' className='lowercase font-poppin'>{user?.user_metadata?.email}</Text>
                        </div>
                    </div>
                    <ConfigProvider
                        theme={{
                            components: {
                                Menu: {
                                    itemHoverBg: '#f4f5f7',
                                    itemActiveBg: 'var(--irsi-10)',
                                }
                            }
                        }}
                    >
                        <Menu
                            style={{
                                width: 256,
                            }}
                            onClick={(e) => {
                                router.push(e.key.toString());
                            }}
                            defaultSelectedKeys={[activeKey ?? '/admin/dashboard']}
                            defaultOpenKeys={[subkey ?? '/admin/dashboard']}
                            mode="inline"
                            items={items}
                        />

                    </ConfigProvider>
                </div>
                {/* // Main */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Main Content */}
                    <div className="w-full px-0 py-3">
                        {children}
                    </div>
                </div>
            </div >
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
        </div >
    )
}

export default SideBar