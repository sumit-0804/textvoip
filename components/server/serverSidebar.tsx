import { redirect } from "next/navigation";
import { channelType, memberRole } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerSearch } from "./serverSearch";
import ServerHeader from "./serverHeader";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "@/components/server/serverSection";
import { ServerChannel } from "./serverChannel";
import { ServerMember } from "./serverMember";


interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [channelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [channelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [channelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
    [memberRole.GUEST]: null,
    [memberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [memberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,


}

const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
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

    const textChannels = server?.channels.filter((channel) => channel.type === channelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === channelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === channelType.VIDEO);
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if (!server) {
        return redirect('/');
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;



    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
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
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={channelType.TEXT}
                            role={role}
                            label="Text Channels"
                        />
                        <div className="space-y-[2px]">
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={channelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                        <div className="space-y-[2px]">
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>

                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={channelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                        <div className="space-y-[2px]">

                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}

                        </div>
                    </div>
                )}
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

export default ServerSidebar;