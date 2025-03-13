import { Logo } from "@/components/Logo"

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col justify-center h-full items-center'>
            < Logo />
            <h1 className='text-3xl my-2'>
                Bienvenidos al Centro de Datos del Sistema Integrado de Gestión
            </h1>
            <h2 className='text-2xl mb-3'>
                Centro de Datos
            </h2>
            {children}

        </div>
    );
}