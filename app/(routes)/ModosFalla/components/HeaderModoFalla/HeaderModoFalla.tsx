"use client"

import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { CirclePlus } from "lucide-react"
import { SetStateAction, useState } from "react"
import { FormCreateModoFalla } from "../FormCreateModoFalla"
//import { FormContact } from "../../[orderId]/components/NewContact/FormContact"
//import { FormTool } from "../../[orderId]/components/NewTool/FormTool"


export function HeaderModoFalla() {


    const [openModalCreate, setOpenModalCreate] = useState(false)

    {/*PARA RESPONSABLES*/ }
    const [openResponsiblesModal, setOpenResponsiblesModal] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null); // Estado para el ID de la orden

    const [responsiblesCount, setResponsiblesCount] = useState(0);


    {/*PARA HERRAMIENTAS*/ }
    const [openToolsModal, setOpenToolsModal] = useState(false);

    const [toolsCount, setToolsCount] = useState(0);



    {/*PARA CREAR RESPONSABLES*/ }
    const [open, setOpen] = useState(false)



    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl">Lista de Modos de Fallo</h2>


            {/* Modal para Crear Orden */}
            <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
                <DialogTrigger asChild>
                    <Button>Crear Modo de Fallo</Button>
                </DialogTrigger>


                <DialogContent className="sm:max-w-[1200px]">
                    <DialogHeader>
                        <DialogTitle>
                            Crear modo de falla
                        </DialogTitle>
                        <DialogDescription>
                            Información General
                        </DialogDescription>
                    </DialogHeader>

                    {/*Para crear una orden
                    <FormCreateOrder setOpenModalCreate={setOpenModalCreate} />*/}
                    <FormCreateModoFalla
                        setOpenModalCreate={setOpenModalCreate}
                        setOpen={setOpenResponsiblesModal} // Pasa la función para abrir el modal de responsables
                        setModoFallaId={setOrderId} // Pasa la función para actualizar el orderId

                    />

                </DialogContent>

            </Dialog>



    


        </div>
    )
}