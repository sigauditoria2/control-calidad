import { Dispatch, SetStateAction } from "react"

export type FormCreateOrderProps = {

    /*Abre el modal de ordenes*/
    setOpenModalCreate: Dispatch<SetStateAction<boolean>>;

    /*Abre el modal de responsables*/
    setOpen:Dispatch<SetStateAction<boolean>>;

    /*Abre el modal de herramientas*/
    setOpenTools:Dispatch<SetStateAction<boolean>>;
    
    setOrderId: Dispatch<SetStateAction<string | null>>;

    onOrderCreated?: (orderId: string) => void;

}