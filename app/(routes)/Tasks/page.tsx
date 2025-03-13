import { auth } from '@clerk/nextjs'

import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { Calendar } from './components/Calendar'

//import {Calendar} from './components/Calendar'

export default async function TasksPage() {

    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }

    //Trae todas las empresas que pertenecen a ese ID
    const orders = await db.order.findMany({

        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const events = await db.event.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })


    return (
        <div>
            <Calendar orders={orders} events={events} />
        </div>
    )
}