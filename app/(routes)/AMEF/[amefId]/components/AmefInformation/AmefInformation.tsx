import { Settings, User } from "lucide-react";
import { AmefInformationProps } from "./AmefInformation.types";
import Image from "next/image";
import { AmefForm } from "../AmefForm";



import { Profiler } from "react";

export function AmefInformation(props: AmefInformationProps) {

    const { amef } = props

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 lg:grid-rows-[auto,auto] lg:gap-x-10 gap-y-4 lg:grid-areas-[ 'amef']">
            {/* Amef */}
            <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 lg:col-start-1 lg:row-span-2">
                <AmefForm amef={amef} />
            </div>
        </div>
    )
}