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
import { FormCreateTool } from "../FormCreateTool"
//import { FormContact } from "../../[orderId]/components/NewContact/FormContact"
//import { FormTool } from "../../[orderId]/components/NewTool/FormTool"


export function HeaderTools() {


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
            <h2 className="text-2xl">Lista de Instrumentos</h2>


            {/* Modal para Crear Instrumentos */}
            <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
                <DialogTrigger asChild>
                    <Button>Registrar Instrumento</Button>
                </DialogTrigger>


                <DialogContent className="sm:max-w-[1200px]">
                    <DialogHeader>
                        <DialogTitle>
                            Registrar Instrumento
                        </DialogTitle>
                        <DialogDescription>
                            Información General
                        </DialogDescription>
                    </DialogHeader>

                    {/*Para crear una orden
                    <FormCreateOrder setOpenModalCreate={setOpenModalCreate} />*/}
                    <FormCreateTool
                        setOpenModalCreate={setOpenModalCreate}
                        setOpen={setOpenResponsiblesModal} // Pasa la función para abrir el modal de responsables
                        setUserId={setOrderId} // Pasa la función para actualizar el orderId

                    />

                </DialogContent>

            </Dialog>






        </div>
    )
}