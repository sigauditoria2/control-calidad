import { Dispatch, SetStateAction } from "react"

export type FormCreateModoFallaProps = {
    setOpenModalCreate: Dispatch<SetStateAction<boolean>>;

    setOpen:Dispatch<SetStateAction<boolean>>;
    
    setModoFallaId: Dispatch<SetStateAction<string | null>>; // Agregar esta línea


}