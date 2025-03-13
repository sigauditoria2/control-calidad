"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import { FormTool } from "./FormTool"



export function NewTool(){

    const [open, setOpen] = useState(false)

    return(

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Información
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogDescription>Los instrumentos de esta orden fueron agregados en la creación de la misma</DialogDescription>
                </DialogHeader>
                {/*<FormTool setOpen={setOpen}/>*/}
            </DialogContent>

        </Dialog>

    )
}