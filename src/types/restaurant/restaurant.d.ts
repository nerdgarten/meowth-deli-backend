export interface RestaurantWhereClause {
  verification_status?: VerificationStatus;
  is_available?: boolean;
  name?: {
    contains?: string;
    mode?: "insensitive";
  };
  location?: {
    contains?: string;
    mode?: "insensitive";
  };
  id?: number;
  AND?: RestaurantWhereClause[];
  OR?: RestaurantWhereClause[];
}
export interface RestaurantOrderByClause {
  id?: "asc" | "desc";
  name?: "asc" | "desc";
  created_at?: "asc" | "desc";
  updated_at?: "asc" | "desc";
}
