import { Router } from "express";

export default interface Route {
    auth?: boolean;
    rateLimit?: {
        timePeriod: number;
        max: number;
    }
    router: () => Router;
}