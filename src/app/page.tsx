import { API_URL } from '@/utils/constants';

import ArticleList from '../components/ArticleList';

export default async function Home() {
  let articles = [];

  try {
    const response = await fetch(`${API_URL}/api/blog/posts`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Status Code is ${response.status}`);
    }

    articles = await response.json();
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      {articles.length > 0 ? (
        <ArticleList articles={articles} />
      ) : (
        <p>No articles found.</p>
      )}
    </>
  );
}
