(function () {
  // Get query (?q=) from URL
  function getQuery() {
    const p = new URLSearchParams(window.location.search);
    return (p.get('q') || '').trim();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"'`=\/]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[c]));
  }

  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const terms = q.split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!terms.length) return escapeHtml(text);
    const rx = new RegExp('(' + terms.join('|') + ')', 'ig');
    return escapeHtml(text).replace(rx, '<mark>$1</mark>');
  }

  async function run() {
    const qInput = document.querySelector('input#q');
    const q = getQuery();
    if (qInput && !qInput.value) qInput.value = q;

    const status = document.getElementById('search-status');
    const list = document.getElementById('results');
    if (!list) return;

    if (!q) {
      status.textContent = 'Type above and press Enter to search all posts.';
      list.innerHTML = '';
      return;
    }

    status.textContent = 'Searching…';

    // Fetch index
    const res = await fetch('{{ "/search.json" | relative_url }}', {cache: 'no-store'});
    const data = await res.json();

    // Build lunr index
    const idx = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('tags',  { boost: 6 });
      this.field('excerpt', { boost: 3 });
      this.field('content');
      data.docs.forEach(doc => this.add(doc), this);
    });

    // Query with tolerance: boost exact, fallback to partials
    let results = idx.search(q + ' ^' + q + ' ' + q.split(/\s+/).map(t => t + '*').join(' '));
    const hits = results.map(r => data.docs[parseInt(r.ref, 10)]);

    // Render
    if (!hits.length) {
      status.textContent = `No matches for “${q}”.`;
      list.innerHTML = '';
      return;
    }

    status.textContent = `${hits.length} result${hits.length>1?'s':''} for “${q}”`;
    const html = hits.slice(0, 50).map(post => {
      const title = highlight(post.title, q);
      const desc  = highlight(post.excerpt || '', q);
      const date  = new Date(post.date).toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'});
      return `
        <li class="post-item" itemscope itemtype="http://schema.org/BlogPosting">
          <div class="post-meta">
            <h3 class="post-link" itemprop="headline">
              <a href="${post.url}">${title}</a>
            </h3>
            <div class="meta"><time datetime="${post.date}" itemprop="datePublished">${date}</time></div>
            <p class="excerpt" itemprop="description">${desc}</p>
            <p style="margin-top:.55rem;"><a class="btn btn--primary" href="${post.url}">Read more</a></p>
          </div>
        </li>`;
    }).join('');
    list.innerHTML = html;
  }

  // Run when Lunr loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();
