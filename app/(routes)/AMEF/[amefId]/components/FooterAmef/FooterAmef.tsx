"use client"

import { FooterAmefProps } from "./FooterAmef.types";

import { useRouter } from "next/navigation";

import axios from "axios";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";


export function FooterAmef(props: FooterAmefProps) {
    const { amefId } = props

    const router = useRouter()

    const onDeleteRegistroAmef = async () => {

        try {
            axios.delete(`/api/amef/${amefId}`)
            toast({
                title: "Registro Eliminado de Amef"
            })
            router.push("/AMEF")
            
        } catch (error) {
            
            toast({
                title: "Errror al eliminar",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-end mt-5">
            <Button variant="destructive" onClick={onDeleteRegistroAmef}>
                Eliminar Registro de la Matriz AMEF
            </Button>

        </div>

    )
}