import { db } from "@/lib/db";
import {auth} from "@clerk/nextjs"
import { NextResponse } from "next/server";

export async function POST(req: Request, {params}: {params: {orderId: string}}) {
    try {
        const {userId} = auth()
        const data = await req.json()

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const order = await db.order.findUnique({
            where:{
                id: params.orderId,

            },
        });

        if(!order){
            return new NextResponse("Orden no encontrada", {status: 404});

        }

        const event = await db.event.create({
            data:{
                orderId: params.orderId,
                ...data
            }

        })
        return NextResponse.json(event);
        
    } catch (error) {
        console.log("[EVENT]", error);
        return new NextResponse("Error interno", {status: 500})
        
    }
    
}