import { redirect } from 'next/navigation'

import { db } from '@/lib/db'

import { Mail, Phone } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

import { ListContactsProps } from "./ListContacts.types";

import { auth } from '@clerk/nextjs'

export async function ListContacts(props: ListContactsProps) {

    const { order } = props
    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }

    const contacts = await db.contact.findMany({
        where: {
            order: {
                id: order.id
            }
        }
    })

    if (contacts.length === 0) {
        return <p>Actualmente no existe ningun responsable</p>
    }


    return (
        <div>
            <div className='mt-4 mb-2 grid grid-cols-5 p-2 gap-x-3 items-center justify-between px-4 bg-slate-400/20 rounded-lg gap-x-3'>
                <p>Nombre</p>
                <p>Cargo</p>
                <p>Código Colaborador</p>
                <p>Función</p>
                <p className='text-right'>Contactos</p>

            </div>

            {contacts.map((contact) => (
                <div key={contact.id}>
                    <div className='grid items-center justify-between grid-cols-5 px-4 gap-x-3'>
                        <p>{contact.name}</p>
                        <p>{contact.role}</p>
                        <p>{contact.code}</p>
                        <p>{contact.function}</p>
                        <div className='flex items-center justify-end gap-x-6'>
                            <a href={`telto: ${contact.role}`} target="_black"><Phone className="w-4 h-4" /> </a>
                            <a href={`mailto: ${contact.name}`} target="_black"><Mail className="w-4 h-4" /> </a>

                        </div>

                    </div>
                    <Separator className='my-3'/>
                </div>
            ))}
        </div>
    )
}