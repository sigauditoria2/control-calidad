"use client"

import { Logo } from "@/components/Logo";
import SidebarRoutes from "../SidebarRoutes/SidebarRoutes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
    onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ onToggle }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        onToggle?.(isCollapsed);
    }, [isCollapsed, onToggle]);

    return (
        <div className="relative h-full border-r border-slate-200 dark:border-slate-700 bg-background">
            <div className={`h-full flex flex-col overflow-y-auto ${isCollapsed ? "w-[60px]" : "w-[200px]"} transition-all duration-300`}>
                <div className="flex items-center justify-between p-2">
                    {!isCollapsed && <Logo />}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto text-slate-700 dark:text-slate-200 hover:bg-slate-300/20 dark:hover:bg-slate-700/50" 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
                <SidebarRoutes isCollapsed={isCollapsed} />
            </div>
        </div>
    );
}