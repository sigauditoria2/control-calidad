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

// Modificar el esquema para manejar múltiples responsables
const formSchema = z.object({
    contacts: z.array(z.object({
        userId: z.string().optional(),
        name: z.string().min(2),
        role: z.string(),
        code: z.string(),
        function: z.string()
    })).length(4)
});

export function FormContact({ setOpen, orderId, onCompleted }: FormContactProps) {
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Array<any>>([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contacts: Array(4).fill({
                userId: "",
                name: "",
                role: "",
                code: "",
                function: ""
            })
        }
    });



        // Función mejorada para buscar usuario
        const searchUser = async (name: string, index: number) => {
            if (name.length < 2) return; // Solo buscar si hay al menos 2 caracteres
    
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
                    form.setValue(`contacts.${index}.function`, user.function);
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
        form.setValue(`contacts.${selectedRowIndex}.function`, user.function);
        setShowSearchModal(false);
    };

    return (
        <DialogContent className="sm:max-w-[1000px]" onPointerDownOutside={e => e.preventDefault()}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Función</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {form.watch('contacts').map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <FormField
                                                control={form.control}
                                                name={`contacts.${index}.name`}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            searchUser(e.target.value, index);
                                                        }}
                                                        placeholder="Buscar usuario..."
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
                                            name={`contacts.${index}.function`}
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

            {showSearchModal && (
                <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
                    <DialogContent onPointerDownOutside={e => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Seleccionar Usuario</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Función</TableHead>
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
                                            <TableCell>{user.function}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </DialogContent>
    );
}