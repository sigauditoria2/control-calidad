import { Dispatch, SetStateAction } from "react"

export type FormContactProps = {
    setOpen: Dispatch<SetStateAction<boolean>>;

    orderId: string;
    
    onResponsibleAdded: () => void;
    onCompleted?: () => void;


};