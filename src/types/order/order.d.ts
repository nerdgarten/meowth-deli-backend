import { OrderStatus } from "@/generated/prisma/enums";

export interface OrderWhereClause {
    id?: number;
    driver_id?: number;
    status?: OrderStatus;
}