import type Route from "@/types/Route";
import type Server from "@/types/Server";
import GoogleUser from "@/types/users/GoogleUser";
import { Session } from "@prisma/client";
import axios from "axios";
import type { Request, Response } from "express";

const querystring = require('querystring');
const { google } = require('googleapis');
const router = require("express").Router();

function getGoogleAuthUrl() {

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
}

module.exports = (server: Server): Route => {

    const googleURL = getGoogleAuthUrl();
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    async function getGoogleUser(code: string): Promise<GoogleUser | null> {
        try {
            const { tokens } = await client.getToken(code);
            const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,{
                headers: {
                    Authorization: `Bearer ${tokens.id_token}`,
                },
            })
            .then((res) => res.data);
        
            return googleUser;
        } catch (error) {
            return null;
        }
    }

    return {
        rateLimit: {
            max: 5,
            timePeriod: 120,
        },
        router: () => {
            router.get("/", server.authManager.forwardAuthentication, (req: Request, res: Response) => {
                return res.redirect(googleURL);
            });

            router.get("/callback", server.authManager.forwardAuthentication, async (req: Request, res: Response) => {
                const { code }= req.query;
                if (!code) return res.redirect("/login");
                const googleUser = await getGoogleUser(code as string);
                if(!googleUser) return res.redirect("/login");

                var user = await server.authManager.getUserFromCredentials("googleId", googleUser.id);
                if(!user) {
                    // Create user
                    user = await server.userManager.createUser({
                        email: googleUser.email,
                        displayName: googleUser.name,
                        avatarUrl: googleUser.picture,
                    }, "googleId", googleUser.id);
                }
                if(!user) return res.redirect("/login");

                var ip: string = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || "") as string
                // @ts-ignore
                var device = req.device.type || req.headers['user-agent'] || "";
                const session: Session = await server.authManager.generateNewSession(user.id, ip, device);
                server.authManager.setToken(res, session.token);

                return res.redirect("/");
            });
            return router;
        }
    }
}