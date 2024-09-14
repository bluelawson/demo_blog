import { ReactNode } from "react";
import DashboardSidebar from "../components/DashboardSidebar"; // サイドバーを適切にインポート
interface LayoutProps {
  children: ReactNode; // ReactNode型に変更
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="md:flex">
      <div className="w-full md:w-1/6 h-screen">
        <DashboardSidebar />
      </div>
      <div className="w-full md:w-5/6 mx-4 my-4">{children}</div>
    </div>
  );
}
