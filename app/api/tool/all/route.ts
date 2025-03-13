import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const tools = await db.tool.findMany({
            select: {
                id: true,
                name: true,
                code: true,
                responsible: true
            },
            orderBy: {
                code: 'asc'
            }
        });

        return NextResponse.json(tools);
    } catch (error) {
        console.error("[TOOLS_GET]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
} 