"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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

import { Input } from '@/components/ui/input'

import { Toast } from '@/components/ui/toast'


import axios from 'axios'
import { useParams, useRouter } from "next/navigation"
import { FormToolProps } from "./FormTool.types"
//import { formSchema } from "./FormTool.form"
import { z } from "zod"
import { FormInput, Variable, Search } from "lucide-react"
import { title } from "process"
import { toast } from "@/hooks/use-toast"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Modificar el esquema para manejar múltiples responsables
const formSchema = z.object({
    tools: z.array(z.object({
        userId: z.string().optional(),
        name: z.string().min(2),
        code: z.string(),
        responsible: z.string(),
    })).min(1).max(5)
});

export function FormTool({ setOpenTools, orderId, onCompleted }: FormToolProps) {
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Array<any>>([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tools: [{
                userId: "",
                name: "",
                code: "",
                responsible: ""
            }]
        }
    });

    const addTool = () => {
        const currentTools = form.getValues().tools;
        if (currentTools.length < 5) {
            form.setValue('tools', [...currentTools, {
                userId: "",
                name: "",
                code: "",
                responsible: ""
            }]);
        } else {
            toast({ 
                title: "Límite alcanzado", 
                description: "No se pueden agregar más de 5 instrumentos",
                variant: "destructive" 
            });
        }
    };

    const removeTool = (index: number) => {
        const currentTools = form.getValues().tools;
        if (currentTools.length > 1) {
            const newTools = currentTools.filter((_, i) => i !== index);
            form.setValue('tools', newTools);
        }
    };

    // Función mejorada para buscar instrumento
    const searchTool = async (code: string, index: number) => {
        if (code.length < 2) return;

        try {
            const response = await axios.get(`/api/tool/search?code=${code}`);
            if (response.data) {
                const tool = response.data;
                form.setValue(`tools.${index}.userId`, tool.id);
                form.setValue(`tools.${index}.name`, tool.name);
                form.setValue(`tools.${index}.code`, tool.code);
                form.setValue(`tools.${index}.responsible`, tool.responsible);
            }
        } catch (error) {
            console.error("Error en búsqueda:", error);
            toast({ 
                title: "Error en la búsqueda", 
                description: "No se encontró el instrumento",
                variant: "destructive" 
            });
        }
    };

    // Función para buscar todos los instrumentos
    const fetchAllTools = async () => {
        try {
            const response = await axios.get('/api/tool/all');
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error al obtener instrumentos:", error);
            toast({ 
                title: "Error al obtener instrumentos", 
                description: "Por favor intente nuevamente",
                variant: "destructive" 
            });
        }
    };

    // Función para seleccionar un instrumento del modal
    const selectTool = (tool: any) => {
        if (selectedRowIndex === null) return;
        
        form.setValue(`tools.${selectedRowIndex}.userId`, tool.id);
        form.setValue(`tools.${selectedRowIndex}.name`, tool.name);
        form.setValue(`tools.${selectedRowIndex}.code`, tool.code);
        form.setValue(`tools.${selectedRowIndex}.responsible`, tool.responsible);
        setShowSearchModal(false);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            
            // Validar que todos los instrumentos tengan código
            const allToolsValid = values.tools.every(tool => tool.code);
            if (!allToolsValid) {
                toast({ 
                    title: "Error de validación", 
                    description: "Todos los instrumentos deben tener un código válido",
                    variant: "destructive" 
                });
                return;
            }

            // Registrar todos los instrumentos
            await Promise.all(values.tools.map(tool => 
                axios.post(`/api/order/${orderId}/tool`, tool)
            ));
            
            toast({ title: "Instrumentos registrados exitosamente" });
            
            // Llamar a onCompleted antes de cerrar el modal
            if (onCompleted) {
                onCompleted();
            }
            setOpenTools(false);
        } catch (error) {
            console.error("Error al registrar:", error);
            toast({ 
                title: "Error al registrar instrumentos", 
                description: "Por favor intente nuevamente",
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[1000px]" onPointerDownOutside={e => e.preventDefault()}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Responsable</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {form.watch('tools').map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`tools.${index}.code`}
                                                    render={({ field }) => (
                                                        <Input 
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                searchTool(e.target.value, index);
                                                            }}
                                                            placeholder="Buscar por código..."
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
                                                        fetchAllTools();
                                                    }}
                                                >
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`tools.${index}.name`}
                                                render={({ field }) => (
                                                    <Input {...field} readOnly />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`tools.${index}.responsible`}
                                                render={({ field }) => (
                                                    <Input {...field} readOnly />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                type="button"
                                                variant="destructive"
                                                onClick={() => removeTool(index)}
                                                disabled={form.watch('tools').length === 1}
                                            >
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex justify-between">
                            <Button 
                                type="button" 
                                onClick={addTool}
                                disabled={form.watch('tools').length >= 5}
                            >
                                Agregar Instrumento
                            </Button>

                            <Button 
                                type="submit" 
                                disabled={loading}
                            >
                                Registrar Instrumentos
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            {showSearchModal && (
                <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
                    <DialogContent onPointerDownOutside={e => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Seleccionar Instrumento</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Responsable</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {searchResults.map((tool) => (
                                        <TableRow
                                            key={tool.id}
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => selectTool(tool)}
                                        >
                                            <TableCell>{tool.code}</TableCell>
                                            <TableCell>{tool.name}</TableCell>
                                            <TableCell>{tool.responsible}</TableCell>
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
