import type Server from "@/types/Server";
import type Task from "@/types/Task";

module.exports = (server: Server): Task => {
    return {
        name: "Sessions - Garbage Collector",
        enabled: true,
        cron: "0 0 * * *",
        run: async () => {
            const sessions = await server.database.session.findMany({
                where: {
                    expiresAt: {
                        lt: new Date()
                    }
                }
            });
            for (const session of sessions) {
                await server.database.session.delete({
                    where: {
                        id: session.id
                    }
                });
            }
        }
    }
};