import UserManager from "@/types/manager/UserManager";
import NewUser from "@/types/users/NewUser";
import { Credential, PrismaClient, User } from "@prisma/client"

module.exports = (db: PrismaClient): UserManager => {
    const users: any = {};

    users.createUser = async (newUser: NewUser, type: string, id: string): Promise<User | null> => {
        const credential: Credential | null = await db.credential.findFirst({
            where: {
                [type]: id
            },
        });
        if (credential) return null;
        return await db.user.create({
            data: {
                email: newUser.email,
                displayName: newUser.displayName,
                avatarUrl: newUser.avatarUrl,
                credential: {
                    create: {
                        [type]: id
                    }
                },
                settings: {
                    create: {
                        allowMail: false
                    }
                }
            }
        });
    }

    return users;
}