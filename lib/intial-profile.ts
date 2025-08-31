import { currentUser, auth } from "@clerk/nextjs/server"; // Updated import
import { redirect } from "next/navigation";
import { db } from "./db";

export const intialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        // In v6, get redirectToSignIn from auth()
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    if (profile) return profile;

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageURL: user.imageUrl, // Updated property name from imageURL
            email: user.emailAddresses[0].emailAddress
        }
    });

    return newProfile;
};