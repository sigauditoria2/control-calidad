import { Settings, User } from "lucide-react";
import { UserInformationProps } from "./UserInformation.types";
import Image from "next/image";
import { UserForm } from "../UserForm";

import { Profiler } from "react";

export function UserInformation(props: UserInformationProps) {

    const { user } = props

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto,auto] lg:gap-x-10 gap-y-4 lg:grid-areas-[ 'order responsables' 'order tools' ]">
            {/* Orden */}
            <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 lg:col-start-1 lg:row-span-2">
                <UserForm user={user} />
            </div>

        </div>

    )
}