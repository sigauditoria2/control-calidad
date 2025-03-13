"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { z } from "zod"

import { Input } from "@/components/ui/input";

import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'

import { Button } from "@/components/ui/button";

import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"


const formSchema = z.object({
    eventName: z.string().min(2),
    orderSelected: z.object({
        name: z.string().min(2),
        id: z.string()
    })

})

import { FormEventProps } from "./FormEvent.types";

export function FormEvent(props: FormEventProps) {

    const { orders, setNewEvent, setOnSaveNewEvent, setOpen } = props
    const [selectedOrder, setSelectedOrder] = useState({
        name: "",
        id: ""
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eventName: "",
            orderSelected: {
                name: "",
                id: ""
            }
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setNewEvent(values)
        setOpen(false)
        setOnSaveNewEvent(true)
    }

    const handleOrderChange = (newValue: string) => {
        const selectedOrder = orders.find(order => order.order === newValue)
        if (selectedOrder) {
            setSelectedOrder({
                name: selectedOrder.order,
                id: selectedOrder.id
            })
            form.setValue("orderSelected.name", selectedOrder.order)
            form.setValue("orderSelected.id", selectedOrder.id)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Meeting.." {...field} />
                            </FormControl>
                            <FormDescription>
                                Nombre del Evento
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}

                />
                <FormField
                    control={form.control}
                    name="orderSelected.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de la Orden</FormLabel>
                            <Select onValueChange={(newValue) => {
                                field.onChange(newValue)
                                handleOrderChange(newValue)
                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione la orden" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {orders.map((order) => (
                                        <SelectItem key={order.id} value={order.order}>
                                            {order.order}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            <FormMessage/>

                        </FormItem>
                    )}
                />
                <Button type="submit">Crear evento</Button>


            </form>

        </Form>
    )
}