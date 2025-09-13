export enum AdminVerificationStatus {
  PENDING = "pending",
  APPROVED = "approved", 
  REJECTED = "rejected"
}

export enum VerificationType {
  RESTAURANT = "restaurant",
  DRIVER = "driver"
}

export type AdminVerificationStatusType = keyof typeof AdminVerificationStatus;
export type VerificationTypeType = keyof typeof VerificationType;
