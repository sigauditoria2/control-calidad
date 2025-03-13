import {redirect} from 'next/navigation'
import {auth} from '@clerk/nextjs'
import { db } from '@/lib/db'
import { DataTable } from './data-table'
//import { columns } from '@/app/(routes)/components/CustomersTable'

import {columns} from './columns'



export async function ListTools(){
    const {userId} = auth()

    if(!userId){
        return redirect("/")
    }

    // Obtener todas las herramientas sin filtrar por userId
    const tools = await db.tool.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return(
        <DataTable columns={columns} data={tools}/>
    )
}