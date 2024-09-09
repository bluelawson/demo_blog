import { ReactNode } from "react";
import ManagementSidebar from "../components/ManagementSidebar"; // サイドバーを適切にインポート
interface LayoutProps {
  children: ReactNode; // ReactNode型に変更
}

export default function ManagementLayout({ children }: LayoutProps) {
  return (
    <div className="md:flex">
      <div className="w-full md:w-1/6 h-screen">
        <ManagementSidebar />
      </div>
      <div className="w-full md:w-5/6 ">{children}</div>
    </div>
  );
}
