"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react'
import { Order } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import Image from "next/image"


export const columns: ColumnDef<Order>[] = [

    {
        accessorKey: "order",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Orden
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },

    {
        accessorKey: "estado",
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
    {
        accessorKey: "cliente",
        header: "Cliente",
    },
    {
        accessorKey: "proyecto",
        header: "Proyecto",
    },
    {
        accessorKey: "fig",
        header: "Fig",
    },
    {
        accessorKey: "codigoElemento",
        header: "Código del Elemento",
    },
    {
        accessorKey: "designacion",
        header: "Designación",
    },
    {
        accessorKey: "codigoAplicable",
        header: "Código Aplicable",
    },
    {
        accessorKey: "centroTrabajo",
        header: "Centro de Trabajo",
    },
    {
        accessorKey: "qc",
        header: "QC",
    },
    {
        accessorKey: "areaInspeccionada",
        header: "Área Inspeccionada",
    },
    {
        accessorKey: "fechaPlanificada",
        header: "Fecha Planificada",
    },

    {
        id: "actions",
        header: "Actions",
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

                        <Link href={`/Orders/${id}`}>
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