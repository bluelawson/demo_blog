import { Menu } from '@/types';

export const sidebarMenus: Menu[] = [
  { id: 1, name: '記事投稿', link: '/dashboard/articles/new' },
  { id: 2, name: '記事一覧', link: '/dashboard/articles' },
  { id: 3, name: 'アカウント設定', link: '/dashboard/account' },
];

export const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;
