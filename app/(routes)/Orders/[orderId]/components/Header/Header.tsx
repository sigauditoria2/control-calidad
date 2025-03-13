
"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"


export function Header(){
    const router = useRouter()


    return(
        <div className="flex items-center text-xl">
            <ArrowLeft className="mr-2 w-5 h-5 cursor-pointer mb-5" onClick={() => router.push("/Orders")}/>
            Editar Orden
        </div>
    )
}