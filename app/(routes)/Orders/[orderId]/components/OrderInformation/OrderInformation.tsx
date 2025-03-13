import { Settings, User } from "lucide-react";
import { OrderInformationProps } from "./OrderInformation.types";
import Image from "next/image";
import { OrderForm } from "../OrderForm";
import { NewContact } from "../NewContact";
import { ListContacts } from "../ListContacts";

import { NewTool } from "../NewTool";
import { ListTools } from "../ListTools";
import { Profiler } from "react";

export function OrderInformation(props: OrderInformationProps) {

    const { order } = props

    return (
<div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto,auto] lg:gap-x-10 gap-y-4 lg:grid-areas-[ 'order responsables' 'order tools' ]">
    {/* Orden */}
    <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 lg:col-start-1 lg:row-span-2">
        <OrderForm order={order} />
    </div>

    {/* Responsables */}
    <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 h-min lg:col-start-2 lg:row-start-1">
        <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
                <User className="w-5 h-5" />
                Responsables
            </div>
            <div>
                <NewContact />
            </div>
        </div>
        <ListContacts order={order} />
    </div>

    {/* Instrumentos - Justo debajo de Responsables */}
    <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 h-min lg:col-start-2 lg:row-start-2">
        <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
                <Settings className="w-5 h-5" />
                Instrumentos
            </div>
            <div>
                <NewTool />
            </div>
        </div>
        <ListTools order={order} />
    </div>
</div>

    )
}