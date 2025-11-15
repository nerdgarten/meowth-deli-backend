import { Role } from "@/types/role";

export interface IJwtData {
  id: number;
  email: string;
  role: Role;
}
