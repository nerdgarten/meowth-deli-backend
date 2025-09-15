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
