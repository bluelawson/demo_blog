import { API_URL } from '@/utils/constants';

import ArticleList from '../components/ArticleList';

export default async function Home() {
  const res = await fetch(`${API_URL}/api/blog/posts`, { cache: 'no-store' });
  const articles = await res.json();
  return (
    <>
      <ArticleList articles={articles} />
    </>
  );
}
