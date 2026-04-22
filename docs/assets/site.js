
document.addEventListener('DOMContentLoaded', () => {
  // scroll reveal
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  // active nav
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, #mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.split('/').pop() === path) a.classList.add('active');
  });

  // mobile menu
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // tabs
  document.querySelectorAll('.tabs').forEach(tabs => {
    const panels = tabs.parentElement.querySelectorAll('.tab-panel');
    const buttons = tabs.querySelectorAll('.tab');
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        panels[i].classList.add('active');
      });
    });
    if (buttons.length) { buttons[0].classList.add('active'); panels[0].classList.add('active'); }
  });
});

// download page release fetch
async function loadLatestRelease() {
  if (!document.getElementById('release-status')) return;
  try {
    const res = await fetch('https://api.github.com/repos/neang-mengseang/Aether/releases/latest');
    if (!res.ok) throw new Error('no release');
    const data = await res.json();
    const date = new Date(data.published_at).toLocaleDateString();
    const status = document.getElementById('release-status');
    status.innerHTML = `<h2 class="section-title" style="margin-bottom:0.25rem;">${data.name}</h2><p class="section-sub" style="margin-bottom:0;">Published ${date}</p>`;

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
    document.getElementById('release-status').innerHTML = '<p class="section-sub" style="margin-bottom:1rem;">No releases published yet. Build from source or check back after the first release.</p><a class="btn btn-secondary" href="install.html#source">Build from source</a>';
  }
}
loadLatestRelease();
