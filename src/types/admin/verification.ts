import { Role, VerificationStatus } from "@/generated/prisma/client";

export interface AdminVerificationRequest {
  id: number;
  status: VerificationStatus;
}

export interface AdminVerificationQuery {
  status?: VerificationStatus;
}

export type AdminVerificationStatusType = keyof typeof VerificationStatus;