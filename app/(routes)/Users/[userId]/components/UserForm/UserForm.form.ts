import { z } from "zod";

export const formSchema = z.object({

    name: z.string().min(2),
    rol: z.string().min(2),
    code: z.string().min(2),
    function: z.string().min(2)
})