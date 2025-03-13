import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { orderNumber: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { orderNumber } = params;

        // Verificar el formato del número
        if (!orderNumber.match(/^ODI-\d{5}$/)) {
            return new NextResponse(
                JSON.stringify({ 
                    error: "Formato de número inválido",
                    exists: false 
                }), 
                { status: 400 }
            );
        }

        const existingOrder = await db.order.findFirst({
            where: {
                order: orderNumber
            }
        });

        // Obtener el número más alto actual para referencia
        const highestOrder = await db.order.findFirst({
            select: {
                order: true
            },
            orderBy: {
                order: 'desc'
            }
        });

        return NextResponse.json({ 
            exists: !!existingOrder,
            currentHighest: highestOrder?.order || null
        });
    } catch (error) {
        console.error("[ORDER_CHECK]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
} 