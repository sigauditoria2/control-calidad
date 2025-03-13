"use client";

import { dataGeneralSidebar, dataSupportSideBar, dataToolsSidebar } from "./SidebarRoutes.data"
import { SiderbarItem } from "../SidebarItem"
import { Separator } from "@radix-ui/react-separator"
import { Button } from "@/components/ui/button"

interface SidebarRoutesProps {
    isCollapsed: boolean;
}

export default function SidebarRoutes({ isCollapsed }: SidebarRoutesProps) {
    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <div className="p-2">
                    {!isCollapsed && <p className="text-slate-500 dark:text-slate-400 mb-2 text-xs font-medium">General</p>}
                    {dataGeneralSidebar.map((item) => (
                        <SiderbarItem key={item.label} item={item} isCollapsed={isCollapsed} />
                    ))}
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-700" />

                <div className="p-2">
                    {!isCollapsed && <p className="text-slate-500 dark:text-slate-400 mb-2 text-xs font-medium">Análisis</p>}
                    {dataToolsSidebar.map((item) => (
                        <SiderbarItem key={item.label} item={item} isCollapsed={isCollapsed} />
                    ))}
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-700" />

                <div className="p-2">
                    {!isCollapsed && <p className="text-slate-500 dark:text-slate-400 mb-2 text-xs font-medium">Soporte</p>}
                    {dataSupportSideBar.map((item) => (
                        <SiderbarItem key={item.label} item={item} isCollapsed={isCollapsed} />
                    ))}
                </div>
            </div>

            {!isCollapsed && (
                <div>
                    <div className="text-center p-3">
                        <Button variant="outline" className="w-full text-xs dark:text-white dark:hover:bg-slate-700">
                            Contacto
                        </Button>
                    </div>

                    <Separator className="bg-slate-200 dark:bg-slate-700" />

                    <footer className="mt-3 p-3 text-center text-xs text-slate-500 dark:text-slate-400">
                        2025. SIG
                    </footer>
                </div>
            )}
        </div>
    )
}