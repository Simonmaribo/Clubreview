import { Session, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";


export default interface AuthManager {
    getUserFromToken(token: string): Promise<User | undefined>;
    getToken(req: Request): String;
    setToken(res: Response, token: string): void;
    deleteSession(req: Request): void;
    deleteAllSessions(userId: string): void;
    isTokenValid(token: string): Promise<Boolean>;
    generateNewSession(userId: string, ipAddress: string, device: string): Promise<Session>;
    getUserFromCredentials(type: "googleId" | "facebookId", id: string): Promise<User | null>;
    ensureAuthentication(req: Request, res: Response, next: NextFunction): Promise<any>;
    forwardAuthentication(req: Request, res: Response, next: NextFunction): Promise<any>;
}