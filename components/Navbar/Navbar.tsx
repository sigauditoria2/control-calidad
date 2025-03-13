import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { Menu, Search } from "lucide-react";
import SidebarRoutes from "../SidebarRoutes/SidebarRoutes";
import { ToggleTheme } from "@/components/ToggleTheme"

export function Navbar() {
    return (
        <nav className="h-[60px] border-b bg-background px-6 flex items-center justify-between sticky top-0">
            <div className="block xl:hidden">
                <Sheet>
                    <SheetTrigger className="hover:opacity-75 transition">
                        <Menu />
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-white">
                        <SidebarRoutes isCollapsed={false} />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="relative w-[300px]">
                <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
                <Input 
                    placeholder="Buscar..." 
                    className="w-full pl-9 bg-slate-100 focus:bg-white" 
                />
            </div>

            <div className="flex items-center gap-x-4">
                <ToggleTheme />
                <UserButton afterSignOutUrl="/" />
            </div>
        </nav>
    )
}