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
        if (btn.classList.contains('tab-disabled') || btn.disabled) return;
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
    const res = await fetch('https://api.github.com/repos/RimoraStudio/Aether/releases?per_page=10');
    if (!res.ok) throw new Error('no releases');
    const releases = await res.json();
    if (!releases.length) throw new Error('empty');

    const latest = releases[0];
    const date = new Date(latest.published_at).toLocaleDateString();
    status.innerHTML = '<h2 style="font-size:24px;margin-bottom:4px;">' + (latest.name || 'Latest Release') + '</h2><p style="color:var(--text-muted);">Published ' + date + '</p>';

    const findAsset = (release, predicate) => (release.assets || []).find(predicate);
    const winMsi = findAsset(latest, a => a.name.toLowerCase().endsWith('.msi'));
    const winExe = findAsset(latest, a => a.name.toLowerCase().endsWith('.exe'));
    const win7z = findAsset(latest, a => a.name.toLowerCase().endsWith('.7z') && a.name.toLowerCase().includes('win'));
    const linDeb = findAsset(latest, a => a.name.toLowerCase().endsWith('.deb'));
    const linRpm = findAsset(latest, a => a.name.toLowerCase().endsWith('.rpm'));
    const linTgz = findAsset(latest, a => a.name.toLowerCase().endsWith('.tar.gz'));

    const setLink = (id, asset) => { const el = document.getElementById(id); if (el && asset) { el.href = asset.browser_download_url; } };
    setLink('win-msi-link', winMsi);
    setLink('win-exe-link', winExe);
    setLink('win-7z-link', win7z);
    setLink('linux-deb-link', linDeb);
    setLink('linux-rpm-link', linRpm);
    setLink('linux-tgz-link', linTgz);

    // Previous versions table
    const tbody = document.getElementById('prev-releases');
    if (tbody) {
      if (releases.length <= 1) {
        tbody.innerHTML = '<tr class="dl-table-loading"><td colspan="5">No previous versions yet.</td></tr>';
      } else {
        const prev = releases.slice(1);
        tbody.innerHTML = prev.map(r => {
          const d = new Date(r.published_at).toLocaleDateString();
          const assets = r.assets || [];
          const win = assets.find(a => a.name.toLowerCase().endsWith('.msi') || a.name.toLowerCase().endsWith('.exe'));
          const lin = assets.find(a => a.name.toLowerCase().endsWith('.deb') || a.name.toLowerCase().endsWith('.rpm'));
          const winCell = win ? '<a class="dl-link" href="' + win.browser_download_url + '" target="_blank" rel="noopener">Download</a>' : '<span class="dl-link-muted">N/A</span>';
          const linCell = lin ? '<a class="dl-link" href="' + lin.browser_download_url + '" target="_blank" rel="noopener">Download</a>' : '<span class="dl-link-muted">N/A</span>';
          return '<tr>' +
            '<td><span class="dl-tag">' + (r.tag_name || r.name) + '</span></td>' +
            '<td>' + d + '</td>' +
            '<td>' + winCell + '</td>' +
            '<td>' + linCell + '</td>' +
            '<td><a class="dl-link" href="' + r.html_url + '" target="_blank" rel="noopener">View</a></td>' +
          '</tr>';
        }).join('');
      }
    }
  } catch (e) {
    status.innerHTML = '<p style="color:var(--text-muted);margin-bottom:16px;">No releases published yet.</p><a class="btn btn-secondary" href="download.html#source">Build from source</a>';
    const tbody = document.getElementById('prev-releases');
    if (tbody) tbody.innerHTML = '<tr class="dl-table-loading"><td colspan="5">No releases available yet.</td></tr>';
  }
}
loadLatestRelease();
