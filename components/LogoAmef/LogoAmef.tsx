"use client"


import Image from "next/image";
import { useRouter } from "next/navigation";

export function LogoAmef() {
    const router = useRouter();
    return (
        <div className="min-h-20 h-20 flex items-center px-6 border-b cursor-pointer">
            <Image src="/logosvg.svg" alt="Logo Amef" width={1000} height={100} priority/>
            <h1 className="text-bold text-xl"></h1>
        </div>
    );
}