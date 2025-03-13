import {z} from "zod";

export const formSchema = z.object({
    name: z.string().min(2).max(100),
    code: z.string(),
    responsible: z.string()
});
