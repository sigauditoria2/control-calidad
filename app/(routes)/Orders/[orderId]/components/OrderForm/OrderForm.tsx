"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"



import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { OrderFormsProps } from "./OrderForm.types"

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
import { formSchema } from "./OrderForm.form"



export function OrderForm(props: OrderFormsProps) {
    const { order } = props
    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            order: order.order,
            estado: order.estado,
            cliente: order.cliente,
            proyecto: order.proyecto,
            fig: order.fig,
            codigoElemento: order.codigoElemento,
            designacion: order.designacion,
            codigoAplicable: order.codigoAplicable,
            centroTrabajo: order.centroTrabajo,
            areaInspeccionada: order.areaInspeccionada,
            fechaPlanificada: order.fechaPlanificada

        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/order/${order.id}`, values)
            toast({
                title: "Orden actualizada correctamente",
                description: "Los cambios se han guardado y sincronizado"
            });
            router.refresh()
            router.push("/Orders")
            router.refresh()

        } catch (error) {
            console.error("Error al actualizar:", error);
            toast({
                title: "Error al actualizar los registros",
                description: "Por favor, intente nuevamente",
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
                        name="order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de la Orden</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre de la orden" type="text" readOnly {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Abierto">Abierto</SelectItem>
                                        <SelectItem value="Cerrado">Cerrado</SelectItem>
                                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name="cliente"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: SEDEMI" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="proyecto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proyecto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 75XXXXX" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fig"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fig</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: PMC00XXXX" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="codigoElemento"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código del Elemento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: PMC00XXXX" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="designacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designación</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: ASDXX" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="codigoAplicable"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código Aplicable</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: CD00XXXX" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="centroTrabajo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Centro de Trabajo</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el centro de trabajo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Centro 1">Centro 1</SelectItem>
                                        <SelectItem value="Centro 2">Centro 2</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="areaInspeccionada"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Área Inspeccionada</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el área" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Area 1">Area 1</SelectItem>
                                        <SelectItem value="Area 2">Area 2</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fechaPlanificada"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-full p-2 border rounded pl-10"
                                        placeholder="Seleccione una fecha"
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                </div>
                <Button type="submit">Actualizar</Button>

            </form>
        </Form>



    )
}