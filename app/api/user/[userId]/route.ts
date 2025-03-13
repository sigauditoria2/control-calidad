import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        //const { userId } = auth();
        const { userId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Actualizar usuario
        const user = await db.user.update({
            where: {
                id: userId
            },
            data: {
                ...values,
            },
        });

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

        return NextResponse.json(user)
    } catch (error) {
        console.log("[USER ID]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
 
export async function DELETE(req: Request, {params}: {params: {userId: string}}) {
    try {
        const {userId} = params;

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        // Verificar si el usuario está asociado a alguna orden
        const associatedContacts = await db.contact.findFirst({
            where: {
                userId: userId,
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

        const deleteUser = await db.user.delete({
            where: {
                id: userId,
            },
        });

        return NextResponse.json(deleteUser);
    } catch (error) {
        console.log("[DELETE USER ID]", error);
        return new NextResponse("Error Interno", {status: 500});
    }
}