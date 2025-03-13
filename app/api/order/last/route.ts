import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        // Obtener todas las órdenes y ordenarlas por el número
        const orders = await db.order.findMany({
            select: {
                order: true
            }
        });

        // Extraer y ordenar los números
        const numbers = orders
            .map(o => {
                const match = o.order.match(/\d+$/);
                return match ? parseInt(match[0]) : 0;
            })
            .filter(n => n > 0)
            .sort((a, b) => b - a); // Ordenar de mayor a menor

        let nextNumber = 1;
        
        if (numbers.length > 0) {
            nextNumber = numbers[0] + 1; // Tomar el número más alto y sumar 1
        }

        // Formatear el número con ceros a la izquierda
        const formattedNumber = String(nextNumber).padStart(5, '0');

        // Verificar que el número generado no exista ya
        const existingOrder = await db.order.findFirst({
            where: {
                order: `ODI-${formattedNumber}`
            }
        });

        if (existingOrder) {
            throw new Error("Número de orden duplicado detectado");
        }

        return new NextResponse(
            JSON.stringify({ 
                number: formattedNumber,
                totalOrders: orders.length
            }), 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Surrogate-Control': 'no-store'
                }
            }
        );
    } catch (error: any) {
        console.error("Error generando número de orden:", error);
        return new NextResponse(
            JSON.stringify({ 
                error: "Error obteniendo el número de orden",
                details: error?.message || "Error desconocido"
            }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Surrogate-Control': 'no-store'
                }
            }
        );
    }
}
