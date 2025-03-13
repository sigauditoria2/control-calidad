import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { modoFallaId: string } }
) {
    try {
        //const { userId } = auth();
        const { modoFallaId } = params;
        const values = await req.json();

        if (!modoFallaId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Actualizar usuario
        const modoFalla = await db.modosFallo.update({
            where: {
                id: modoFallaId
            },
            data: {
                ...values,
            },
        });

        /*

        // Actualizar todos los contactos relacionados
        await db.contact.updateMany({
            where: {
                userId: userId
            },
            data: {
                name: values.name,
                role: values.rol,
                code: values.code,
                function: values.function
            }
        });
        
        */

        return new NextResponse(JSON.stringify(modoFalla), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.log("[MODOFALLA ID]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
 
export async function DELETE(req: Request, {params}: {params: {modoFallaId: string}}) {
    try {
        const {modoFallaId} = params;

        if(!modoFallaId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        // Verificar si el usuario está asociado a alguna orden
        const associatedContacts = await db.contact.findFirst({
            where: {
                userId: modoFallaId,
                orderId: {
                    not: null
                }
            }
        });

        if (associatedContacts) {
            return new NextResponse(
                "No se puede eliminar el usuario porque está asociado a una o más órdenes. Elimine primero las órdenes relacionadas.",
                {status: 400}
            );
        }

        const deleteModoFalla = await db.modosFallo.delete({
            where: {
                id: modoFallaId,
            },
        });

        return new NextResponse(JSON.stringify(deleteModoFalla), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.log("[DELETE MODOFALLA ID]", error);
        return new NextResponse("Error Interno", {status: 500});
    }
}