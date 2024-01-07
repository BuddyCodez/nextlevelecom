'use client';
// pages/admin/[...slug].tsx
import isAdmin from "@/middleware/admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/progress";

import "@/styles/admin.css";
import SideBar, { Searchbar } from "@/components/SideBar";
; const AdminPage = () => {
    const router = useRouter();

    return (
        <div className="wrapper">
            <SideBar activeKey="sub1" subkey="sub1">
                <Searchbar />
            </SideBar>
        </div>
    );
};

export default AdminPage;
