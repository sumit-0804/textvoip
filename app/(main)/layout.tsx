import { NavigationSideBar } from "@/components/navigation/navigationSidebar";

const MainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full flex">
      {/* Sidebar - hidden on mobile, visible on md+ */}
      <div className="md:flex sm:hidden h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSideBar />
      </div>

      {/* Main content - full on mobile, padded only on md+ */}
      <main className="flex-1 h-full md:pl-[72px]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
