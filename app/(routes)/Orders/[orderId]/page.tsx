import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Header } from "./components/Header"
import { OrderInformation } from "./components/OrderInformation"
import { FooterOrder } from "./components/FooterOrder"



export default async function OrderIdPage({ params }: { params: { orderId: string } }) {
    
    //const { userId } = auth()

    //if (!userId) {
      //  return redirect("/")
    //}

    const order = await db.order.findUnique({
        where: {
            id: params.orderId,
            //userId
        }
    })

    if (!order) {
        return redirect("/")
    }

    return (
        <div>
            <Header/>
            <OrderInformation order={order}/>
            <FooterOrder orderId={order.id}/>
        </div>
    )
}