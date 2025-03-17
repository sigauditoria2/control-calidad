import { db } from "@/lib/db";
import { Contact } from "lucide-react";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validar que se reciban los datos necesarios
        if (!data.order || !data.elemento) {
            return new NextResponse(
                JSON.stringify({
                    error: "Se requiere el número de orden y el elemento"
                }), 
                { 
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        // Buscar la orden por el número de orden
        const order = await db.order.findFirst({
            where: {
                order: data.order
            }
        });

        if (!order) {
            return new NextResponse(
                JSON.stringify({
                    error: "Orden no encontrada"
                }), 
                { 
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        // Crear el registro AMEF usando la fecha programada de la orden
        const amef = await db.amef.create({
            data: {
                order: order.order,
                procesoProduccion: order.procesoProduccion,
                especificacionProceso: order.especificacionProceso,
                fig: order.fig,
                proyecto: order.proyecto,
                cliente: order.cliente,
                elemento: data.elemento, // Elemento que viene de Power Apps
                fechaDeteccion: order.fechaProgramada, // Usamos la fecha programada de la orden
                nivelInspeccion: order.nivelInspeccion,
                planMuestra: order.planMuestra,
                // Campos que se completarán después
                modoFallo: "",
                efecto: "",
                causaModoFallo: "",
                medidasEnsayo: "",
                ocurrencia: "",
                gravedad: "",
                deteccion: "",
                npr: "",
                estadoNPR: "",
                codigoColaboradorCT: "",
                codigoResponsableInspeccion: "",
                accionImplementada: "",
                fechaValidacionCorreccion: "",
                costoReproceso: ""
            }
        });

        return new NextResponse(
            JSON.stringify({
                success: true,
                data: amef
            }), 
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Permitir solicitudes desde cualquier origen
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }
        );
    } catch (error) {
        console.error("[AMEF_CREATE]", error);
        return new NextResponse(
            JSON.stringify({
                error: "Error interno del servidor",
                details: error instanceof Error ? error.message : "Error desconocido"
            }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }
        );
    }
} 