"use client"

import { FooterToolProps } from "./FooterTool.types";

import { useRouter } from "next/navigation";

import axios from "axios";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";




export function FooterTool(props: FooterToolProps) {
    const { toolId } = props

    const router = useRouter()

    const onDeleteTool = async () => {

        try {
            axios.delete(`/api/tool/${toolId}`)
            toast({
                title: "Instrumento Eliminado"
            })
            router.push("/Tools")
            
        } catch (error) {
            
            toast({
                title: "Errror al eliminar",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-end mt-5">
            <Button variant="destructive" onClick={onDeleteTool}>
                Eliminar Instrumento
            </Button>

        </div>

    )
}