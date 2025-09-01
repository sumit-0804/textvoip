import { NavigationSideBar } from "@/components/navigation/navigationSidebar";

const MainLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full">
            {/* Navigation sidebar - always show, but adjust for mobile */}
            <div className="flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSideBar />
            </div>
            {/* Main content - always has left padding for navigation */}
            <main className="pl-[72px] h-full">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;