import { Order } from "@prisma/client"
import { Event } from "@prisma/client";

export type CalendarProps ={

orders:Order[];
events: Event[];

}