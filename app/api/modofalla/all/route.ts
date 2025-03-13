import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const modosFallo = await db.modosFallo.findMany({
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return new NextResponse(JSON.stringify(modosFallo), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.error("[MODOSFALLO_GET]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
} 