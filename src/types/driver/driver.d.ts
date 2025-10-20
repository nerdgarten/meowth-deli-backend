import { OrderStatus } from "@/generated/prisma/enums";

export interface DriverWhereClause {
    driver_id?: number;
    status?: OrderStatus;
}