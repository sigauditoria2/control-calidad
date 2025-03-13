import {db} from "@/lib/db"
import {auth} from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
    try{

        const {userId} = auth();
        const data = await req.json()


        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})

        }

        const tool = await db.tool.create({
            data:{
                userId,
                ...data,
            },
        });

        return NextResponse.json(tool);

    }catch(error){
        console.log("[TOOL]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}