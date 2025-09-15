import { UserRole } from "@/types/role";
import jwt from "jsonwebtoken";
import { IJwtData } from "@/types/auth/jwt";

export function signJwt(id: number, email: string, role: UserRole): string {
  const payload = { id, email, role };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "48h",
  });
  return token;
}

export function verifyJwt(token: string): IJwtData {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as unknown;

  return decoded as IJwtData;
}
