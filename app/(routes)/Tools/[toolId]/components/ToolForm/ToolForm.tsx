"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ToolFormsProps } from "./ToolForm.types"

import {

    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import {

    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Toast } from "@/components/ui/toast"
import { toast } from "@/hooks/use-toast"


import { UploadButton } from "@/utils/uploadthing"
import { formSchema } from "./ToolForm.form"



export function ToolForm(props: ToolFormsProps) {
    const { tool } = props
    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {

            name: tool.name,
            responsible: tool.responsible,
            code: tool.code
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/tool/${tool.id}`, values)
            toast({
                title: "Instrumento Actualizado"
            })
            router.refresh()
            router.push("/Tools")
            router.refresh()

        } catch (error) {
            toast({
                title: "Error al actualizar el registro",
                variant: "destructive"
            })

        }

    }



    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-3 gap-3">

                    {/* NAME */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Instrumento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Flexometro" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* CODE */}
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Codigo del Instrumento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: FLE1234" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    
                    {/* CODE */}
                    <FormField
                        control={form.control}
                        name="responsible"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Responsable del Instrumento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Nombre del Colaborador" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                </div>
                <Button type="submit">Actualizar Instrumento</Button>

            </form>
        </Form>



    )
}