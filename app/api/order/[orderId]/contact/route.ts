import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'


export async function POST(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {

        const { orderId } = params;


        const { userId } = auth()
        const data = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })

        }
        

        const order = await db.order.findUnique({
            where:{
                id: params.orderId,
            },
        });

        if(!order){
            return new NextResponse("Order no encontrada", {status: 404})
        }

        const contact = await db.contact.create({
            data: {
                orderId,
                name: data.name,
                role: data.role,
                code: data.code,
                function: data.function,
                userId: data.userId
            }
        });

        return NextResponse.json(contact);

    }catch(error){
        console.log("[CONTACT]", error);
        return new NextResponse("Error interno", {status: 500});
    }
}
