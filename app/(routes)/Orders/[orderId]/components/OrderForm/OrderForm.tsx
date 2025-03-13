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
            tipoInspeccion: order.tipoInspeccion,
            fechaProgramada: order.fechaProgramada,
            procesoProduccion: order.procesoProduccion,
            especificacionProceso: order.especificacionProceso,
            muestra: order.muestra,
            cliente: order.cliente,
            fig: order.fig,
            proyecto: order.proyecto,
            area: order.area,
            designacion: order.designacion,
            norma: order.norma,
            lote: order.lote,
            nivelInspeccion: order.nivelInspeccion,
            planMuestra: order.planMuestra

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
                                    <Input placeholder="Nombre de la orden" type="text"  readOnly {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* ESTADO */}
                    <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado de la Orden</FormLabel>
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

                    {/* TIPO INSPECCION*/}
                    <FormField
                        control={form.control}
                        name="tipoInspeccion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Inspección</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >

                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el tipo de Inspección" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value="En Proceso">En Proceso</SelectItem>
                                        <SelectItem value="Producto Terminado">Producto Terminado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/*NIVEL INSPECCION*/}
                    <FormField
                        control={form.control}
                        name="nivelInspeccion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nivel de Inspección</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >

                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Actualice el nivel de Inspección" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Normal">Normal</SelectItem>
                                        <SelectItem value="Estricto">Estricto</SelectItem>
                                        <SelectItem value="Reducido">Reducido</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* FECHA PROGRAMADA */}
                    <FormField
                        control={form.control}
                        name="fechaProgramada"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha Programada</FormLabel>
                                <FormControl>
                                    <Input placeholder="Fecha de registro" type="date" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* PROCESO PRODUCCION */}
                    <FormField
                        control={form.control}
                        name="procesoProduccion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proceso de Producción</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >

                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el proceso" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value="Abastecimiento">Abastecimiento</SelectItem>
                                        <SelectItem value="Torres y Apernados">Torres y Apernados</SelectItem>
                                        <SelectItem value="Armado y Soldadura">Armado y Soldadura</SelectItem>
                                        <SelectItem value="Pintura">Pintura</SelectItem>
                                        <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                                        <SelectItem value="PMC">PMC</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/*ESPECIFICACION DE  PROCESO*/}
                    <FormField
                        control={form.control}
                        name="especificacionProceso"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Especificación del Proceso</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >

                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el proceso" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value="Inspección Grating">Inspección Grating</SelectItem>
                                        <SelectItem value="Inspección Pasamanos">Inspección Pasamanos</SelectItem>
                                        <SelectItem value="Inspección Bandejas Portacables">Inspección Bandejas Portacables</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* LOTE */}
                    <FormField
                        control={form.control}
                        name="lote"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cantidad de Lote</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 1234" type="number" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/*PLAN MUESTRA*/}
                    <FormField
                        control={form.control}
                        name="planMuestra"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Plan de Muestreo</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >

                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Actualice el plan de muestra" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value="Simple">Simple</SelectItem>
                                        <SelectItem value="Doble">Doble</SelectItem>
                                        <SelectItem value="Múltiple">Múltiple</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* MUESTRA */}
                    <FormField
                        control={form.control}
                        name="muestra"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cantidad de Muestra</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 1234" type="number" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* CLIENTE */}
                    <FormField
                        control={form.control}
                        name="cliente"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: SEDEMI" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* FIG */}
                    <FormField
                        control={form.control}
                        name="fig"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fig</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: PMC00XXXX" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    {/* PROYECTO */}
                    <FormField
                        control={form.control}
                        name="proyecto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proyecto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: ASDF123" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    {/*AREA*/}
                    <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Área</FormLabel>
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
                                        <SelectItem value="PMC PRODUCCIÓN">PMC PRODUCCIÓN</SelectItem>
                                        <SelectItem value="PMC BODEGA">PMC BODEGA</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* DESIGNACION */}
                    <FormField
                        control={form.control}
                        name="designacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Desginación</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: ASDF147" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    {/* NORMA */}
                    <FormField
                        control={form.control}
                        name="norma"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Norma</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: AWS1.1" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Actualizar</Button>

            </form>
        </Form>



    )
}