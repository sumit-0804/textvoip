import { Menu, Users } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from "@/components/ui/button";
import { NavigationSideBar } from "@/components/navigation/navigationSidebar";
import ServerSidebar from "@/components/server/serverSidebar";
import ServerSidebarRight from "@/components/server/serverSidebarRight ";

export const MobileToggle = ({ serverId, side }: { serverId: string, side: "left" | "right" }) => {

    return (
        side === "left"
            ?
            (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant='ghost' size='icon' className="md:hidden ml-2">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={side} className="p-0 flex gap-0">
                        <div className="w-[72px]">
                            <NavigationSideBar />
                        </div>
                        <ServerSidebar serverId={serverId} />
                    </SheetContent>
                </Sheet>
            ) : (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant='ghost' size='icon' className=" ml-2">
                            <Users />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={side} className="p-0 flex gap-0">
                        <ServerSidebarRight serverId={serverId} />
                    </SheetContent>
                </Sheet>
            )
    );
}