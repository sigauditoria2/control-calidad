import { redirect } from 'next/navigation'

import { db } from '@/lib/db'

import { Mail, Phone } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

import { ListToolsProps } from "./ListTools.types";

import { auth } from '@clerk/nextjs'

export async function ListTools(props: ListToolsProps) {

    const { order } = props
    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }

    const tools = await db.tool.findMany({
        where: {
            order: {
                id: order.id
            }
        }
    })

    if (tools.length === 0) {
        return <p>Actualmente no existe ningun instrumento</p>
    }


    return (
        <div>
            <div className='mt-4 mb-2 grid grid-cols-3 p-2 gap-x-3 items-center justify-between px-4 bg-slate-400/20 rounded-lg gap-x-3'>
                <p>Instrumento</p>
                <p>Codigo</p>
                <p>Responsable</p>
                

            </div>

            {tools.map((tool) => (
                <div key={tool.id}>
                    <div className='grid items-center justify-between grid-cols-3 px-4 gap-x-3'>
                        <p>{tool.name}</p>
                        <p>{tool.code}</p>
                        <p>{tool.responsible}</p>

                    </div>
                    <Separator className='my-3'/>
                </div>
            ))}
        </div>
    )
}