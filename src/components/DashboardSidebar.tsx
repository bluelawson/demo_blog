'use client';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { sidebarMenus } from '@/utils/constants';

import SidebarMenu from './SidebarMenu';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [currentPagePath, setCurrentPagePath] = useState<string>('');

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
