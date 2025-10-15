export interface FileStatus {
    files: {
        filename: string;
        uploadedAt: string;
        status: "pending" | "verified" | "rejected";
        verifiedAt?: string;
        verifiedBy?: string;
        reason?: string;
    }[];
}
export interface FileManagement {
    userFiles: {
        id: string;
        is_verified_decided: "yes" | "no";
        status_path: string;
    }[];
}