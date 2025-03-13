"use client"

import React from "react"

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        }
    })



    if (!isMounted) {
        return null
    }



    return (
        <div className="flex flex-col bg-background shadow-md rounded-lg">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between gap-x-4">
                    <Input
                        placeholder="Filtrar por orden..."
                        value={(table.getColumn("order")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("order")?.setFilterValue(event.target.value)}
                        className="flex-1"
                    />
                    <Input
                        placeholder="Filtrar por Estado NPR..."
                        value={(table.getColumn("estadoNPR")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("estadoNPR")?.setFilterValue(event.target.value)}
                        className="flex-1"
                    />
                    <input
                        type="date"
                        placeholder="Filtrar por fecha"
                        value={(table.getColumn("fechaDeteccion")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("fechaDeteccion")?.setFilterValue(event.target.value)}
                        className="border p-2 rounded bg-background"
                    />
                </div>
            </div>

            <div className="overflow-auto border-t">
                <div className="min-w-full inline-block align-middle">
                    <Table className="border-collapse border border-gray-200 dark:border-gray-700">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-gray-50 dark:bg-gray-800">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="whitespace-nowrap font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 p-3"
                                            >
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="border border-gray-200 dark:border-gray-700 p-3"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center border border-gray-200 dark:border-gray-700"
                                    >
                                        No hay registros AMEF
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="p-4 border-t">
                <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    )



}