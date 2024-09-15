import Link from "next/link";
import { Menu } from "@/types";

type SidebarMenuProps = {
  sidebarMenus: Menu[];
  currentPagePath: string;
};

export default function SidebarMenu({
  sidebarMenus,
  currentPagePath,
}: SidebarMenuProps) {
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
}
