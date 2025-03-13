"use client"

import { FooterOrderProps } from "./FooterOrder.types";

import { useRouter } from "next/navigation";

import axios from "axios";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";




export function FooterOrder(props: FooterOrderProps) {
    const { orderId } = props

    const router = useRouter()

    const onDeleteOrder = async () => {

        try {
            axios.delete(`/api/order/${orderId}`)
            toast({
                title: "Orden Eliminada"
            })
            router.push("/Orders")
            
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
                Eliminar Orden
            </Button>

        </div>

    )
}