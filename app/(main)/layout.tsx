import { NavigationSideBar } from "@/components/navigation/navigationSidebar";

const MainLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full">
            {/* Force navigation to show - removed hidden md:flex for debugging */}
            <div className="flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSideBar />
            </div>
            <main className="pl-[72px] h-full">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;