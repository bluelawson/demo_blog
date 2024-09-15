"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { sidebarMenus } from "@/utils/constants";
import SidebarMenu from "./SidebarMenu";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [currentPagePath, setCurrentPagePath] = useState<string>("");

  useEffect(() => {
    setCurrentPagePath(pathname);
  }, [pathname]);

  return (
    <SidebarMenu
      sidebarMenus={sidebarMenus}
      currentPagePath={currentPagePath}
    />
  );
};

export default DashboardSidebar;
