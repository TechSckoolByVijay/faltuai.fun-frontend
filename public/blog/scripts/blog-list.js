(function () {
  const BLOG_CONFIG_URL = '/blog/blogs/master_blog_config.json';

  const root = document.getElementById('blog-list-root');
  const template = document.getElementById('blog-card-template');

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString || '';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  }

  function createCard(blog) {
    const fragment = template.content.cloneNode(true);

    const card = fragment.querySelector('.blog-card');
    const cover = fragment.querySelector('.blog-card-cover');
    const title = fragment.querySelector('.blog-card-title');
    const description = fragment.querySelector('.blog-card-description');
    const date = fragment.querySelector('.blog-card-date');
    const tags = fragment.querySelector('.blog-card-tags');

    const blogUrl = `/blog/blog.html?slug=${encodeURIComponent(blog.slug)}`;

    card.href = blogUrl;
    card.setAttribute('aria-label', `Read blog: ${blog.title}`);

    if (blog.cover) {
      cover.src = blog.cover;
      cover.alt = `${blog.title} cover`;
      cover.loading = 'lazy';
    } else {
      cover.remove();
    }

    title.textContent = blog.title || 'Untitled';
    description.textContent = blog.description || 'No description available.';
    date.textContent = formatDate(blog.date);

    if (Array.isArray(blog.tags) && blog.tags.length > 0) {
      tags.innerHTML = blog.tags
        .slice(0, 4)
        .map(function (tag) {
          return `<span class="blog-tag">${tag}</span>`;
        })
        .join('');
    } else {
      tags.remove();
    }

    return fragment;
  }

  function renderState(message, isError) {
    root.innerHTML = `<div class="blog-state ${isError ? 'blog-state-error' : ''}">${message}</div>`;
  }

  async function loadBlogs() {
    if (!root || !template) {
      return;
    }

    renderState('Loading blogs...');

    try {
      const response = await fetch(BLOG_CONFIG_URL, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Unable to fetch blog config (${response.status})`);
      }

      const blogs = await response.json();
      if (!Array.isArray(blogs)) {
        throw new Error('Invalid blog config format. Expected an array.');
      }

      blogs.sort(function (a, b) {
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });

      if (blogs.length === 0) {
        renderState('No blogs published yet.');
        return;
      }

      root.innerHTML = '';
      const listFragment = document.createDocumentFragment();

      blogs.forEach(function (blog) {
        listFragment.appendChild(createCard(blog));
      });

      root.appendChild(listFragment);
    } catch (error) {
      console.error(error);
      renderState('Failed to load blogs. Please try again later.', true);
    }
  }

  loadBlogs();
})();
