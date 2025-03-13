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
import { FormCreateUserProps } from "./FormCreateUser.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { title } from "process"
import { Toast } from "@/components/ui/toast"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"

import { useEffect } from "react"


const formSchema = z.object({
    name: z.string().min(2),
    rol: z.string().min(2),
    code: z.string().min(2),
    function: z.string().min(2)

})



export function FormCreateUser(props: FormCreateUserProps) {





    //const { setOpenModalCreate} = props
    const { setOpenModalCreate, setOpen, setUserId } = props

    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rol: "",
            code: "",
            function: ""
        },
    })

    const { isValid } = form.formState

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //axios.post("/api/order", values)
            const responseUser = await axios.post("/api/user", values);
            const userId = responseUser.data.id; // Suponiendo que el backend devuelve el ID


            toast({ title: "Usuario Creado Correctamente" })



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
                    <div className="grid grid-cols-4 gap-3">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Usuario</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: XXX" type="text" {...field} />
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
                                    <FormLabel>Codigo de Colaborador</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: 0000" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="rol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="function"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Función</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione la Función" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Responsable del área inspeccionada">Responsable del área inspeccionada</SelectItem>
                                            <SelectItem value="Responsable de asistir">Responsable de asistir</SelectItem>
                                            <SelectItem value="Responsable de inspeccionar">Responsable de inspeccionar</SelectItem>
                                            <SelectItem value="Responsable de aprobar">Responsable de aprobar</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

            

                    </div>
                    <Button type="submit" disabled={!isValid}> Registrar Usuario</Button>
                </form>
            </Form>

        </div>
    )
}


