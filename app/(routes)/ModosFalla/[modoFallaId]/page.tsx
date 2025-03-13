import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Header } from "./components/Header"
import { ModoFallaInformation } from "./components/ModoFallaInformation"
import { FooterModoFalla } from "./components/FooterModoFalla"



export default async function ModoFallaIdPage({ params }: { params: { modoFallaId: string } }) {
    
    //const { userId } = auth()

    //if (!userId) {
        //return redirect("/")
    //}

    const modoFalla = await db.modosFallo.findUnique({
        where: {
            id: params.modoFallaId,
            //userId
        }
    })

    if (!modoFalla) {
        return redirect("/")
    }

    return (
        <div>
            <Header/>
            <ModoFallaInformation modoFalla={modoFalla}/>
            <FooterModoFalla modoFallaId={modoFalla.id}/>
        </div>
    )
}