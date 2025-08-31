import { auth } from "@clerk/nextjs/server"; // Updated import path

import { db } from "@/lib/db";

export const currentProfile = async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const profile = await db.profile.findUnique({
            where: {
                userId
            }
        });

        return profile;
    } catch (error) {
        console.log('Error in currentProfile:', error);
        return null;
    }
};