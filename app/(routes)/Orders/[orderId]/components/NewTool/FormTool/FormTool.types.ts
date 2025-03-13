import { Dispatch, SetStateAction } from "react"

export type FormToolProps = {
    setOpenTools: Dispatch<SetStateAction<boolean>>;
    orderId: string;
    onCompleted?: () => void;
};