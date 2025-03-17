import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {MedidasEnsayo, AccionImplementada, Prisma } from "@prisma/client";

type CatalogModel = {
    findMany: (args: { orderBy: { descripcion: 'asc' | 'desc' } }) => Promise<any[]>;
    create: (args: { data: { descripcion: string } }) => Promise<any>;
};

const getModel = (type: string): CatalogModel | null => {
    switch (type) {
        case 'medidasEnsayo':
            return db.medidasEnsayo;
        case 'accionImplementada':
            return db.accionImplementada;
        default:
            return null;
    }
};

export async function GET(
    req: Request,
    { params }: { params: { type: string } }
) {
    try {
        const { type } = params;
        const model = getModel(type);
        
        if (!model) {
            console.error(`Tipo de catálogo inválido: ${type}`);
            return new NextResponse(
                JSON.stringify({ error: "Tipo de catálogo inválido" }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const items = await model.findMany({
            orderBy: {
                descripcion: 'asc'
            }
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("[CATALOG_GET]", error);
        return new NextResponse(
            JSON.stringify({ error: "Error interno del servidor" }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: { type: string } }
) {
    try {
        const { type } = params;
        const model = getModel(type);

        if (!model) {
            console.error(`Tipo de catálogo inválido: ${type}`);
            return new NextResponse(
                JSON.stringify({ error: "Tipo de catálogo inválido" }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const data = await req.json();
        if (!data.descripcion) {
            return new NextResponse(
                JSON.stringify({ error: "Descripción requerida" }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const item = await model.create({
            data: {
                descripcion: data.descripcion
            }
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("[CATALOG_POST]", error);
        return new NextResponse(
            JSON.stringify({ 
                error: "Error interno del servidor",
                details: error instanceof Error ? error.message : "Error desconocido"
            }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
} 