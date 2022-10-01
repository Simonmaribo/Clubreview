import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import NewUser from "../users/NewUser";


export default interface UserManager {
    createUser(newUser: NewUser, type: string, id: string): Promise<User | null>
}