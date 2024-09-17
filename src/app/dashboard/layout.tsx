import { ReactNode } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="md:flex">
      <div className="w-full h-screen md:w-1/6">
        <DashboardSidebar />
      </div>
      <div className="w-full mx-4 my-4 md:w-5/6">{children}</div>
    </div>
  );
}
