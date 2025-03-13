import {z} from "zod";

export const formSchema = z.object({
    name: z.string().min(2).max(100),
    role: z.string(),
    code: z.string(),
    function: z.string(),
});
