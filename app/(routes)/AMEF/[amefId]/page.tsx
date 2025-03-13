import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Header } from "./components/Header"
import { FooterAmef } from "./components/FooterAmef"
import {  AmefInformation } from "./components/AmefInformation"



export default async function AmefIdPage({ params }: { params: { amefId: string } }) {
    //const { userId } = auth()

    //if (!userId) {
        //return redirect("/")
    //}

    const amef = await db.amef.findUnique({
        where: {
            id: params.amefId,
            //userId
        }
    })

    if (!amef) {
        return redirect("/")
    }

    return (
        <div>
            <Header/>
            <AmefInformation amef={amef}/>
            <FooterAmef amefId={amef.id}/>
        </div>
    )
}