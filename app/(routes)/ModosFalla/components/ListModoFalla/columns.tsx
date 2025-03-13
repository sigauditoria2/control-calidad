"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react'
import { ModosFallo, User } from "@prisma/client"
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


export const columns: ColumnDef<ModosFallo>[] = [
    {
        accessorKey: "modoFallo",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Modo de Falla
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "codigo",
        header: "Codificación",
    },
    {
        accessorKey: "efecto",
        header: "Efecto",
    },
    {
        accessorKey: "causaModoFallo",
        header: "Causas del modo de falla",
    },
    {
        accessorKey: "efecto",
        header: "Efecto",
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

                        <Link href={`/ModosFalla/${id}`}>
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