export const USER_ROLES = ["ADMIN", "ATTENDANT"] as const;

export type UserRole = (typeof USER_ROLES)[number];
