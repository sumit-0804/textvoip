import { auth } from "@clerk/nextjs/server"; // Updated import

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ServerSidebar from "@/components/server/serverSidebar";
import ServerSidebarRight from "@/components/server/serverSidebarRight ";

const ServerIdLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) => {
    const profile = await currentProfile();

    if (!profile) {
        // In v6, get redirectToSignIn from auth()
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) {
        return redirect('/');
    }

    return (
        <div className="h-full">
            {/* Force sidebar to show - removed hidden md:flex for debugging */}
            <div className="flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full pl-60">
                {children}
            </main>
        </div>
    );
}

export default ServerIdLayout;