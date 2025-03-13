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
import { FormCreateOrder } from "../FormCreateOrder"
import { FormContact } from "../../[orderId]/components/NewContact/FormContact"
import { FormTool } from "../../[orderId]/components/NewTool/FormTool"


export function HeaderOrders() {
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openResponsiblesModal, setOpenResponsiblesModal] = useState(false);
    const [openToolsModal, setOpenToolsModal] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    // Función para manejar la transición de modales
    const handleOrderCreated = (newOrderId: string) => {
        setOrderId(newOrderId);
        setOpenModalCreate(false);
        setOpenResponsiblesModal(true);
    };

    const handleResponsiblesCompleted = () => {
        setOpenResponsiblesModal(false);
        setOpenToolsModal(true);
    };

    const handleToolsCompleted = () => {
        setOpenToolsModal(false);
        setOrderId(null);
        // Aquí podrías agregar alguna acción adicional al completar todo el proceso
    };

    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl">Planificación de Inspecciones</h2>

            {/* Modal para Crear Orden */}
            <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
                <DialogTrigger asChild>
                    <Button>Crear Orden</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1200px]">
                    <DialogHeader>
                        <DialogTitle>Crear Orden</DialogTitle>
                        <DialogDescription>Información General</DialogDescription>
                    </DialogHeader>
                    <FormCreateOrder
                        setOpenModalCreate={setOpenModalCreate}
                        setOpen={setOpenResponsiblesModal}
                        setOpenTools={setOpenToolsModal}
                        setOrderId={setOrderId}
                        onOrderCreated={handleOrderCreated}
                    />
                </DialogContent>
            </Dialog>

            {/* Modal para Responsables */}
            <Dialog open={openResponsiblesModal} onOpenChange={setOpenResponsiblesModal}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Registrar Responsables</DialogTitle>
                        <DialogDescription>Ingrese la información de los 4 responsables.</DialogDescription>
                    </DialogHeader>
                    {orderId && (
                        <FormContact
                            setOpen={setOpenResponsiblesModal}
                            orderId={orderId}
                            onResponsibleAdded={() => {}}
                            onCompleted={handleResponsiblesCompleted}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal para Instrumentos */}
            <Dialog open={openToolsModal} onOpenChange={setOpenToolsModal}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Registrar Instrumentos</DialogTitle>
                        <DialogDescription>Ingrese la información de los instrumentos (máximo 5).</DialogDescription>
                    </DialogHeader>
                    {orderId && (
                        <FormTool
                            setOpenTools={setOpenToolsModal}
                            orderId={orderId}
                            onCompleted={handleToolsCompleted}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}