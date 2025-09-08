export interface IBaseUser {
  email: string;
  password: string;
  tel: string;
  accepted_term_of_service?: boolean;
  accepted_pdpa?: boolean;
  accepted_cookie_tracking?: boolean;
}

export interface ICustomer extends IBaseUser {
  firstname: string;
  lastname?: string;
}

export interface IDriver extends IBaseUser {
  firstname: string;
  lastname?: string;
  vehicle: string;
  licence: string;
  fee_rate?: number;
}

export interface IRestaurant extends IBaseUser {
  name: string;
  location: string;
  detail?: string;
  fee_rate?: number;
}
