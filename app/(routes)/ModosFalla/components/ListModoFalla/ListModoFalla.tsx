import {redirect} from 'next/navigation'
import {auth} from '@clerk/nextjs'
import { db } from '@/lib/db'
import { DataTable } from './data-table'
//import { columns } from '@/app/(routes)/components/CustomersTable'

import {columns} from './columns'



export async function ListModoFalla(){
    
    const {userId} = auth()

    if(!userId){
        return redirect("/")
    }
    // Obtener todos los usuarios sin filtrar por userId
    const modoFalla = await db.modosFallo.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return(
        <DataTable columns={columns} data={modoFalla}/>
    )
}