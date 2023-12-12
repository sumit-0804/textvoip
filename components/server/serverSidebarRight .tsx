import { redirect } from "next/navigation";
import { memberRole } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "@/components/server/serverSection";
import { ServerMember } from "./serverMember";
import { MemberSearch } from "./memberSearch";


interface ServerSidebarRightProps {
    serverId: string;
}


const roleIconMap = {
    [memberRole.GUEST]: null,
    [memberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [memberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,


}

const ServerSidebarRight = async ({
    serverId
}: ServerSidebarRightProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect('/');
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    });

    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if (!server) {
        return redirect('/');
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;



    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <MemberSearch
                        data={[
                            {
                                label: 'Members',
                                type: 'member',
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {members.map((member) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>

                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

export default ServerSidebarRight;