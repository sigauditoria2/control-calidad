import {z} from "zod";

export const formSchema = z.object({
    order: z.string().min(2),
    estado: z.string().min(2),
    cliente: z.string().min(2),
    proyecto: z.string().min(2),
    fig: z.string().min(2),
    codigoElemento: z.string().min(1),
    designacion: z.string().min(2),
    codigoAplicable: z.string().min(2),
    centroTrabajo: z.string().min(2),
    qc: z.string().min(2),
    areaInspeccionada: z.string().min(2),
    fechaPlanificada: z.string().min(2),

})