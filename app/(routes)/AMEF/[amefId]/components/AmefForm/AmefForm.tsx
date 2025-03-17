"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"



import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AmefFormsProps } from "./AmefForm.types"

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
import { amefFormSchema } from "./AmefForm.form"
import { Separator } from "@radix-ui/react-select"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"


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

interface CatalogItem {
    id: string;
    descripcion: string;
}

type CatalogField = "modoFallo" | "efecto" | "causaModoFallo" | "medidasEnsayo" | "accionImplementada";

interface ModoFallo {
    id: string;
    modoFallo: string;
    codigo: string;
    efecto: string;
    causaModoFallo: string;
    ocurrencia: string;
    gravedad: string;
    deteccion: string;
    npr: string;
    estadoNPR: string;
}

export function AmefForm(props: AmefFormsProps) {
    const { amef } = props
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState<CatalogField>("modoFallo")
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([])
    const [newItem, setNewItem] = useState("")
    const [loading, setLoading] = useState(false)
    const [modosFallo, setModosFallo] = useState<ModoFallo[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredModosFallo, setFilteredModosFallo] = useState<ModoFallo[]>([])

    const form = useForm<z.infer<typeof amefFormSchema>>({
        resolver: zodResolver(amefFormSchema),
        defaultValues: {
            order: amef.order,
            procesoProduccion: amef.procesoProduccion,
            especificacionProceso: amef.especificacionProceso,
            fig: amef.fig,
            proyecto: amef.proyecto,
            cliente: amef.cliente,
            elemento: amef.elemento,
            fechaDeteccion: amef.fechaDeteccion,
            nivelInspeccion: amef.nivelInspeccion,
            planMuestra: amef.planMuestra,
            modoFallo: amef.modoFallo,
            efecto: amef.efecto,
            causaModoFallo: amef.causaModoFallo,
            medidasEnsayo: amef.medidasEnsayo,
            ocurrencia: amef.ocurrencia,
            gravedad: amef.gravedad,
            deteccion: amef.deteccion,
            npr: amef.npr,
            estadoNPR: amef.estadoNPR,
            codigoColaboradorCT: amef.codigoColaboradorCT,
            codigoResponsableInspeccion: amef.codigoResponsableInspeccion,
            accionImplementada: amef.accionImplementada,
            fechaValidacionCorreccion: amef.fechaValidacionCorreccion,
            costoReproceso: amef.costoReproceso
        }
    })

    const onSubmit = async (values: z.infer<typeof amefFormSchema>) => {
        try {
            await axios.patch(`/api/amef/${amef.id}`, values)
            toast({
                title: "Registro actualizado en AMEF"
            })
            router.refresh()
            router.push("/AMEF")
            router.refresh()
        } catch (error) {
            toast({
                title: "Error al actualizar los registros",
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

    // Función para cargar los modos de fallo
    const loadModosFallo = async () => {
        try {
            const response = await axios.get('/api/modofalla/all', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            setModosFallo(response.data);
            setFilteredModosFallo(response.data);
        } catch (error) {
            console.error('Error cargando modos de fallo:', error);
            toast({
                title: "Error al cargar modos de fallo",
                variant: "destructive"
            });
        }
    };

    // Cargar modos de fallo al inicio
    useEffect(() => {
        loadModosFallo();
    }, []);

    // Filtrar modos de fallo cuando cambia el término de búsqueda
    useEffect(() => {
        const filtered = modosFallo.filter(modo => 
            modo.modoFallo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredModosFallo(filtered);
    }, [searchTerm, modosFallo]);

    // Función para seleccionar un modo de fallo
    const selectModoFallo = (modo: ModoFallo) => {
        form.setValue("modoFallo", modo.modoFallo);
        form.setValue("efecto", modo.efecto);
        form.setValue("causaModoFallo", modo.causaModoFallo);
        form.setValue("ocurrencia", modo.ocurrencia);
        form.setValue("gravedad", modo.gravedad);
        form.setValue("deteccion", modo.deteccion);
        setShowModal(false);
    };

    // Modificar la función que abre el modal de modo de fallo
    const openModoFalloModal = async () => {
        setModalType("modoFallo");
        await loadModosFallo(); // Recargar datos antes de mostrar el modal
        setShowModal(true);
    };

    // Función para abrir el modal con el tipo correspondiente
    const openModal = async (type: CatalogField) => {
        setModalType(type)
        setLoading(true)
        try {
            const response = await axios.get(`/api/catalog/${type}`)
            setCatalogItems(response.data)
        } catch (error) {
            toast({
                title: "Error al cargar el catálogo",
                variant: "destructive"
            })
        }
        setLoading(false)
        setShowModal(true)
    }

    // Función para crear nuevo item en el catálogo
    const createCatalogItem = async (type: CatalogField, descripcion: string) => {
        if (!descripcion.trim()) {
            toast({
                title: "Error",
                description: "La descripción no puede estar vacía",
                variant: "destructive"
            })
            return
        }

        try {
            const response = await axios.post(`/api/catalog/${type}`, { descripcion })
            setCatalogItems([...catalogItems, { id: response.data.id, descripcion }])
            form.setValue(type, descripcion)
            setShowModal(false)
            toast({ title: "Item creado exitosamente" })
        } catch (error: any) {
            console.error("Error al crear item:", error)
            toast({
                title: "Error al crear el item",
                description: error.response?.data || "Error desconocido",
                variant: "destructive"
            })
        }
    }

    // Cargar responsables al inicio
    useEffect(() => {
        const loadResponsables = async () => {
            try {
                const response = await axios.get(`/api/order/contacts/${amef.order}`);
                const contacts = response.data;
                console.log("Contactos cargados:", contacts); // Para debugging

                const areaResponsable = contacts.find((c: { function: string }) =>
                    c.function.toLowerCase() === "responsable del área inspeccionada"
                );
                const inspectorResponsable = contacts.find((c: { function: string }) =>
                    c.function.toLowerCase() === "responsable de inspeccionar"
                );

                if (areaResponsable) {
                    form.setValue("codigoColaboradorCT", areaResponsable.name);
                }
                if (inspectorResponsable) {
                    form.setValue("codigoResponsableInspeccion", inspectorResponsable.name);
                }
            } catch (error) {
                console.error("Error cargando responsables:", error);
                toast({
                    title: "Error al cargar responsables",
                    description: "No se pudieron cargar los responsables",
                    variant: "destructive"
                });
            }
        };

        if (amef.order) {
            loadResponsables();
        }
    }, [amef.order, form]);

    return (
        <>
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
                        {/* ESPECIFICACIÓN PROCESO PRODUCCION */}
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


                        {/* FIG */}
                        <FormField
                            control={form.control}
                            name="fig"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fig / Orden de fabricación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="FIG" type="text" readOnly {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Proyecto*/}
                        <FormField
                            control={form.control}
                            name="proyecto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proyecto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="XXXXXXXXXX" type="text" readOnly {...field} />
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
                                        <Input placeholder="Ej: SEDEMI" type="text" readOnly {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* ELEMENTO */}
                        <FormField
                            control={form.control}
                            name="elemento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Elemento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: 1234" type="number" readOnly {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* FECHA DETECCION */}
                        <FormField
                            control={form.control}
                            name="fechaDeteccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha Detección</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Fecha de detecccion" type="date" readOnly {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/*NIVEL  INSPECCION*/}
                        <FormField
                            control={form.control}
                            name="nivelInspeccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan de Inspección</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Actualice el plan de Inspección" />
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

                        {/* CODIGO COLABORADOR CT */}
                        <FormField
                            control={form.control}
                            name="codigoColaboradorCT"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsable del área inspeccionada</FormLabel>
                                    <FormControl>
                                        <Input readOnly {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CODIGO RESPONSABLE INSPECCION */}
                        <FormField
                            control={form.control}
                            name="codigoResponsableInspeccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsable de inspección</FormLabel>
                                    <FormControl>
                                        <Input readOnly {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator className="col-span-2" />
                        <h2 className="col-span-2 text-lg font-semibold">Completar los registros AMEF</h2>

                        {/* MODO DE FALLO */}
                        <FormField
                            control={form.control}
                            name="modoFallo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modo de Fallo</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input readOnly {...field} />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={openModoFalloModal}
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* EFECTO */}
                        <FormField
                            control={form.control}
                            name="efecto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Efecto</FormLabel>
                                    <FormControl>
                                        <Input readOnly {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* CAUSA MODO FALLO */}
                        <FormField
                            control={form.control}
                            name="causaModoFallo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Causa Modo de Fallo</FormLabel>
                                    <FormControl>
                                        <Input readOnly {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* MEDIDAS DE ENSAYO */}
                        <FormField
                            control={form.control}
                            name="medidasEnsayo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medidas de Ensayo</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input placeholder="Medidas de ensayo" type="text" {...field} />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openModal("medidasEnsayo" as CatalogField)}
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />


                        {/* OCURRENCIA */}
                        <FormField
                            control={form.control}
                            name="ocurrencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ocurrencia (1-10)</FormLabel>
                                    <FormControl>
                                        <Input
                                            readOnly
                                            {...field}
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
                                    <FormLabel>Gravedad (1-10)</FormLabel>
                                    <FormControl>
                                        <Input
                                            readOnly
                                            {...field}
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
                                    <FormLabel>Detección (1-10)</FormLabel>
                                    <FormControl>
                                        <Input
                                            readOnly
                                            {...field}
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
                                    <FormLabel>NPR</FormLabel>
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



                        {/* ACCION IMPLEMENTADA */}
                        <FormField
                            control={form.control}
                            name="accionImplementada"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acción Implementada</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input placeholder="Acción Implementada" type="text" {...field} />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openModal("accionImplementada" as CatalogField)}
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* FECHA VALIDACION CORRECCION */}
                        <FormField
                            control={form.control}
                            name="fechaValidacionCorreccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha Validación Corrección</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Fecha Validación Corrección" type="date" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* COSTO REPROCESO */}
                        <FormField
                            control={form.control}
                            name="costoReproceso"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Costo Reproceso</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Costo Reproceso" type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                    </div>
                    <Button type="submit">Completar registro</Button>

                </form>
            </Form>

            {/* Modal de búsqueda de Modos de Fallo */}
            {showModal && modalType === "modoFallo" && (
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Seleccionar Modo de Fallo</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                placeholder="Buscar modo de fallo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="max-h-[300px] overflow-y-auto">
                                {filteredModosFallo.map((modo) => (
                                    <div
                                        key={modo.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                                        onClick={() => selectModoFallo(modo)}
                                    >
                                        <div className="font-medium">{modo.modoFallo}</div>
                                        <div className="text-sm text-gray-500">
                                            Código: {modo.codigo}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal original para MedidasEnsayo y AccionImplementada */}
            {showModal && modalType !== "modoFallo" && (
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Seleccionar {modalType}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="max-h-[300px] overflow-y-auto">
                                {catalogItems.map((item: CatalogItem) => (
                                    <div
                                        key={item.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                                        onClick={() => {
                                            form.setValue(modalType, item.descripcion)
                                            setShowModal(false)
                                        }}
                                    >
                                        {item.descripcion}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Nuevo item..."
                                    onChange={(e) => setNewItem(e.target.value)}
                                />
                                <Button
                                    onClick={() => createCatalogItem(modalType, newItem)}
                                    type="button"
                                >
                                    <Plus className="h-4 w-4" />
                                    Crear
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}