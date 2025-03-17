import * as z from "zod";

export const amefFormSchema = z.object({

    order: z.string().min(2),
    especificacionProceso: z.string().min(2),
    procesoProduccion: z.string().min(2),                     
    fig: z.string().min(2),                        
    proyecto: z.string().min(2),                    
    cliente: z.string().min(2),                    
    elemento: z.string().min(1),                   
    fechaDeteccion: z.string().min(2),              
    nivelInspeccion: z.string().min(2),
    planMuestra: z.string().min(2),            
    modoFallo: z.string().min(2),                   
    efecto: z.string().min(2),                      
    causaModoFallo: z.string().min(2),              
    medidasEnsayo: z.string().min(2),               
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
    npr: z.string(),                         
    estadoNPR: z.string(),                      
    codigoColaboradorCT: z.string().min(2),         
    codigoResponsableInspeccion: z.string().min(2), 
    accionImplementada: z.string().min(2),          
    fechaValidacionCorreccion: z.string().min(2),   
    costoReproceso: z.string().min(2)              

})

export type AmefFormValues = z.infer<typeof amefFormSchema>