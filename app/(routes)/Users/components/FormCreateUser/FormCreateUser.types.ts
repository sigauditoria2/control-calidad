import { Dispatch, SetStateAction } from "react"

export type FormCreateUserProps = {
    setOpenModalCreate: Dispatch<SetStateAction<boolean>>;

    setOpen:Dispatch<SetStateAction<boolean>>;
    
    setUserId: Dispatch<SetStateAction<string | null>>; // Agregar esta línea


}