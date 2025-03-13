import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name");

        if (!name) {
            return new NextResponse("Nombre requerido", { status: 400 });
        }

        // Modificamos la consulta para ser más flexible en la búsqueda
        const user = await db.user.findFirst({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                rol: true,    // Asegúrate que estos nombres coincidan
                code: true,   // exactamente con los campos en tu
                function: true // tabla User
            }
        });

        if (!user) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error en búsqueda de usuario:", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}