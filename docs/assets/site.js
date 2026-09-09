document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal - subtle, 200ms
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  // Active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, #mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.split('/').pop() === path) a.classList.add('active');
  });

  // Mobile menu
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Tabs - consistent interaction pattern
  document.querySelectorAll('.tabs').forEach(tabs => {
    const container = tabs.parentElement;
    const panels = container.querySelectorAll('.tab-panel');
    const buttons = tabs.querySelectorAll('.tab');
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const saved = localStorage.getItem('aether-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const isDark = current === 'dark' ||
        (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('aether-theme', next);
    });
  }

  // Mobile docs sidebar toggle
  const docsToggle = document.querySelector('.docs-mobile-toggle');
  const docsSidebar = document.querySelector('.docs-sidebar');
  const docsOverlay = document.querySelector('.docs-overlay');
  if (docsToggle && docsSidebar) {
    docsToggle.addEventListener('click', () => {
      docsSidebar.classList.toggle('open');
      if (docsOverlay) docsOverlay.classList.toggle('open');
    });
    if (docsOverlay) {
      docsOverlay.addEventListener('click', () => {
        docsSidebar.classList.remove('open');
        docsOverlay.classList.remove('open');
      });
    }
  }

  // Reading progress bar
  const progress = document.querySelector('.reading-progress');
  if (progress) {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Scroll to top button
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Copy buttons on code blocks
  document.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.code-copy')) return;
    const btn = document.createElement('button');
    btn.className = 'code-copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(() => {
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
      });
    });
    pre.appendChild(btn);
  });
});

// Download page: fetch latest release
async function loadLatestRelease() {
  const status = document.getElementById('release-status');
  if (!status) return;
  try {
    const res = await fetch('https://api.github.com/repos/neang-mengseang/Aether/releases/latest');
    if (!res.ok) throw new Error('no release');
    const data = await res.json();
    const date = new Date(data.published_at).toLocaleDateString();
    status.innerHTML = '<h2 style="font-size:24px;margin-bottom:4px;">' + (data.name || 'Latest Release') + '</h2><p style="color:var(--text-muted);">Published ' + date + '</p>';

    const setLink = (id, url) => { const el = document.getElementById(id); if (el) { el.href = url; el.target = '_blank'; el.rel = 'noopener'; } };
    const assets = data.assets || [];
    let win = 'https://github.com/neang-mengseang/Aether/releases', mac = 'https://github.com/neang-mengseang/Aether/releases', lin = 'https://github.com/neang-mengseang/Aether/releases';
    assets.forEach(a => {
      const n = a.name.toLowerCase();
      const u = a.browser_download_url;
      if (n.endsWith('.msi') || n.endsWith('.exe')) win = u;
      else if (n.endsWith('.dmg') || n.endsWith('.pkg')) mac = u;
      else if (n.endsWith('.deb') || n.endsWith('.rpm') || n.endsWith('.flatpak')) lin = u;
    });
    setLink('win-link', win);
    setLink('mac-link', mac);
    setLink('linux-link', lin);
  } catch (e) {
    status.innerHTML = '<p style="color:var(--text-muted);margin-bottom:16px;">No releases published yet.</p><a class="btn btn-secondary" href="download.html#source">Build from source</a>';
  }
}
loadLatestRelease();
