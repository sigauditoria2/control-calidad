import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Header } from "./components/Header"
import { ToolInformation } from "./components/ToolInformation"
import { FooterTool } from "./components/FooterTool"



export default async function UserIdPage({ params }: { params: { toolId: string } }) {
    //const { userId } = auth()

    //if (!userId) {
        //return redirect("/")
    //}

    const tool = await db.tool.findUnique({
        where: {
            id: params.toolId,
            //userId
        }
    })

    if (!tool) {
        return redirect("/")
    }

    return (
        <div>
            <Header/>
            <ToolInformation tool={tool}/>
            <FooterTool toolId={tool.id}/>
        </div>
    )
}