"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"


import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ModoFallaFormsProps } from "./ModoFallaForm.types"

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
import { formSchema } from "./ModoFallaForm.form"



// Función para calcular el NPR y determinar el estado
function calculateNPRAndState(ocurrencia: string, gravedad: string, deteccion: string) {
    const o = parseInt(ocurrencia);
    const g = parseInt(gravedad);
    const d = parseInt(deteccion);

    // Verificar que todos los valores sean válidos
    if (isNaN(o) || isNaN(g) || isNaN(d) ||
        o < 1 || o > 10 ||
        g < 1 || g > 10 ||
        d < 1 || d > 10) {
        return { npr: "", estado: "", color: "" };
    }

    const npr = o * g * d;

    let estado = "";
    let color = "";

    if (npr >= 0 && npr <= 100) {
        estado = "Baja";
        color = "bg-green-500";
    } else if (npr >= 101 && npr <= 500) {
        estado = "Moderado";
        color = "bg-yellow-500";
    } else if (npr >= 501 && npr <= 800) {
        estado = "Muy Alta";
        color = "bg-orange-500";
    } else if (npr >= 801 && npr <= 1000) {
        estado = "Crítico";
        color = "bg-red-500";
    }

    return { npr: npr.toString(), estado, color };
}




export function ModoFallaForm(props: ModoFallaFormsProps) {
    const { modoFalla } = props
    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {

            modoFallo: modoFalla.modoFallo,
            codigo: modoFalla.codigo,
            efecto: modoFalla.efecto,
            causaModoFallo: modoFalla.causaModoFallo,
            ocurrencia: modoFalla.ocurrencia,
            gravedad: modoFalla.gravedad,
            deteccion: modoFalla.deteccion,
            npr: modoFalla.npr,
            estadoNPR: modoFalla.estadoNPR

        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/modofalla/${modoFalla.id}`, values)
            toast({
                title: "Modo de falla actualizado"
            })
            router.refresh()
            router.push("/ModosFalla")
            router.refresh()

        } catch (error) {
            toast({
                title: "Error al actualizar el modo de falla",
                variant: "destructive"
            })

        }

    }

    // Efecto para actualizar NPR y estado cuando cambien los valores
    useEffect(() => {
        const ocurrencia = form.watch("ocurrencia");
        const gravedad = form.watch("gravedad");
        const deteccion = form.watch("deteccion");

        const { npr, estado } = calculateNPRAndState(ocurrencia, gravedad, deteccion);

        form.setValue("npr", npr);
        form.setValue("estadoNPR", estado);
    }, [form.watch("ocurrencia"), form.watch("gravedad"), form.watch("deteccion")]);



    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-3">

                    {/* MODO DE FALLA */}
                    <FormField
                        control={form.control}
                        name="modoFallo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modo de Falla</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del modo de fallo" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    {/* CODIFICACIÓN */}
                    <FormField
                        control={form.control}
                        name="codigo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Codificación</FormLabel>
                                <FormControl>
                                    <Input placeholder="Codificación" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* EFECTOS */}
                    <FormField
                        control={form.control}
                        name="efecto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Efecto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del efecto" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* CAUSAS */}
                    <FormField
                        control={form.control}
                        name="causaModoFallo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Causa del Modo de Falla</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del efecto" type="text" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                        {/* OCURRENCIA */}
                        <FormField
                            control={form.control}
                            name="ocurrencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Indicador de Ocurrencia (1-10)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="1-10"
                                            type="number"
                                            min="1"
                                            max="10"
                                            {...field}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (!isNaN(value) && value >= 1 && value <= 10) {
                                                    field.onChange(e);
                                                } else {
                                                    field.onChange({ target: { value: "" } });
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'e' || e.key === '+' || e.key === '-' || e.key === '.') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* GRAVEDAD */}
                        <FormField
                            control={form.control}
                            name="gravedad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Indicardor de Gravedad (1-10)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="1-10"
                                            type="number"
                                            min="1"
                                            max="10"
                                            {...field}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (!isNaN(value) && value >= 1 && value <= 10) {
                                                    field.onChange(e);
                                                } else {
                                                    field.onChange({ target: { value: "" } });
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'e' || e.key === '+' || e.key === '-' || e.key === '.') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* DETECCION */}
                        <FormField
                            control={form.control}
                            name="deteccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Indicador de Detección (1-10)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="1-10"
                                            type="number"
                                            min="1"
                                            max="10"
                                            {...field}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (!isNaN(value) && value >= 1 && value <= 10) {
                                                    field.onChange(e);
                                                } else {
                                                    field.onChange({ target: { value: "" } });
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'e' || e.key === '+' || e.key === '-' || e.key === '.') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* NPR */}
                        <FormField
                            control={form.control}
                            name="npr"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Indicador de NPR</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            readOnly
                                            className="font-bold"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* ESTADO NPR */}
                        <FormField
                            control={form.control}
                            name="estadoNPR"
                            render={({ field }) => {
                                const ocurrencia = form.watch("ocurrencia");
                                const gravedad = form.watch("gravedad");
                                const deteccion = form.watch("deteccion");
                                const { color } = calculateNPRAndState(ocurrencia, gravedad, deteccion);

                                return (
                                    <FormItem>
                                        <FormLabel>Estado NPR</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly
                                                className={`font-bold ${color}`}
                                            />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        />


                </div>
                <Button type="submit">Actualizar Modo de Falla</Button>

            </form>
        </Form>



    )
}