import type UserManager from '@/types/manager/UserManager';
import type AuthManager from '@/types/manager/AuthManager';
import { PrismaClient } from "@prisma/client";

export default interface Server {
    database: PrismaClient;
    environment: 'development' | 'production';
    authManager: AuthManager;
    userManager: UserManager;
}