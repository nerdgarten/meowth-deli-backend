export type UserRole = "admin" | "customer" | "restaurant" | "driver";

export interface CustomerType {
  email: string;
  password: string;
  firstname: string;
  lastname?: string;
  tel: string;
  accepted_term_of_service?: boolean;
  accepted_pdpa?: boolean;
  accepted_cookie_tracking?: boolean;
}

export interface DriverType {
  email: string;
  password: string;
  firstname: string;
  lastname?: string;
  tel: string;
  vehicle: string;
  licence: string;
  fee_rate?: number;
  accepted_term_of_service?: boolean;
  accepted_pdpa?: boolean;
  accepted_cookie_tracking?: boolean;
}

export interface RestaurantType {
  email: string;
  password: string;
  name: string;
  tel: string;
  location: string;
  detail?: string;
  fee_rate?: number;
  accepted_term_of_service?: boolean;
  accepted_pdpa?: boolean;
  accepted_cookie_tracking?: boolean;
}
