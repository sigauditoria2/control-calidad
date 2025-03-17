"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react'
import { Amef } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import Image from "next/image"

// Función para determinar el color del estado NPR
function getEstadoNPRStyle(npr: string) {
    const nprValue = parseInt(npr);
    if (nprValue >= 0 && nprValue <= 100) {
        return "bg-green-500 text-white";
    } else if (nprValue >= 101 && nprValue <= 500) {
        return "bg-yellow-500 text-white";
    } else if (nprValue >= 501 && nprValue <= 800) {
        return "bg-orange-500 text-white";
    } else if (nprValue >= 801 && nprValue <= 1000) {
        return "bg-red-500 text-white";
    }
    return "";
}

export const columns: ColumnDef<Amef>[] = [
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
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("order")}
            </div>
        )
    },
    {
        accessorKey: "npr",
        header: "NPR",
    },
    {
        accessorKey: "estadoNPR",
        header: "Estado NPR",
        cell: ({ row }) => {
            const npr = row.getValue("npr") as string;
            return (
                <div className={`px-2 py-1 rounded-full text-center ${getEstadoNPRStyle(npr)}`}>
                    {row.getValue("estadoNPR")}
                </div>
            );
        }
    },
    {
        accessorKey: "procesoProduccion",
        header: "Proceso",
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("procesoProduccion")}
            </div>
        )
    },
    {
        accessorKey: "especificacionProceso",
        header: "Especificacion del Proceso",
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("especificacionProceso")}
            </div>
        )
    },
    {
        accessorKey: "fig",
        header: "FIG",
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("fig")}
            </div>
        )
    },
    {
        accessorKey: "proyecto",
        header: "Proyecto",
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("proyecto")}
            </div>
        )
    },
    {
        accessorKey: "cliente",
        header: "Cliente",
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("cliente")}
            </div>
        )
    },
    {
        accessorKey: "elemento",
        header: "Elemento",
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("elemento")}
            </div>
        )
    },
    {
        accessorKey: "fechaDeteccion",
        header: "Fecha detección",
        cell: ({ row }) => (
            <div className="bg-green-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("fechaDeteccion")}
            </div>
        )
    },
    {
        accessorKey: "modoFallo",
        header: "Modo de Falla",
        cell: ({ row }) => (
            <div className="bg-yellow-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("modoFallo")}
            </div>
        )
    },
    {
        accessorKey: "efecto",
        header: "Efecto",
        cell: ({ row }) => (
            <div className="bg-yellow-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("efecto")}
            </div>
        )
    },
    {
        accessorKey: "causaModoFallo",
        header: "Causa del Modo de Falla",
        cell: ({ row }) => (
            <div className="bg-yellow-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("causaModoFallo")}
            </div>
        )
    },
    {
        accessorKey: "medidasEnsayo",
        header: "Medidas de Ensayo",
        cell: ({ row }) => (
            <div className="bg-yellow-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("medidasEnsayo")}
            </div>
        )
    },
    {
        accessorKey: "accionImplementada",
        header: "Acción Implementada",
        cell: ({ row }) => (
            <div className="bg-yellow-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("accionImplementada")}
            </div>
        )
    },
    {
        accessorKey: "fechaValidacionCorreccion",
        header: "Fecha Corrección",
        cell: ({ row }) => (
            <div className="bg-yellow-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("fechaValidacionCorreccion")}
            </div>
        )
    },
    {
        accessorKey: "costoReproceso",
        header: "Costo de Reproceso",
        cell: ({ row }) => (
            <div className="bg-yellow-100 dark:bg-transparent p-2 rounded dark:text-white">
                {row.getValue("costoReproceso")}
            </div>
        )
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

                        <Link href={`/AMEF/${id}`}>
                            <DropdownMenuItem>
                                <Pencil className="w-4 h-4" mr-2 />
                                Completar Registro
                            </DropdownMenuItem>
                        </Link>

                    </DropdownMenuContent>

                </DropdownMenu>
            )

        }

    },

]