
import { CustomIcon } from "@/components/CustomIcon"
import { BarChart } from "lucide-react"
import { GraphicsSuscribers } from "../GraphicSuscribers"


export function Salesdistributor() {
    return (
        <div className="shadow-sm bg-backgrupund rounded-lg p-5">
            <div className="flex gap-x-2 items-center">
                <CustomIcon icon={BarChart} />
                <p className="text-xl">Sales Distributor</p>
            </div>
            <GraphicsSuscribers/>

        </div>
    )
}