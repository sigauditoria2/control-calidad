import {db} from "@/lib/db"
import {auth} from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Obtener el ID de la orden de la URL si existe
        const url = new URL(req.url);
        const orderId = url.pathname.split('/').pop();

        // Si hay un ID específico, obtener esa orden
        if (orderId && orderId !== 'order') {
            const order = await db.order.findUnique({
                where: {
                    id: orderId
                },
                include: {
                    contacts: true,
                    tools: true
                }
            });

            if (!order) {
                return new NextResponse("Orden no encontrada", { status: 404 });
            }

            return NextResponse.json(order);
        }

        // Si no hay ID específico, obtener todas las órdenes
        const orders = await db.order.findMany({
            include: {
                contacts: true,
                tools: true
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

        if (!body.order || !/^OCL-\d{5}$/.test(body.order)) {
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
                cliente: body.cliente,
                proyecto: body.proyecto,
                fig: body.fig,
                codigoElemento: body.codigoElemento,
                designacion: body.designacion,
                codigoAplicable: body.codigoAplicable,
                centroTrabajo: body.centroTrabajo,
                areaInspeccionada: body.areaInspeccionada,
                fechaPlanificada: body.fechaPlanificada,
            }
        });

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("[ORDERS_POST]", error);
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
}