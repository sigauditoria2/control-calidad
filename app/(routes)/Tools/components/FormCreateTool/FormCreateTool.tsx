"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import axios from "axios"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { useRef, useState } from "react"
import { FormCreateToolProps } from "./FormCreateTools.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { title } from "process"
import { Toast } from "@/components/ui/toast"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"

import { useEffect } from "react"


const formSchema = z.object({
    name: z.string().min(2),
    responsible: z.string().min(2),
    code: z.string().min(2)
})



export function FormCreateTool(props: FormCreateToolProps) {


    //const { setOpenModalCreate} = props
    const { setOpenModalCreate, setOpen, setUserId } = props

    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            responsible: "",
            code: ""
        },
    })

    const { isValid } = form.formState

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //axios.post("/api/order", values)
            const responseTool = await axios.post("/api/tool", values);
            const userId = responseTool.data.id; // Suponiendo que el backend devuelve el ID


            toast({ title: "Instrumento Creado Correctamente" })

            // Abre el modal de responsables y pasa el ID de la orden
            setUserId(userId); // Actualiza el orderId

            router.refresh()
            setOpenModalCreate(false)

        } catch (error) {
            Toast({
                title: "Something went wrong",
                variant: "destructive"
            })

        }
    }

    return (
        <div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-3 gap-3">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Instrumento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Flexómetro" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Codigo del instrumento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: FLE0654" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="responsible"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsable del Instrumento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Nombre del Colaborador" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button type="submit" disabled={!isValid}>Registrar Instrumento</Button>
                </form>
            </Form>

        </div>
    )
}


