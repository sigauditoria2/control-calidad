"use client"

import { Navbar } from "@/components/Navbar/Navbar"
import { Sidebar } from "@/components/Sidebar/Sidebar"
import { useState } from "react"

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="h-full relative">
            <div className={`hidden md:flex h-full flex-col fixed inset-y-0 z-50 transition-all duration-200 ${isCollapsed ? 'w-[60px]' : 'w-[200px]'}`}>
                <Sidebar onToggle={setIsCollapsed} />
            </div>
            <div className={`flex-1 transition-all duration-200 ${isCollapsed ? 'md:ml-[60px]' : 'md:ml-[200px]'}`}>
                <Navbar />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}