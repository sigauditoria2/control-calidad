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
import { FormCreateToolProps } from "./FormCreateTools.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { title } from "process"
import { Toast } from "@/components/ui/toast"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"

import { useEffect } from "react"
import { Search } from "lucide-react"


const formSchema = z.object({
    name: z.string().min(2),
    responsible: z.string().min(2),
    code: z.string().min(2)
})



export function FormCreateTool(props: FormCreateToolProps) {


    //const { setOpenModalCreate} = props
    const { setOpenModalCreate, setOpen, setUserId } = props

    const router = useRouter()

    const [photoUploaded, setPhotoUploaded] = useState(false)
    const [isUserSearchOpen, setIsUserSearchOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            responsible: "",
            code: ""
        },
    })

    const { isValid } = form.formState

    const searchUsers = async (term: string) => {
        if (!term) return
        setLoading(true)
        try {
            const response = await axios.get(`/api/user/search?name=${term}`)
            setUsers(Array.isArray(response.data) ? response.data : [response.data])
        } catch (error) {
            console.error("Error buscando usuarios:", error)
            toast({
                title: "Error al buscar usuarios",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const selectUser = (userName: string) => {
        form.setValue("responsible", userName)
        setIsUserSearchOpen(false)
    }

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //axios.post("/api/order", values)
            const responseTool = await axios.post("/api/tool", values);
            const userId = responseTool.data.id; // Suponiendo que el backend devuelve el ID


            toast({ title: "Instrumento Creado Correctamente" })

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
                    <div className="grid grid-cols-3 gap-3">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Instrumento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Flexómetro" type="text" {...field} />
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
                                    <FormLabel>Codigo del instrumento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: FLE0654" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="responsible"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsable del Instrumento</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="Ej: Nombre del Colaborador" type="text" {...field} />
                                        </FormControl>
                                        <Dialog open={isUserSearchOpen} onOpenChange={setIsUserSearchOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Buscar Usuario</DialogTitle>
                                                    <DialogDescription>
                                                        Busca y selecciona un usuario responsable
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Buscar por nombre..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                        <Button onClick={() => searchUsers(searchTerm)}>
                                                            Buscar
                                                        </Button>
                                                    </div>
                                                    <div className="max-h-[300px] overflow-y-auto">
                                                        {loading ? (
                                                            <div>Cargando...</div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {users.map((user) => (
                                                                    <div
                                                                        key={user.id}
                                                                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                                                                        onClick={() => selectUser(user.name)}
                                                                    >
                                                                        <p className="font-medium">{user.name}</p>
                                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button type="submit" disabled={!isValid}>Registrar Instrumento</Button>
                </form>
            </Form>

        </div>
    )
}


