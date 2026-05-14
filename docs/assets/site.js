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
    status.innerHTML = '<p style="color:var(--text-muted);margin-bottom:16px;">No releases published yet.</p><a class="btn btn-secondary" href="install.html#source">Build from source</a>';
  }
}
loadLatestRelease();
