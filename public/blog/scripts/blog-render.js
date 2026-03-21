(function () {
  const BLOG_CONFIG_URL = '/blog/blogs/master_blog_config.json';
  const blogRoot = document.getElementById('blog-content');
  const blogHeader = document.getElementById('blog-header');

  function getSlugFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    return slug ? slug.trim() : '';
  }

  function setMetaDescription(content) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = content;
  }

  function setBlogSeo(blog) {
    const title = blog.title || 'Blog';
    const description = blog.description || 'Read this article.';
    document.title = `${title} | FaltuFun Blog`;
    setMetaDescription(description);
  }

  function renderHeader(blog) {
    if (!blogHeader) {
      return;
    }

    const safeTitle = blog.title || 'Untitled';
    const safeDate = blog.date || '';
    const safeDescription = blog.description || '';

    blogHeader.innerHTML = `
      <h1 class="blog-title">${safeTitle}</h1>
      <p class="blog-meta">${safeDate}</p>
      <p class="blog-summary">${safeDescription}</p>
    `;
  }

  function renderError(message) {
    document.title = 'Blog not found | FaltuFun Blog';
    setMetaDescription(message);

    if (blogHeader) {
      blogHeader.innerHTML = '<h1 class="blog-title">Blog not found</h1>';
    }

    if (blogRoot) {
      blogRoot.innerHTML = `<div class="blog-state blog-state-error">${message}</div>`;
    }
  }

  async function fetchBlogConfig() {
    const response = await fetch(BLOG_CONFIG_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Unable to fetch blog config (${response.status})`);
    }

    const blogs = await response.json();
    if (!Array.isArray(blogs)) {
      throw new Error('Invalid blog config format. Expected an array.');
    }

    return blogs;
  }

  async function fetchMarkdownContent(fileName) {
    const response = await fetch(`/blog/blogs/${fileName}`, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Unable to fetch markdown file (${response.status})`);
    }

    return response.text();
  }

  async function initBlog() {
    if (!blogRoot) {
      return;
    }

    const slug = getSlugFromUrl();
    if (!slug) {
      renderError('Blog not found. Missing or invalid slug.');
      return;
    }

    try {
      const blogs = await fetchBlogConfig();
      const blog = blogs.find(function (item) {
        return item.slug === slug;
      });

      if (!blog || !blog.file) {
        renderError('Blog not found. The requested post does not exist.');
        return;
      }

      const markdown = await fetchMarkdownContent(blog.file);
      if (!window.marked || typeof window.marked.parse !== 'function') {
        throw new Error('marked.js is required but not loaded.');
      }

      const html = window.marked.parse(markdown);
      setBlogSeo(blog);
      renderHeader(blog);
      blogRoot.innerHTML = html;
    } catch (error) {
      console.error(error);
      renderError('Blog not found or failed to load. Please try again later.');
    }
  }

  initBlog();
})();
