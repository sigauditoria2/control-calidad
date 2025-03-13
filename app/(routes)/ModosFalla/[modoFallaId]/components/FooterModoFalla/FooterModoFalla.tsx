"use client"

import { FooterModoFallaProps } from "./FooterModoFalla.types";

import { useRouter } from "next/navigation";

import axios from "axios";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";




export function FooterModoFalla(props: FooterModoFallaProps) {
    const { modoFallaId } = props

    const router = useRouter()

    const onDeleteModoFalla = async () => {

        try {
            axios.delete(`/api/modofalla/${modoFallaId}`)
            toast({
                title: "Modo de fallo eliminado"
            })
            router.push("/ModosFalla")
            
        } catch (error) {
            
            toast({
                title: "Errror al eliminar",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-end mt-5">
            <Button variant="destructive" onClick={onDeleteModoFalla}>
                Eliminar Modo de Falla
            </Button>

        </div>

    )
}