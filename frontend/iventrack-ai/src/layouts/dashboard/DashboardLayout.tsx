import { DashHeader } from "@/components/dashboard/DashHeader";
import { DashSideBar } from "@/components/dashboard/DashSideBar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashSideBar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
