export const USER_ROLES = ["ADMINISTRATIVE"] as const;

export type UserRole = (typeof USER_ROLES)[number];
