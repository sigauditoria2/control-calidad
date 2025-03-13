import { z } from "zod";

export const formSchema = z.object({

    modoFallo: z.string().min(2),
    codigo: z.string().min(2),
    efecto: z.string().min(2),
    causaModoFallo: z.string().min(2),
    ocurrencia: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 1 && num <= 10;
        }, "Debe ser un número entre 1 y 10"),                  
    gravedad: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 1 && num <= 10;
        }, "Debe ser un número entre 1 y 10"),                    
    deteccion: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 1 && num <= 10;
        }, "Debe ser un número entre 1 y 10"),
    npr: z.string().min(2),
    estadoNPR: z.string().min(2)


})