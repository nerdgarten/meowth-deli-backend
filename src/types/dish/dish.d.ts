import { Allergy } from "@/types/allergy";

export interface IDish {
  restaurant_id: number;
  name: string;
  allergy: Allergy[];
  price: number;
  detail?: string;
  is_out_of_stock?: boolean;
}

export interface DishWhereClause {
  id?: number;
  restaurant_id?: number;
  name?: {
    contains?: string;
    mode?: "insensitive";
  };
  detail?: {
    contains?: string;
    mode?: "insensitive";
  };
  is_out_of_stock?: boolean;
  price?: {
    gte?: number;
    lte?: number;
    gt?: number;
    lt?: number;
  };
  AND?: DishWhereClause[];
  OR?: DishWhereClause[];
}
