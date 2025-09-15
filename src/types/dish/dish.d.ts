export interface IDish {
  restaurant_id: number;
  name: string;
  allergy?: string;
  price: number;
  detail?: string;
  is_out_of_stock?: boolean;
}
