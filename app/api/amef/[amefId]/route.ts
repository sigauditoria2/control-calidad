import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { amefId: string } }
) {
    try {
        //const { userId } = auth();
        const { amefId } = params;
        const values = await req.json();

        if (!amefId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Actualizar usuario
        const registerAmef = await db.amef.update({
            where: {
                id: amefId
            },
            data: {
                ...values,
            },
        });



        return NextResponse.json(registerAmef)
    } catch (error) {
        console.log("[AMEF ID]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
 
export async function DELETE(req: Request, {params}: {params: {amefId: string}}) {
    try {
        const {amefId} = params;

        if(!amefId) {
            return new NextResponse("Unauthorized", {status: 401});
        }


        const deleteRegister = await db.amef.delete({
            where: {
                id: amefId,
            },
        });

        return NextResponse.json(deleteRegister);
    } catch (error) {
        console.log("[DELETE REGISTER ID]", error);
        return new NextResponse("Error Interno", {status: 500});
    }
}