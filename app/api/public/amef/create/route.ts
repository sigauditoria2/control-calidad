import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Función para manejar preflight requests
export async function OPTIONS(req: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(req: Request) {
    try {
        // Log para debugging
        console.log("Recibiendo solicitud POST en /api/public/amef/create");
        
        const data = await req.json();
        console.log("Datos recibidos:", data);

        // Validar datos recibidos
        if (!data.order || !data.elemento) {
            console.log("Datos faltantes:", { data });
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "Se requieren los campos 'order' y 'elemento'"
                }), 
                { 
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
        }

        // Buscar la orden
        const order = await db.order.findFirst({
            where: {
                order: data.order
            }
        });

        if (!order) {
            console.log("Orden no encontrada:", data.order);
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "Orden no encontrada"
                }), 
                { 
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
        }

        // Crear registro AMEF
        const amef = await db.amef.create({
            data: {
                order: order.order,
                procesoProduccion: order.procesoProduccion,
                especificacionProceso: order.especificacionProceso,
                fig: order.fig,
                proyecto: order.proyecto,
                cliente: order.cliente,
                elemento: data.elemento,
                fechaDeteccion: order.fechaProgramada,
                nivelInspeccion: order.nivelInspeccion,
                planMuestra: order.planMuestra,
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

        console.log("AMEF creado exitosamente:", amef);

        return new NextResponse(
            JSON.stringify({
                success: true,
                message: "Registro AMEF creado exitosamente"
            }), 
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
    } catch (error) {
        console.error("Error en creación de AMEF:", error);
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "Error al crear el registro AMEF",
                error: error instanceof Error ? error.message : "Error desconocido"
            }), 
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
    }
} 