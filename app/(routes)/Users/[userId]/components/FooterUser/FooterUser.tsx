"use client"

import { FooterUserProps } from "./FooterUser.types";

import { useRouter } from "next/navigation";

import axios from "axios";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";




export function FooterUser(props: FooterUserProps) {
    const { userId } = props

    const router = useRouter()

    const onDeleteOrder = async () => {

        try {
            axios.delete(`/api/user/${userId}`)
            toast({
                title: "Usuario Eliminado"
            })
            router.push("/Users")
            
        } catch (error) {
            
            toast({
                title: "Errror al eliminar",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-end mt-5">
            <Button variant="destructive" onClick={onDeleteOrder}>
                Eliminar Usuario
            </Button>

        </div>

    )
}