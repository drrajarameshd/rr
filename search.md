---
layout: default
title: Search
permalink: /search/
---

<section class="container" aria-labelledby="search-heading">
  <h2 id="search-heading">Search</h2>

  <form action="{{ '/search/' | relative_url }}" method="get" role="search" class="search-form">
    <label class="sr-only" for="q">Search posts</label>
    <input id="q" name="q" type="search" placeholder="Search diabetes, thyroid, fever…" value="{{ page.q | default: '' }}" class="input">
    <button class="btn btn--primary" type="submit">Search</button>
  </form>

  <div id="search-status" aria-live="polite" style="color:var(--muted)"></div>
  <ul id="results" class="post-list" aria-label="Search results"></ul>
</section>

<!-- Dependencies -->
<script src="{{ '/assets/js/lunr.min.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/search.js' | relative_url }}" defer></script>
