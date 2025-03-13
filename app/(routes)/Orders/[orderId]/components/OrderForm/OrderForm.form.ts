import {z} from "zod";

export const formSchema = z.object({
    order: z.string().min(2),
    estado: z.string().min(2),
    tipoInspeccion: z.string().min(2),
    fechaProgramada: z.string().min(2),
    procesoProduccion: z.string().min(2),
    especificacionProceso: z.string().min(2),
    muestra: z.string().min(1),
    cliente: z.string().min(2),
    fig: z.string().min(2),
    proyecto: z.string().min(2),
    area: z.string().min(2),
    designacion: z.string().min(2),
    norma: z.string().min(2),
    lote: z.string().min(2),
    nivelInspeccion: z.string().min(2),
    planMuestra: z.string().min(2)

})