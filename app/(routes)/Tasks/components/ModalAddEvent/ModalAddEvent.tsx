"use client"

import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'

import { ModalAddEventProps } from "./ModalAddEvent.types";
import { FormEvent } from '../FormEvent';

export function ModalAddEvent(props: ModalAddEventProps) {

    const { open, orders, setNewEvent, setOnSaveNewEvent, setOpen } = props



    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='sm-max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Añadir nuevo evento</DialogTitle>
                </DialogHeader>
                <FormEvent setOnSaveNewEvent={setOnSaveNewEvent}
                    orders={orders}
                    setNewEvent={setNewEvent}
                    setOpen={setOpen}
                />
            </DialogContent>

        </Dialog>
    )
}