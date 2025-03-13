import { Order } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"

export type ModalAddEventProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    setOnSaveNewEvent: Dispatch<SetStateAction<boolean>>;
    orders: Order[];
    setNewEvent: Dispatch<
    SetStateAction<{
        eventName: string;
        orderSelected: {name: string, id: string}
    }>
    >;
};