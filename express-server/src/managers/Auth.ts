import AuthManager from "@/types/manager/AuthManager";
import { PrismaClient, Session, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

module.exports = (db: PrismaClient): AuthManager => {
    const auth: any = {}

    auth.getUserFromToken = async (token: string): Promise<User | undefined> => {
        const session = await db.session.findFirst({
            where: {
                token: token,
                expiresAt: {
                    gt: new Date()
                }
            },
            select: {
                user: true
            }
        });
        return session?.user;
    }

    auth.getToken = (req: Request): String => {
        return req.cookies.access_token;
    }

    auth.setToken = (res: Response, token: string) => {
        res.cookie('access_token', token, { 
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
        });
    }

    auth.deleteSession = async (req: Request) => {
        const token = auth.getToken(req);
        if(token)
            await db.session.deleteMany({
                where: {
                    token: token
                }
            });
    }
    auth.deleteAllSessions = async (userId: string) => {
        await db.session.deleteMany({
            where: {
                userId: userId
            }
        });
    }

    auth.isTokenValid = async (token: string): Promise<Boolean> => {
        var session = await db.session.findFirst({
            where: {
                token: token,
                expiresAt: {
                    gt: new Date()
                }
            },
        });
        return session != null;
    }

    auth.generateNewSession = async (userId: string, ipAddress: string, device: string): Promise<Session> => {
        const token: string = jwt.sign({ userId }, process.env.JWT_SECRET);
        const session = await db.session.create({
            data: {
                userId,
                ipAddress,
                device,
                token: token,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days,
            },
        });
        return session;
    }

    auth.getUserFromCredentials = async (type: "googleId" | "facebookId", id: string): Promise<User | undefined> => {
        const credential = await db.credential.findFirst({
            where: {
                [type]: id
            },
            select: {
                user: true
            }
        });
        return credential?.user;
    }

    auth.ensureAuthentication = async (req: Request, res: Response, next: NextFunction) => {
        const token = auth.getToken(req);

        if(token == null) return res.status(401).json({ error: "Unauthenticated" });

        return jwt.verify(token, process.env.JWT_SECRET, async (err: any, data: any) => {
            if(err) return res.status(401).json({ error: "Invalid access token" });

            if(!await auth.isTokenValid(token)) return res.status(401).json({ error: "Session has expired" });

            const user: User = auth.getUserFromToken(token);
            if(user == null) return res.status(401).json({ error: "No user found corresponding to access token" });

            // @ts-ignore
            req.user = user;
            // @ts-ignore
            req.userId = data.userId;
            return next();
        });
    }

    auth.forwardAuthentication = async (req: Request, res: Response, next: NextFunction) => {
        const token = auth.getToken(req);

        if(token == null) return next();

        return jwt.verify(token, process.env.JWT_SECRET, async (err: any, data: any) => {
            if(err) return next();
            if(!await auth.isTokenValid(token)) return next();
            return res.redirect("/");
        });
    }



    return auth;
}