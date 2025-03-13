import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code) {
            return new NextResponse("Codigo requerido", { status: 400 });
        }

        // Modificamos la consulta para ser más flexible en la búsqueda
        const tool = await db.tool.findFirst({
            where: {
                code: {
                    contains: code,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                code: true,   // exactamente con los campos en tu
                responsible: true // tabla User
            }
        });

        if (!tool) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        return NextResponse.json(tool);
    } catch (error) {
        console.error("Error en búsqueda del instrumento:", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}