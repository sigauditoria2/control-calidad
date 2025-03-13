"use client"


import Image from "next/image";
import { useRouter } from "next/navigation";

export function Logo() {
    const router = useRouter();
    return (
        <div className="min-h-15 h-15 flex items-center px-6 border-b cursor-pointer"
            onClick={() => router.push("/")}
        >
            <Image src="/logo.svg" alt="Logo" width={150} height={20} priority/>
            <h1 className="text-bold text-xl"></h1>

        </div>
    );
}