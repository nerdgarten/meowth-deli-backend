import jwt from "jsonwebtoken";

import { IJwtData } from "@/types/auth/jwt";
import { Role } from "@/types/role";

export function signJwt(id: number, email: string, role: Role): string {
  const payload = { id, email, role };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "48h",
  });
  return token;
}

export function verifyJwt(token: string): IJwtData {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as IJwtData;

  return decoded;
}
