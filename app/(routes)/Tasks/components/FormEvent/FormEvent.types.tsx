import { Order } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"

export type FormEventProps = {
    setNewEvent: Dispatch<SetStateAction<{
        eventName: string,
        orderSelected: {name: string, id: string}
    }>>,

    setOpen: Dispatch<SetStateAction<boolean>>
    orders: Order[]
    setOnSaveNewEvent: Dispatch<SetStateAction<boolean>>




}