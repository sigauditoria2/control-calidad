import { z } from "zod";

export const formSchema = z.object({

    name: z.string().min(2),
    responsible: z.string().min(2),
    code: z.string().min(2)})