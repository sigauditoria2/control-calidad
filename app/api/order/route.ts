import {db} from "@/lib/db"
import {auth} from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Obtener todas las órdenes sin filtrar por userId
        const orders = await db.order.findMany({
            include: {
                contacts: true,
                tools: true,
                events: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("[ORDERS_GET]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        if (!body.order || !/^ODI-\d{5}$/.test(body.order)) {
            return new NextResponse("Formato de orden inválido", { status: 400 });
        }

        // Verificar si la orden ya existe
        const existingOrder = await db.order.findFirst({
            where: {
                order: body.order
            }
        });

        if (existingOrder) {
            return new NextResponse("El número de orden ya existe", { status: 400 });
        }

        const order = await db.order.create({
            data: {
                userId,
                order: body.order,
                estado: body.estado,
                tipoInspeccion: body.tipoInspeccion,
                fechaProgramada: body.fechaProgramada,
                procesoProduccion: body.procesoProduccion,
                especificacionProceso: body.especificacionProceso,
                muestra: body.muestra,
                cliente: body.cliente,
                fig: body.fig,
                proyecto: body.proyecto,
                area: body.area,
                designacion: body.designacion,
                norma: body.norma,
                lote: body.lote,
                nivelInspeccion: body.nivelInspeccion,
                planMuestra: body.planMuestra
            }
        });

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("[ORDERS_POST]", error);
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
}