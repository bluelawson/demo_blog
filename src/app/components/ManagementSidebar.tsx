"use client";
import React, { useState } from "react";
import Link from "next/link";

type Menu = {
  id: number;
  name: string;
  link: string;
};

const ManagementSidebar = () => {
  const [selectedMenuId, setSelectedMenuId] = useState<number>(2);
  const sidebarMenus: Menu[] = [
    { id: 1, name: "ホーム", link: "/management" },
    { id: 2, name: "記事一覧", link: "/management/articles" },
    { id: 3, name: "アカウント設定", link: "/management/myPage" },
    { id: 4, name: "アクセス解析", link: "#" },
  ];

  const handleMenuSelect = async (menuId: number) => {
    setSelectedMenuId(menuId);
  };

  return (
    <div className="h-[80%] bg-slate-600">
      <nav className="text-base py-5 my-4">
        {sidebarMenus.map((sidebarMenu) => (
          <div className="ml-1 mr-3 " key={sidebarMenu.id}>
            <Link
              href={sidebarMenu.link}
              className={`block pb-1 pt-6 px-3 ${
                selectedMenuId === sidebarMenu.id ? "bg-slate-500" : ""
              }`}
              onClick={() => handleMenuSelect(sidebarMenu.id)}
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
