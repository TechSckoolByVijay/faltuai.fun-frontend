import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

const BLOG_CONFIG_URL = '/blog/blogs/master_blog_config.json';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString || '';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
};

const BlogsPage = () => {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadBlogs = async () => {
      try {
        const response = await fetch(BLOG_CONFIG_URL, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`Unable to fetch blogs (${response.status})`);
        }

        const payload = await response.json();
        if (!Array.isArray(payload)) {
          throw new Error('Invalid blog config format.');
        }

        const sortedBlogs = [...payload].sort(
          (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );

        if (!ignore) {
          setBlogs(sortedBlogs);
        }
      } catch {
        if (!ignore) {
          setBlogs([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">All Blogs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Explore every published engineering article.</p>
          </div>
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="inline-flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            ← Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-600 dark:text-gray-400">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-red-300 dark:border-red-700 p-8 text-center text-red-600 dark:text-red-300">
            No blogs found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
            {blogs.map((blog) => (
              <a
                key={blog.slug}
                href={`/blog/blog.html?slug=${encodeURIComponent(blog.slug)}`}
                className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                {blog.cover ? (
                  <img src={blog.cover} alt={`${blog.title} cover`} className="w-full h-48 object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800" />
                )}
                <div className="p-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatDate(blog.date)}</p>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{blog.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {blog.description || 'Read this engineering article.'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogsPage;
