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
import { FormCreateOrderProps } from "./FormCreateOrder.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { title } from "process"
import { Toast } from "@/components/ui/toast"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"

import { useEffect } from "react"
import { RefreshCw } from "lucide-react"


const formSchema = z.object({
    order: z.string().min(2).refine(
        (value) => /^ODI-\d{5}$/.test(value),
        {
            message: "El código debe tener el formato ODI-XXXXX donde X son números"
        }
    ),
    estado: z.string().min(2),
    tipoInspeccion: z.string().min(2),
    fechaProgramada: z.string().min(2),
    procesoProduccion: z.string().min(2),
    especificacionProceso: z.string().min(2),
    muestra: z.string().min(1),
    cliente: z.string().min(2),
    fig: z.string().min(2),
    proyecto: z.string().min(2),
    area: z.string().min(2),
    designacion: z.string().min(2),
    norma: z.string().min(2),
    lote: z.string().min(2),
    nivelInspeccion: z.string().min(2),
    planMuestra: z.string().min(2)
})



export function FormCreateOrder({ setOpenModalCreate, setOpen, setOrderId, onOrderCreated }: FormCreateOrderProps) {
    const [loading, setLoading] = useState(false);

    {/*PARA GENERA EL NUMERO DE ORDEN */ }
    const [order, setOrderNumber] = useState("");

    // Función para incrementar manualmente el número
    const incrementOrderNumber = () => {
        try {
            const currentNumber = parseInt(order.replace('ODI-', ''));
            if (isNaN(currentNumber)) {
                throw new Error("Número de orden actual no válido");
            }
            const nextNumber = String(currentNumber + 1).padStart(5, '0');
            const fullOrder = `ODI-${nextNumber}`;
            setOrderNumber(fullOrder);
            form.setValue("order", fullOrder, { shouldValidate: true });
        } catch (error) {
            console.error("Error incrementando el número:", error);
            toast({
                title: "Error",
                description: "No se pudo incrementar el número de orden",
                variant: "destructive"
            });
        }
    };




        // Función para incrementar manualmente el número
        const decrementOrderNumber = () => {
            try {
                const currentNumber = parseInt(order.replace('ODI-', ''));
                if (isNaN(currentNumber)) {
                    throw new Error("Número de orden actual no válido");
                }
                const nextNumber = String(currentNumber - 1).padStart(5, '0');
                const fullOrder = `ODI-${nextNumber}`;
                setOrderNumber(fullOrder);
                form.setValue("order", fullOrder, { shouldValidate: true });
            } catch (error) {
                console.error("Error incrementando el número:", error);
                toast({
                    title: "Error",
                    description: "No se pudo incrementar el número de orden",
                    variant: "destructive"
                });
            }
        };






    {/*Crear una función para obtener el último número de orden*/ }
    const fetchNextOrderNumber = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/order/last", {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                // Añadir un parámetro timestamp para evitar la caché
                params: {
                    _t: new Date().getTime()
                }
            });

            if (response.data?.error) {
                throw new Error(response.data.error);
            }

            const nextNumber = response.data.number;
            if (!nextNumber || !/^\d{5}$/.test(nextNumber)) {
                throw new Error("Formato de número inválido recibido del servidor");
            }

            console.log('Número obtenido:', nextNumber, 'Total órdenes:', response.data.totalOrders);

            const fullOrder = `ODI-${nextNumber}`;
            setOrderNumber(fullOrder);
            form.setValue("order", fullOrder, { shouldValidate: true });
        } catch (error) {
            console.error("Error obteniendo el número de orden:", error);
            toast({
                title: "Error",
                description: "Error al generar el número de orden. Por favor, intente nuevamente.",
                variant: "destructive"
            });
            // Intentar obtener el número nuevamente después de un breve retraso
            setTimeout(fetchNextOrderNumber, 1000);
        } finally {
            setLoading(false);
        }
    };

    // Asegurarse de que se obtenga el número al montar el componente
    useEffect(() => {
        fetchNextOrderNumber();
    }, []);


    //const { setOpenModalCreate} = props
    // const { setOpenModalCreate, setOpen, setOrderId } = props

    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            order: "",
            estado: "",
            tipoInspeccion: "",
            fechaProgramada: "",
            procesoProduccion: "",
            especificacionProceso: "",
            muestra: "",
            cliente: "",
            fig: "",
            proyecto: "",
            area: "",
            designacion: "",
            norma: "",
            lote: "",
            nivelInspeccion: "",
            planMuestra: ""
        },
    })

    const { isValid } = form.formState

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            // Verificar que el número sea válido antes de continuar
            if (!values.order || !/^ODI-\d{5}$/.test(values.order)) {
                throw new Error("Número de orden inválido");
            }

            // Verificar nuevamente si el número existe
            const checkExists = await axios.get(`/api/order/check/${values.order}`);
            if (checkExists.data.exists) {
                toast({
                    title: "Error",
                    description: "El número de orden ya existe. Obteniendo nuevo número...",
                    variant: "destructive"
                });
                await fetchNextOrderNumber();
                return;
            }


            ////////////////////////AÑADIDO

            // Validar que el número de orden sea el siguiente en la secuencia
            const lastOrderNumber = parseInt(checkExists.data.currentHighest.replace('ODI-', ''));
            if (lastOrderNumber + 1 !== parseInt(values.order.replace('ODI-', ''))) {
                toast({
                    title: "Error",
                    description: "El número de orden debe ser el siguiente en la secuencia.",
                    variant: "destructive"
                });
                return;
            }


            const responseOrder = await axios.post("/api/order", values);
            const orderId = responseOrder.data.id;

            toast({ title: "Orden Creada Correctamente" });

            // Llamar al flujo de Power Automate
            try {
                const response = await fetch("https://prod-182.westus.logic.azure.com:443/workflows/da1509855ed8448f9701dc903e3b915b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zJinWQKzstenjkOmcUdmkZDOU7tVH38e0naJcoe4Ctc", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        order: values.order,
                        estado: values.estado,
                        tipoInspeccion: values.tipoInspeccion,
                        fechaProgramada: values.fechaProgramada,
                        procesoProduccion: values.procesoProduccion,
                        especificacionProceso: values.especificacionProceso,
                        muestra: values.muestra,
                        cliente: values.cliente,
                        proyecto: values.proyecto,
                        fig: values.fig,
                        area: values.area,
                        designacion: values.designacion,
                        norma: values.norma,
                        lote: values.lote,
                        nivelInspeccion: values.nivelInspeccion,
                        planMuestra: values.planMuestra
                    }),
                });

                if (response.ok) {
                    toast({ title: "Datos enviados correctamente a Power Automate y SharePoint" });
                }
            } catch (error) {
                console.error("Error en Power Automate:", error);
                toast({
                    title: "Error al enviar los datos a Power Automate",
                    variant: "destructive"
                });
            }

            // Notificar que la orden fue creada y pasar al siguiente paso
            if (onOrderCreated) {
                onOrderCreated(orderId);
            } else {
                setOrderId(orderId);
                setOpen(true);
                setOpenModalCreate(false);
            }

        } catch (error) {
            console.error("Error al crear la orden:", error);
            toast({
                title: "Error al crear la orden",
                description: "Por favor intente nuevamente",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <DialogContent className="sm:max-w-[1200px]" onPointerDownOutside={e => e.preventDefault()}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-4 gap-3">

                            <FormField
                                control={form.control}
                                name="order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de Orden</FormLabel>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-none">
                                                <Input
                                                    value="ODI-"
                                                    readOnly
                                                    className="w-14 bg-gray-100"
                                                />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    readOnly
                                                    value={field.value.replace('ODI-', '')}
                                                    className="flex-1"
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={fetchNextOrderNumber}
                                                disabled={loading}
                                                title="Actualizar número"
                                            >
                                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={incrementOrderNumber}
                                                title="Incrementar número"
                                            >
                                                <span className="text-lg">+</span>
                                            </Button>


                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={decrementOrderNumber}
                                                title="Reducir número"
                                            >
                                                <span className="text-lg">-</span>
                                            </Button>


                                        </div>
                                        <FormMessage />
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
                                                    <SelectValue placeholder="Seleccione el tipo" />
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
                                                    <SelectValue placeholder="Seleccione el nivel aplicado" />
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


                            <FormField
                                control={form.control}
                                name="fechaProgramada"
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
                                                <SelectItem value="Acabado Superficial">Acabado Superficial</SelectItem>
                                                <SelectItem value="PMC">PMC</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


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
                                                    <SelectValue placeholder="Seleccione la especificación" />
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
                                name="norma"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Norma Aplicable</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: ASDXX" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lote"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad de Lote</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: 0000" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                    <SelectValue placeholder="Seleccione el plan a utilizar" />
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

                            <FormField
                                control={form.control}
                                name="muestra"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Muestra</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2000" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>
                        <Button type="submit" disabled={!isValid || loading}> Siguiente </Button>
                    </form>
                </Form>
            </DialogContent>
        </div>
    )
}


