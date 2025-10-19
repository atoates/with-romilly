// Lightweight Instagram feed loader using Instagram Basic Display API
// Usage: loadInstagramFeed({ containerId: 'instagram-feed', limit: 6 })

async function loadInstagramFeed(options = {}) {
  const {
    containerId = 'instagram-feed',
    limit = 6,
  } = options;

  const container = document.getElementById(containerId);
  if (!container) return;

  const accessToken = (window && window.INSTAGRAM_ACCESS_TOKEN) || '';
  if (!accessToken) {
    // No token available; leave placeholder intact
    console.warn('Instagram feed: No access token provided. Skipping live feed.');
    return;
  }

  try {
    const url = new URL('https://graph.instagram.com/me/media');
    url.searchParams.set('fields', 'id,caption,media_url,permalink,media_type,thumbnail_url,timestamp');
    url.searchParams.set('access_token', accessToken);
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data.data) ? data.data : [];

    if (!items.length) return;

    // Build the grid content
    const html = items.map(item => {
      const isVideo = item.media_type === 'VIDEO';
      const imgSrc = isVideo ? (item.thumbnail_url || item.media_url) : item.media_url;
      const alt = (item.caption || 'Instagram post').replace(/"/g, '&quot;');
      return `
        <a href="${item.permalink}" target="_blank" rel="noopener" class="instagram-post" aria-label="Open Instagram post">
          <img src="${imgSrc}" alt="${alt}" loading="lazy" decoding="async" />
        </a>
      `;
    }).join('');

    // Replace any placeholders with real posts
    container.innerHTML = html;
  } catch (err) {
    console.error('Instagram feed error:', err);
    // Keep placeholder content if fetch fails
  }
}
