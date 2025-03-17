import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { orderNumber: string } }
) {
    try {
        const { orderNumber } = params;

        // Primero encontrar la orden por su número
        const order = await db.order.findFirst({
            where: {
                order: orderNumber
            }
        });

        if (!order) {
            return new NextResponse(
                JSON.stringify({ error: "Orden no encontrada" }),
                { status: 404 }
            );
        }

        // Luego obtener los contactos asociados a esa orden
        const contacts = await db.contact.findMany({
            where: {
                orderId: order.id
            }
        });

        return NextResponse.json(contacts);
    } catch (error) {
        console.error("[ORDER_CONTACTS_GET]", error);
        return new NextResponse(
            JSON.stringify({ error: "Error interno del servidor" }),
            { status: 500 }
        );
    }
} 