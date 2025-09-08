import { UserRole } from "../auth.type";

export interface SignInBody {
  email: string;
  password: string;
  role: UserRole;
}
