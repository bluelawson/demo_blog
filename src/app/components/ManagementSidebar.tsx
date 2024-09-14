"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Menu = {
  id: number;
  name: string;
  link: string;
};

const ManagementSidebar = () => {
  const sidebarMenus: Menu[] = [
    { id: 1, name: "記事投稿", link: "/management/articles/new" },
    { id: 2, name: "記事一覧", link: "/management/articles" },
    { id: 3, name: "アカウント設定", link: "/management/myPage" },
    { id: 4, name: "アクセス解析", link: "#" },
  ];
  const pathname = usePathname();

  const [currentPagePath, setCurrentPagePath] = useState<string>("");

  useEffect(() => {
    setCurrentPagePath(pathname);
  }, [pathname]);

  return (
    <div className="h-[80%] bg-slate-600">
      <nav className="py-5 my-4 text-base">
        {sidebarMenus.map((sidebarMenu) => (
          <div className="ml-1 mr-3 " key={sidebarMenu.id}>
            <Link
              href={sidebarMenu.link}
              className={`block pb-1 pt-6 px-3 ${
                currentPagePath === sidebarMenu.link ? "bg-slate-500" : ""
              }`}
            >
              {sidebarMenu.name}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ManagementSidebar;
