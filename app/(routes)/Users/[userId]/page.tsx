import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Header } from "./components/Header"
import { UserInformation } from "./components/UserInformation"
import { FooterUser } from "./components/FooterUser"



export default async function UserIdPage({ params }: { params: { userId: string } }) {
    
    //const { userId } = auth()

    //if (!userId) {
        //return redirect("/")
    //}

    const user = await db.user.findUnique({
        where: {
            id: params.userId,
            //userId
        }
    })

    if (!user) {
        return redirect("/")
    }

    return (
        <div>
            <Header/>
            <UserInformation user={user}/>
            <FooterUser userId={user.id}/>
        </div>
    )
}