"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react'
import { Tool } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import Image from "next/image"


export const columns: ColumnDef<Tool>[] = [
    /*
    {
        accessorKey: "profileImage",
        header: "Imagen",
        cell: ({ row }) => {
            const image = row.getValue("profileImage")
            return (
                <div className="px-3">
                    <Image src={typeof image === "string" ? image : "/images/order-icon.png"}
                        width={40} height={40} alt="Image" className="h-auto w-auto" />
                </div>
            )
        }
    },
    */
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
/*
    {
        accessorKey: "rol",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado") as string; // Aseguramos que 'estado' es un string

            let backgroundColor = "";
            let textColor = "text-white"; // Para el color del texto

            // Asignamos el color de fondo y texto según el estado
            if (estado === "Abierto") {
                backgroundColor = "bg-green-500"; // Verde
            } else if (estado === "Cerrado") {
                backgroundColor = "bg-yellow-500"; // Amarillo
                textColor = "text-black"; // Texto negro para contraste
            } else if (estado === "Cancelado") {
                backgroundColor = "bg-red-500"; // Rojo
            }

            return (
                <div className={`py-1 px-3 rounded-lg ${backgroundColor} ${textColor}`}>
                    {estado}
                </div>
            );
        }
    },
    */
    {
        accessorKey: "code",
        header: "Codigo del Instrumento",
    },
    {
        accessorKey: "responsible",
        header: "Responsable del Instrumento",
    },
  
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const { id } = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="w-8 h-4 p-0">
                            <span className="sr-only">
                                Open Menu
                            </span>
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                        <Link href={`/Tools/${id}`}>
                            <DropdownMenuItem>
                                <Pencil className="w-4 h-4" mr-2 />
                                Editar
                            </DropdownMenuItem>
                        </Link>

                    </DropdownMenuContent>

                </DropdownMenu>
            )

        }

    },

]