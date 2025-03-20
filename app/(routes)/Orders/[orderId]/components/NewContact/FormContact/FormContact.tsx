"use client"


import { fromJSON } from "postcss"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage

} from '@/components/ui/form'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import { Toast } from '@/components/ui/toast'


import axios from 'axios'
import { useParams, useRouter } from "next/navigation"
import { FormContactProps } from "./FormContact.types"
//import { formSchema } from "./FormContact.form"
import { z } from "zod"
import { FormInput, Variable, Search } from "lucide-react"
import { title } from "process"
import { toast } from "@/hooks/use-toast"



import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Title } from "@radix-ui/react-toast"
import { SelectSeparator } from "@radix-ui/react-select"

// Modificar el esquema para manejar múltiples responsables
const formSchema = z.object({
    contacts: z.array(z.object({
        userId: z.string().optional(),
        name: z.string().min(2),
        role: z.string(),
        code: z.string(),
        email: z.string(),
        //function: z.string()
    })).length(3)
});

const ROLES = {
    0: "Responsable de la Inspección",
    1: "Responsable del Área Inspeccionada",
    2: "Responsable de Aprobar la Inspección"
};

export function FormContact({ setOpen, orderId, onCompleted }: FormContactProps) {
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Array<any>>([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contacts: Array(3).fill({
                userId: "",
                name: "",
                role: "",
                code: "",
                email: "",
                //function: ""
            })
        }
    });



    // Función mejorada para buscar usuario
    const searchUser = async (name: string, index: number) => {
        if (name.length < 6) return; // Solo buscar si hay al menos 2 caracteres

        try {
            const response = await axios.get(`/api/user/search?name=${name}`);
            console.log("Respuesta de búsqueda:", response.data); // Para debugging

            if (response.data) {
                const user = response.data;
                // Actualizar todos los campos del formulario
                form.setValue(`contacts.${index}.userId`, user.id);
                form.setValue(`contacts.${index}.name`, user.name);
                form.setValue(`contacts.${index}.role`, user.rol);  // Asegúrate que coincida con el campo en la BD
                form.setValue(`contacts.${index}.code`, user.code);
                form.setValue(`contacts.${index}.email`, user.email)
                //form.setValue(`contacts.${index}.function`, user.function);
            }
        } catch (error) {
            console.error("Error en búsqueda:", error);
            toast({
                title: "Error en la búsqueda",
                description: "No se encontró el usuario",
                variant: "destructive"
            });
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            // Validar que todos los contactos tengan userId
            const allContactsValid = values.contacts.every(contact => contact.userId);
            if (!allContactsValid) {
                toast({
                    title: "Error de validación",
                    description: "Todos los contactos deben ser usuarios válidos",
                    variant: "destructive"
                });
                return;
            }

            // Registrar todos los contactos
            await Promise.all(values.contacts.map(contact =>
                axios.post(`/api/order/${orderId}/contact`, contact)
            ));

            // Obtener los datos de la orden
            const orderResponse = await axios.get(`/api/order/${orderId}`);
            const orderData = orderResponse.data;

            // Llamar al flujo de Power Automate con todos los datos
            try {
                const response = await fetch("https://prod-79.westus.logic.azure.com:443/workflows/24637c86632545419d25a08b9b6b0d69/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7wfkeNjxNE-gYqSFH6fMLXnebOkglzCMXdo3gEEz-O8", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        // Datos básicos de la orden
                        order: orderData.order,
                        estado: orderData.estado,
                        cliente: orderData.cliente,
                        proyecto: orderData.proyecto,
                        fig: orderData.fig,
                        codigoElemento: orderData.codigoElemento,
                        designacion: orderData.designacion,
                        codigoAplicable: orderData.codigoAplicable,
                        centroTrabajo: orderData.centroTrabajo,
                        qc: orderData.qc,
                        areaInspeccionada: orderData.areaInspeccionada,
                        fechaPlanificada: orderData.fechaPlanificada,

                        // Datos de los responsables
                        responsables: values.contacts.map(contact => ({
                            nombre: contact.name,
                            email: contact.email,
                            rol: contact.role
                        }))
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                toast({ title: "Datos enviados correctamente a Power Automate y SharePoint" });
            } catch (error) {
                console.error("Error en Power Automate:", error);
                toast({
                    title: "Error al enviar los datos a Power Automate",
                    description: "Los responsables se registraron pero hubo un error al enviar los datos",
                    variant: "destructive"
                });
            }

            toast({ title: "Responsables registrados exitosamente" });

            // Llamar a onCompleted antes de cerrar el modal
            if (onCompleted) {
                onCompleted();
            }
            setOpen(false);
        } catch (error) {
            console.error("Error al registrar:", error);
            toast({
                title: "Error al registrar responsables",
                description: "Por favor intente nuevamente",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para buscar todos los usuarios
    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/api/user/all');
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            toast({
                title: "Error al obtener usuarios",
                description: "Por favor intente nuevamente",
                variant: "destructive"
            });
        }
    };

    // Función para seleccionar un usuario del modal
    const selectUser = (user: any) => {
        if (typeof selectedRowIndex !== 'number') return;

        form.setValue(`contacts.${selectedRowIndex}.userId`, user.id);
        form.setValue(`contacts.${selectedRowIndex}.name`, user.name);
        form.setValue(`contacts.${selectedRowIndex}.role`, user.rol);
        form.setValue(`contacts.${selectedRowIndex}.code`, user.code);
        form.setValue(`contacts.${selectedRowIndex}.email`, user.email);
        //form.setValue(`contacts.${selectedRowIndex}.function`, user.function);
        setShowSearchModal(false);
    };

    // Función para buscar usuarios en el modal
    const handleSearch = async () => {
        try {
            setLoading(true);
            if (!searchTerm) {
                await fetchAllUsers();
            } else {
                const response = await axios.get(`/api/user/search?name=${searchTerm}`);
                setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
            }
        } catch (error) {
            console.error("Error en búsqueda:", error);
            toast({
                title: "Error en la búsqueda",
                description: "No se encontró el usuario",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[1200px]" onPointerDownOutside={e => e.preventDefault()}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Title className="text-red-500">Registro de Responsables asignados a la Inspección</Title>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {form.watch('contacts').map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-sm font-medium text-blue-600">
                                                {ROLES[index as keyof typeof ROLES]}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`contacts.${index}.name`}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Buscar usuario..."
                                                            readOnly
                                                        />
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedRowIndex(index);
                                                        setShowSearchModal(true);
                                                        fetchAllUsers();
                                                    }}
                                                >
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`contacts.${index}.role`}
                                            render={({ field }) => (
                                                <Input {...field} readOnly />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`contacts.${index}.code`}
                                            render={({ field }) => (
                                                <Input {...field} readOnly />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`contacts.${index}.email`}
                                            render={({ field }) => (
                                                <Input {...field} readOnly />
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button type="submit" className="mt-4 w-full" disabled={loading}>
                        Registrar Responsables
                    </Button>
                </form>
            </Form>

            <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
                <DialogContent className="sm:max-w-[800px]" onPointerDownOutside={e => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Seleccionar {ROLES[selectedRowIndex as keyof typeof ROLES]}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mb-4">
                        <Input
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? "Buscando..." : "Buscar"}
                        </Button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {searchResults.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => selectUser(user)}
                                    >
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.rol}</TableCell>
                                        <TableCell>{user.code}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </DialogContent>
    );
}