import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { toolId: string } }
) {
    try {
        //const { userId } = auth();
        const { toolId } = params;
        const values = await req.json();

        if (!toolId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const tool = await db.tool.update({
            where: {
                id: toolId
            },
            data: {
                ...values,
            },
        });
        return NextResponse.json(tool)

    } catch (error) {
        console.log("[TOOL ID]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }

}
 
export async function DELETE(req: Request, {params}: {params: {toolId: string}}) {
    try {
        const {toolId} = params;

        if(!toolId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        // Verificar si la herramienta está asociada a alguna orden
        const tool = await db.tool.findUnique({
            where: {
                id: toolId
            }
        });

        if (tool?.orderId) {
            return new NextResponse(
                "No se puede eliminar el instrumento porque está asociado a una orden. Elimine primero la orden o desasocie el instrumento.",
                {status: 400}
            );
        }

        const deleteTool = await db.tool.delete({
            where: {
                id: toolId,
            },
        });

        return NextResponse.json(deleteTool);
    } catch (error) {
        console.log("[DELETE TOOL ID]", error);
        return new NextResponse("Error Interno", {status: 500});
    }
}