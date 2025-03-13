import {redirect} from 'next/navigation'
import {auth} from '@clerk/nextjs'
import { db } from '@/lib/db'
import { DataTable } from './data-table'
//import { columns } from '@/app/(routes)/components/CustomersTable'

import {columns} from './columns'
import { LogoAmef } from '@/components/LogoAmef'



export async function ListRegistersAmef(){
    //const {userId} = auth()

    //if(!userId){
        //return redirect("/")
    //}

    // Obtener todas las órdenes sin filtrar por userId
    const registersAmef = await db.amef.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return(
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    MATRIZ DE ANÁLISIS MODAL DE FALLOS Y EFECTOS (AMEF)
                </h1>
            </div>
            <DataTable columns={columns} data={registersAmef}/>
        </div>
    )
}