import React from "react";
import Link from "next/link";

type Menu = {
  id: number;
  name: string;
  link: string;
};

export default async function ManagementSidebar() {
  const sidebarMenus: Menu[] = [
    { id: 1, name: "ホーム", link: "/management" },
    { id: 2, name: "記事一覧", link: "/management/articles" },
    { id: 3, name: "アカウント設定", link: "/management/myPage" },
    { id: 4, name: "アクセス解析", link: "#" },
  ];
  return (
    <div className="h-[80%] bg-slate-600">
      <nav className="text-base py-5 my-4">
        {sidebarMenus.map((sidebarMenu) => (
          <div
            className="ml-1 mr-3 border-b border-white "
            key={sidebarMenu.id}
          >
            <Link
              href={sidebarMenu.link}
              className="block pb-1 pt-6 px-3 hover:text-gray-300"
            >
              {sidebarMenu.name}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
}
