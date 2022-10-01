import Route from "@/types/Route";
import type Server from "@/types/Server";
import type { Request, Response } from "express";

const router = require("express").Router();

module.exports = (server: Server): Route => {
    return {
        auth: true,
        rateLimit: {
            max: 5,
            timePeriod: 60,
        },
        router: () => {
            router.get("/", async (req: Request, res: Response) => {
                await server.authManager.deleteSession(req);
                return res.clearCookie("access_token").redirect("/");
            });
            
            return router;
        }
    }
}