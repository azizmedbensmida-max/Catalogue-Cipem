// CIPEM 2026 - Master 25-Page Corporate Catalog Application
// Multi-Language Support (FR / EN) & Responsive Screen/A4 PDF Engine

document.addEventListener('DOMContentLoaded', () => {
  const dynamicContainer = document.getElementById('dynamic-centres-container');
  const searchInput = document.getElementById('catalog-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const totalCoursesCountEl = document.getElementById('total-courses-count');
  const noResultsBox = document.getElementById('no-results-box');
  const printBtn = document.getElementById('print-catalog-btn');
  const toggleViewBtn = document.getElementById('toggle-view-btn');
  const viewModeLabel = document.getElementById('view-mode-label');

  // Language state: 'fr' or 'en'
  let currentLang = localStorage.getItem('cipem_catalog_lang') || 'fr';
  const langFrBtn = document.getElementById('lang-fr-btn');
  const langEnBtn = document.getElementById('lang-en-btn');

  function updateLanguageButtons() {
    if (langFrBtn && langEnBtn) {
      if (currentLang === 'en') {
        langEnBtn.classList.add('active');
        langFrBtn.classList.remove('active');
      } else {
        langFrBtn.classList.add('active');
        langEnBtn.classList.remove('active');
      }
    }
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('cipem_catalog_lang', lang);
    updateLanguageButtons();
    updateUiLanguage();
    renderCatalogPages();
  }

  if (langFrBtn) langFrBtn.addEventListener('click', () => setLanguage('fr'));
  if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));

  function updateUiLanguage() {
    const isEn = currentLang === 'en';
    document.title = isEn ? 'CIPEM 2026 | Official Training Catalog' : 'CIPEM 2026 | Catalogue Officiel des Formations';

    const isSheet = document.body.classList.contains('mode-sheet-view');
    if (viewModeLabel) {
      viewModeLabel.textContent = isEn ? (isSheet ? 'Fluid Screen View' : 'A4 PDF Preview') : (isSheet ? 'Vue Écran Fluide' : 'Aperçu A4 PDF');
    }

    const printFull = document.querySelector('.btn-print-full');
    const printShort = document.querySelector('.btn-print-short');
    if (printFull) printFull.textContent = isEn ? 'Print / Export PDF' : 'Imprimer / Exporter PDF';
    if (printShort) printShort.textContent = isEn ? 'Print PDF' : 'Imprimer PDF';

    // Update Sommaire headers (Pages 2 & 3)
    const somHeadlines = document.querySelectorAll('.section-headline .title-large');
    somHeadlines.forEach(h => {
      h.textContent = isEn ? 'GENERAL TABLE OF CONTENTS - TRAINING MODULES' : 'SOMMAIRE GÉNÉRAL DES FORMATIONS';
    });

    // Update Sommaire row titles
    const dataSomm = isEn ? (window.CATALOG_SOMMAIRE_EN || window.CATALOG_SOMMAIRE) : window.CATALOG_SOMMAIRE;
    if (dataSomm) {
      const somRows = document.querySelectorAll('.sommaire-row');
      somRows.forEach((row, idx) => {
        const item = dataSomm[idx];
        if (item) {
          const titleEl = row.querySelector('.som-title');
          if (titleEl) titleEl.textContent = item.title;
        }
      });
    }

    // Update Cover Top Registration Label
    const coverRegLabel = document.querySelector('.cover-top-reg .reg-label');
    if (coverRegLabel) {
      coverRegLabel.textContent = isEn ? 'Training Registration No.' : 'N° d’enregistrement Formation';
    }

    // Update Cover Bottom Partner Tag
    const partnerTag = document.querySelector('.partner-tag');
    if (partnerTag) {
      partnerTag.textContent = isEn ? 'STRATEGIC PARTNERSHIP' : 'PARTENARIAT STRATÉGIQUE';
    }

    // Dynamic Cover Center Artwork (French vs English)
    const coverArtImg = document.getElementById('cover-artwork-img') || document.querySelector('.cover-art-img');
    if (coverArtImg) {
      if (isEn) {
        coverArtImg.src = 'Assets/images/cipem_catalog_cover_2026.jpg';
        coverArtImg.alt = 'CIPEM 2026 Training Catalog - Official Edition';
      } else {
        coverArtImg.src = 'Assets/images/cipem_catalog_cover_2026_fr.jpg';
        coverArtImg.alt = 'CIPEM 2026 Catalogue des Formations - Édition Officielle';
      }
    }
  }

  // View Mode Switcher (Web Fluid vs A4 Sheet Mode)
  if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', () => {
      document.body.classList.toggle('mode-sheet-view');
      const isSheet = document.body.classList.contains('mode-sheet-view');
      const isEn = currentLang === 'en';
      viewModeLabel.textContent = isEn ? (isSheet ? 'Fluid Screen View' : 'A4 PDF Preview') : (isSheet ? 'Vue Écran Fluide' : 'Aperçu A4 PDF');
    });
  }

  // Print Action
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      setActiveTab('all');
      if (searchInput) {
        searchInput.value = '';
        applySearch('');
      }
      window.print();
    });
  }

  // Render the 22 catalog course pages (Pages 4 to 25)
  function renderCatalogPages() {
    if (!dynamicContainer) return;

    const isEn = currentLang === 'en';
    const pagesDataSource = isEn ? (window.CATALOG_PAGES_DATA_EN || window.CATALOG_PAGES_DATA) : window.CATALOG_PAGES_DATA;
    if (!pagesDataSource) return;

    dynamicContainer.innerHTML = '';
    let totalCourses = 0;

    pagesDataSource.forEach(pageData => {
      const pageEl = document.createElement('section');
      pageEl.className = 'a4-sheet catalog-page-sheet';
      pageEl.id = `page-${pageData.page}`;
      pageEl.setAttribute('data-page', pageData.page);
      const secCount = pageData.page === 25 ? 2 : pageData.sections.length;
      pageEl.setAttribute('data-sections-count', secCount);

      // Collect sections on this page
      let sectionsHtml = '';

      pageData.sections.forEach(sec => {
        totalCourses += sec.courses.length;

        let rowsHtml = '';
        sec.courses.forEach(c => {
          const daysText = isEn ? `${c.days} Days` : `${c.days} Jours`;
          const interTip = isEn ? 'INTER Session in Tunis' : 'Session INTER à Tunis';
          const intraTip = isEn ? 'INTRA Session on-site' : 'Session INTRA sur site client';

          rowsHtml += `
            <tr class="course-row" data-title="${escapeHtml(c.title)}" data-section="${escapeHtml(sec.title)}">
              <td class="course-name-cell">${escapeHtml(c.title)}</td>
              <td class="cell-center"><span class="badge-days-pill">${daysText}</span></td>
              <td class="cell-center">
                <span class="check-svg-round inter" title="${interTip}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </td>
              <td class="cell-center">
                <span class="check-svg-round intra" title="${intraTip}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </td>
            </tr>
          `;
        });

        const subtitleHtml = sec.subtitle ? `<span class="sec-subtitle-text">${escapeHtml(sec.subtitle)}</span>` : '';
        const thTopics = isEn ? 'TRAINING TOPICS &amp; MODULES' : 'THÈMES DE FORMATION';
        const thDays = isEn ? 'DURATION' : 'NBR JOURS';

        sectionsHtml += `
          <div class="section-unit-block" id="${sec.id}">
            <div class="section-unit-head">
              <div class="sec-title-wrap">
                <span class="sec-num-badge">${sec.num}</span>
                <h4 class="sec-title-text">${escapeHtml(sec.title)}</h4>
                ${subtitleHtml}
              </div>
              <span class="sec-course-count-pill">${sec.courses.length}&nbsp;modules</span>
            </div>

            <div class="clean-table-wrap">
              <table class="clean-course-table">
                <thead>
                  <tr>
                    <th>${thTopics}</th>
                    <th class="center-col">${thDays}</th>
                    <th class="mode-col">INTER</th>
                    <th class="mode-col">INTRA</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        `;
      });

      // Integrate Corporate Contact & Direction block directly into Page 25
      if (pageData.page === 25) {
        if (isEn) {
          sectionsHtml += `
            <div class="page25-contact-section" id="contact-footer">
              <div class="contact-sheet-grid">
                <div class="contact-left">
                  <span class="contact-tag">Corporate Training &amp; Capacity Building</span>
                  <h3 class="contact-title">Launch Your Training Program with CIPEM</h3>
                  <p class="contact-desc">
                    Our educational engineers tailor your on-site INTRA corporate conventions or coordinate your team's stay in Tunis with comprehensive turnkey administrative and logistical support.
                  </p>

                  <div class="contact-badges-row">
                    <span class="contact-badge">Training Accreditation No. 11-1372-15</span>
                    <span class="contact-badge">Tax ID: 1322330N/A/M/000</span>
                    <span class="contact-badge">Commercial Registry: 1322330N</span>
                  </div>
                </div>

                <div class="contact-card-white">
                  <h4>EXECUTIVE DIRECTION CONTACTS</h4>
                  <ul class="contact-ul">
                    <li>
                      <span class="c-label">Address :</span>
                      <span class="c-value">24 Cyrus Le Grand Ave, Le Passage, 1002 Tunis, Tunisia</span>
                    </li>
                    <li>
                      <span class="c-label">Landline :</span>
                      <span class="c-value"><a href="tel:+21671353078">+216 71 35 30 78</a> / <a href="tel:+21671254978">+216 71 25 49 78</a></span>
                    </li>
                    <li>
                      <span class="c-label">Direct Mobile :</span>
                      <span class="c-value"><a href="tel:+21698645545">+216 98 64 55 45</a></span>
                    </li>
                    <li>
                      <span class="c-label">Email :</span>
                      <span class="c-value"><a href="mailto:formation@cipem.com.tn">formation@cipem.com.tn</a></span>
                    </li>
                    <li>
                      <span class="c-label">Official Portal :</span>
                      <span class="c-value"><a href="https://www.cipem.com.tn" target="_blank" rel="noopener">www.cipem.com.tn</a></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          `;
        } else {
          sectionsHtml += `
            <div class="page25-contact-section" id="contact-footer">
              <div class="contact-sheet-grid">
                <div class="contact-left">
                  <span class="contact-tag">Formation Continue &amp; Entreprises</span>
                  <h3 class="contact-title">Démarrez Votre Programme avec le CIPEM</h3>
                  <p class="contact-desc">
                    Nos ingénieurs pédagogiques élaborent vos conventions INTRA sur site ou organisent le séjour de vos collaborateurs à Tunis avec un suivi administratif et logistique clé en main.
                  </p>

                  <div class="contact-badges-row">
                    <span class="contact-badge">Agrément Formation N° 11-1372-15</span>
                    <span class="contact-badge">Matricule Fiscal : 1322330N/A/M/000</span>
                    <span class="contact-badge">Registre du Commerce : 1322330N</span>
                  </div>
                </div>

                <div class="contact-card-white">
                  <h4>COORDONNÉES DE LA DIRECTION</h4>
                  <ul class="contact-ul">
                    <li>
                      <span class="c-label">Adresse :</span>
                      <span class="c-value">24 Rue Cyrus le Grand, Le Passage, 1002 Tunis, Tunisie</span>
                    </li>
                    <li>
                      <span class="c-label">Tél Fixe :</span>
                      <span class="c-value"><a href="tel:+21671353078">+216 71 35 30 78</a> / <a href="tel:+21671254978">+216 71 25 49 78</a></span>
                    </li>
                    <li>
                      <span class="c-label">Ligne Directe Mobile :</span>
                      <span class="c-value"><a href="tel:+21698645545">+216 98 64 55 45</a></span>
                    </li>
                    <li>
                      <span class="c-label">Courriel :</span>
                      <span class="c-value"><a href="mailto:formation@cipem.com.tn">formation@cipem.com.tn</a></span>
                    </li>
                    <li>
                      <span class="c-label">Portail Officiel :</span>
                      <span class="c-value"><a href="https://www.cipem.com.tn" target="_blank" rel="noopener">www.cipem.com.tn</a></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          `;
        }
      }

      const rhTagline = isEn ? 'STUDIES - PROJECT STEERING - TRAINING' : 'ETUDES - PILOTAGE - FORMATIONS';
      const rhRegLabel = isEn ? 'Training Registration Number :' : 'Numéro d’enregistrement Formation :';
      const fAddrLabel = isEn ? 'Address :' : 'Adresse :';
      const fAddrVal = isEn ? '24 Cyrus Le Grand Ave, Le Passage, 1002 Tunis' : '24 Rue Cyrus le Grand, Le Passage, 1002 Tunis';
      const fTelLabel = isEn ? 'Phone :' : 'Tél :';

      pageEl.innerHTML = `
        <div class="page-running-header">
          <img src="Assets/images/cipem_official_logo_noborder.png" alt="CIPEM Logo Officiel" class="running-logo">
          <div class="running-header-official">
            <span class="rh-tagline">${rhTagline}</span>
            <span class="rh-reg">${rhRegLabel} <strong>11-1372-15</strong></span>
          </div>
        </div>

        <div class="catalog-page-content">
          ${sectionsHtml}
        </div>

        <div class="page-running-footer-full">
          <div class="footer-row-primary">
            <span class="f-item"><strong>${fAddrLabel}</strong> ${fAddrVal}</span>
            <span class="f-item"><strong>E-Mail :</strong> <a href="mailto:formation@cipem.com.tn">formation@cipem.com.tn</a></span>
            <span class="f-item"><strong>Web :</strong> <a href="https://www.cipem.com.tn" target="_blank" rel="noopener">www.cipem.com.tn</a></span>
          </div>
          <div class="footer-row-secondary">
            <span class="f-item"><strong>${fTelLabel}</strong> +216 71 35 30 78 / +216 71 25 49 78</span>
            <span class="f-item"><strong>Mobile :</strong> +216 98 64 55 45</span>
            <span class="f-item"><strong>Fax :</strong> +216 71 35 30 78</span>
            <span class="f-page-num">Page ${pageData.page} / 25</span>
          </div>
        </div>
      `;

      dynamicContainer.appendChild(pageEl);
    });

    if (totalCoursesCountEl) {
      totalCoursesCountEl.textContent = totalCourses;
    }
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Live Instant Search across all courses
  function applySearch(query) {
    const q = query.trim().toLowerCase();
    const courseRows = document.querySelectorAll('.course-row');
    const pageSheets = document.querySelectorAll('.catalog-page-sheet');
    const sectionUnits = document.querySelectorAll('.section-unit-block');

    if (!q) {
      courseRows.forEach(row => {
        row.style.display = '';
        const nameCell = row.querySelector('.course-name-cell');
        if (nameCell && row.getAttribute('data-original-html')) {
          nameCell.innerHTML = row.getAttribute('data-original-html');
        }
      });
      sectionUnits.forEach(sec => sec.style.display = '');
      pageSheets.forEach(sheet => sheet.style.display = '');
      if (noResultsBox) noResultsBox.style.display = 'none';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      return;
    }

    if (clearSearchBtn) clearSearchBtn.style.display = 'block';

    let matchCount = 0;
    const matchedSections = new Set();
    const matchedPages = new Set();

    courseRows.forEach(row => {
      const title = (row.getAttribute('data-title') || '').toLowerCase();
      const section = (row.getAttribute('data-section') || '').toLowerCase();
      const nameCell = row.querySelector('.course-name-cell');

      if (!row.getAttribute('data-original-html') && nameCell) {
        row.setAttribute('data-original-html', nameCell.innerHTML);
      }

      if (title.includes(q) || section.includes(q)) {
        row.style.display = '';
        matchCount++;

        if (nameCell && row.getAttribute('data-original-html')) {
          const raw = row.getAttribute('data-original-html');
          const reg = new RegExp(`(${escapeRegex(query.trim())})`, 'gi');
          nameCell.innerHTML = raw.replace(reg, '<mark class="highlight-search">$1</mark>');
        }

        const secParent = row.closest('.section-unit-block');
        if (secParent) matchedSections.add(secParent);

        const pageParent = row.closest('.catalog-page-sheet');
        if (pageParent) matchedPages.add(pageParent);
      } else {
        row.style.display = 'none';
      }
    });

    sectionUnits.forEach(sec => {
      sec.style.display = matchedSections.has(sec) ? '' : 'none';
    });

    pageSheets.forEach(sheet => {
      sheet.style.display = matchedPages.has(sheet) ? '' : 'none';
    });

    if (noResultsBox) {
      noResultsBox.style.display = matchCount === 0 ? 'block' : 'none';
    }
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      applySearch(e.target.value);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        applySearch('');
      }
    });
  }

  // Quick Filter Tabs (Filter by Domain/Group)
  const FILTER_PAGE_RANGES = {
    'all': [4, 25],
    'elec': [4, 6],
    'meca': [7, 7],
    'btp': [8, 10],
    'logiciels': [11, 12],
    'hse': [13, 14],
    'finance': [15, 19],
    'management': [20, 25]
  };

  function setActiveTab(filterId) {
    filterTabs.forEach(t => {
      if (t.getAttribute('data-filter') === filterId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    const range = FILTER_PAGE_RANGES[filterId] || [4, 25];
    const [minPage, maxPage] = range;

    const pageSheets = document.querySelectorAll('.catalog-page-sheet');
    pageSheets.forEach(sheet => {
      const pageNum = parseInt(sheet.getAttribute('data-page'), 10);
      if (filterId === 'all' || (pageNum >= minPage && pageNum <= maxPage)) {
        sheet.style.display = '';
      } else {
        sheet.style.display = 'none';
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const f = tab.getAttribute('data-filter');
      setActiveTab(f);
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        applySearch('');
      }
    });
  });

  // =====================================================================
  // MODERN CUSTOM ORBIT CURSOR CONTROLLER
  // =====================================================================
  function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    if (!cursorDot || !cursorRing) return;

    // Only activate on devices with fine pointer (mouse / trackpad)
    if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });

    window.addEventListener('mousedown', () => {
      cursorRing.classList.add('cursor-active');
      cursorDot.classList.add('cursor-active');
    });

    window.addEventListener('mouseup', () => {
      cursorRing.classList.remove('cursor-active');
      cursorDot.classList.remove('cursor-active');
    });

    // Smooth Lerp loop for the floating orbit ring
    function renderOrbitRing() {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      requestAnimationFrame(renderOrbitRing);
    }
    requestAnimationFrame(renderOrbitRing);

    // Interactive Hover Elements Detection
    const interactiveSelectors = 'a, button, input, select, textarea, .filter-tab, .course-row, .sommaire-row, .btn-action, .lang-btn, [role="button"]';

    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest(interactiveSelectors)) {
        cursorRing.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest(interactiveSelectors)) {
        cursorRing.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      }
    });
  }

  // Initial Boot
  updateLanguageButtons();
  updateUiLanguage();
  renderCatalogPages();
  initCustomCursor();
});
