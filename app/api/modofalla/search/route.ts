import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const modoFallo = searchParams.get("modoFallo");

        if (!modoFallo) {
            return new NextResponse("Nombre requerido", { status: 400 });
        }

        // Modificamos la consulta para ser más flexible en la búsqueda
        const modoFalloSearch = await db.modosFallo.findFirst({
            where: {
                modoFallo: {
                    contains: modoFallo,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                modoFallo: true,
                codigo: true,
                efecto: true,
                causaModoFallo: true,
                ocurrencia: true,
                gravedad: true,
                deteccion: true,
                npr: true,
                estadoNPR: true
            }
        });

        if (!modoFallo) {    
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        return NextResponse.json(modoFallo);
    } catch (error) {
        console.error("Error en búsqueda de usuario:", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}