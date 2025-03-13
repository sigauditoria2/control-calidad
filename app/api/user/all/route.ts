import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                rol: true,
                code: true,
                function: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("[USERS_GET]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
} 