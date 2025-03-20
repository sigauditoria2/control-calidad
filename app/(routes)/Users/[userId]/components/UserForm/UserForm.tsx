"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { UserFormsProps } from "./UserForm.types"

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
import { formSchema } from "./UserForm.form"



export function UserForm(props: UserFormsProps) {
    const { user } = props
    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {

            name: user.name,
            rol: user.rol,
            code: user.code,
            email: user.email
            //function: user.function,

        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/user/${user.id}`, values)
            toast({
                title: "Usuario Actualizado"
            })
            router.refresh()
            router.push("/Users")
            router.refresh()


        } catch (error) {
            toast({
                title: "Error al actualizar el usuario",
                variant: "destructive"
            })

        }

    }



    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-3">

                    {/* ORDEN */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Usuario</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del Usuario" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* ESTADO */}
                    <FormField
                        control={form.control}
                        name="rol"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Escoja del Cargo</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >

                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el cargo" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value="Analista">Analista</SelectItem>
                                        <SelectItem value="Armador">Armador</SelectItem>
                                        <SelectItem value="Asistente">Asistente</SelectItem>
                                        <SelectItem value="Auditor Externo">Auditor Externo</SelectItem>
                                        <SelectItem value="Auditor Interno">Auditor Interno</SelectItem>
                                        <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                                        <SelectItem value="Ayudante">Ayudante</SelectItem>
                                        <SelectItem value="Chofer">Chofer</SelectItem>
                                        <SelectItem value="Coordinador">Coordinador</SelectItem>
                                        <SelectItem value="Especialista">Especialista</SelectItem>
                                        <SelectItem value="Fiscalizador">Fiscalizador</SelectItem>
                                        <SelectItem value="Gerente">Gerente</SelectItem>
                                        <SelectItem value="Jefe">Jefe</SelectItem>
                                        <SelectItem value="Médico">Médico</SelectItem>
                                        <SelectItem value="Mensajero">Mensajero</SelectItem>
                                        <SelectItem value="Montador">Montador</SelectItem>
                                        <SelectItem value="Operador">Operador</SelectItem>
                                        <SelectItem value="Paramédico">Paramédico</SelectItem>
                                        <SelectItem value="Portero">Portero</SelectItem>
                                        <SelectItem value="Soldador">Soldador</SelectItem>
                                        <SelectItem value="Portero">Portero</SelectItem>
                                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                                        <SelectItem value="Supervisor Operativo">Supervisor Operativo</SelectItem>
                                        <SelectItem value="Técnico de Calidad y Procesos">Técnico de Calidad y Procesos</SelectItem>
                                        <SelectItem value="Trabajador Social">Trabajador Social</SelectItem>
                                        <SelectItem value="Otros">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* TIPO INSPECCION*/}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: controlcalidad@sedemi.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />





                    {/* LOTE */}
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Codigo de Colaborador</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 1234" type="number" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                </div>
                <Button type="submit">Actualizar Usuario</Button>

            </form>
        </Form>



    )
}