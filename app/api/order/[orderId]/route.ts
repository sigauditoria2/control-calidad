import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { userId } = auth();
        const { orderId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const order = await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                ...values,
            },
        });

        // Enviar actualización a Power Automate
        try {
            const response = await fetch("https://prod-182.westus.logic.azure.com:443/workflows/da1509855ed8448f9701dc903e3b915b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zJinWQKzstenjkOmcUdmkZDOU7tVH38e0naJcoe4Ctc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    action: "update"
                }),
            });

            if (!response.ok) {
                console.error("Error al sincronizar la actualización con SharePoint");
            }
        } catch (error) {
            console.error("Error al notificar la actualización a SharePoint:", error);
        }

        return NextResponse.json(order)

    } catch (error) {
        console.log("[ORDER ID]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
 
export async function DELETE(req: Request, {params}: {params: {orderId: string}}) {
    try {
        const {userId} = auth()
        const {orderId} = params

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        // Obtener la información de la orden antes de eliminarla
        const orderToDelete = await db.order.findUnique({
            where: {
                id: orderId
            }
        });

        if (!orderToDelete) {
            return new NextResponse("Orden no encontrada", {status: 404});
        }

        // Primero, desasociar los instrumentos de la orden
        await db.tool.updateMany({
            where: {
                orderId: orderId
            },
            data: {
                orderId: null
            }
        });

        // Luego eliminar la orden de la base de datos
        const deletedOrder = await db.order.delete({
            where: {
                id: orderId,
            },
        });

        // Finalmente, notificar a Power Automate para eliminar el registro en SharePoint
        try {
            const response = await fetch("https://prod-182.westus.logic.azure.com:443/workflows/da1509855ed8448f9701dc903e3b915b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zJinWQKzstenjkOmcUdmkZDOU7tVH38e0naJcoe4Ctc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderNumber: orderToDelete.order,
                    action: "delete"
                }),
            });

            if (!response.ok) {
                console.error("Error al sincronizar la eliminación con SharePoint");
            }
        } catch (error) {
            console.error("Error al notificar la eliminación a SharePoint:", error);
        }

        return NextResponse.json(deletedOrder);
    } catch (error) {
        console.log("[DELETE ORDER ID]", error)
        return new NextResponse("Error Interno", {status: 500})
    }
}