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
import { FormCreateModoFallaProps } from "./FormCreateModoFalla.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { title } from "process"
import { Toast } from "@/components/ui/toast"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"

import { useEffect } from "react"



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


const formSchema = z.object({

    modoFallo: z.string().min(2),
    codigo: z.string().min(2),
    efecto: z.string().min(2),
    causaModoFallo: z.string().min(2),
    ocurrencia: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 1 && num <= 10;
        }, "Debe ser un número entre 1 y 10"),                  
    gravedad: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 1 && num <= 10;
        }, "Debe ser un número entre 1 y 10"),                    
    deteccion: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 1 && num <= 10;
        }, "Debe ser un número entre 1 y 10"),
    npr: z.string().min(1),
    estadoNPR: z.string().min(2)
})


export function FormCreateModoFalla(props: FormCreateModoFallaProps) {



    //const { setOpenModalCreate} = props
    const { setOpenModalCreate, setOpen, setModoFallaId } = props

    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modoFallo: "",
            codigo: "",
            efecto: "",
            causaModoFallo: "",
            ocurrencia: "",
            deteccion: "",
            gravedad: "",
            npr: "",
            estadoNPR: ""
        },
    })

    const { isValid } = form.formState

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //axios.post("/api/order", values)
            const responseModoFalla = await axios.post("/api/modofalla", values);
            const modoFallaId = responseModoFalla.data.id; // Suponiendo que el backend devuelve el ID

            toast({ title: "Modo de falla creado correctamente" })

            // Abre el modal de responsables y pasa el ID de la orden
            setModoFallaId(modoFallaId); // Actualiza el orderId
            router.refresh()
            setOpenModalCreate(false)

        } catch (error) {
            toast({
                title: "Something went wrong",
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
        <div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-4 gap-3">

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
                                    <FormLabel>Indicador de Gravedad (1-10)</FormLabel>
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
                    <Button type="submit" disabled={!isValid}> Registrar modo de falla</Button>
                </form>
            </Form>

        </div>
    )
}


