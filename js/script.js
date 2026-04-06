// ─────────────────────────────────────────────────────────────
// Language Management
// ─────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('portfolioLang') || 'en';

function t(key) {
    const translations = PORTFOLIO_DATA.translations;
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolioLang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    const langLabels = { en: '🌐 EN', id: '🌐 ID', zh: '🌐 ZH' };
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) toggleBtn.textContent = langLabels[lang] || '🌐 EN';

    document.querySelectorAll('#lang-dropdown button').forEach(btn => {
        btn.classList.toggle('lang-active', btn.dataset.lang === lang);
    });

    renderDynamicContent();
}

// ─────────────────────────────────────────────────────────────
// Render Static + Local Dynamic Content (NO GITHUB HERE)
// ─────────────────────────────────────────────────────────────
function renderDynamicContent() {
    // HERO
    const hero = document.getElementById('hero-content');
    if (hero) {
        hero.innerHTML = `
            <h1 class="reveal active">${t('heroTitle')}</h1>
            <p class="reveal active">${t('heroDesc')}</p>
            <div class="hero-btns">
                <a href="#projects" class="btn btn-primary">${t('heroPrimaryBtn')}</a>
                <a href="#contact" class="btn btn-secondary">${t('heroSecondaryBtn')}</a>
            </div>
        `;
    }

    // ABOUT
    document.getElementById('about-title').innerText = t('aboutTitle');
    const aboutGrid = document.getElementById('about-grid');
    if (aboutGrid) {
        aboutGrid.innerHTML = '';
        [
            ['aboutStoryTitle', 'aboutStoryContent'],
            ['aboutProfileTitle', 'aboutProfileContent']
        ].forEach(([title, content]) => {
            aboutGrid.insertAdjacentHTML('beforeend', `
                <div class="about-card reveal active">
                    <h3>${t(title)}</h3>
                    <p>${t(content)}</p>
                </div>
            `);
        });
    }

    document.getElementById('experience-title').innerText = t('experienceTitle');
    document.getElementById('skills-title').innerText = t('skillsTitle');
    document.getElementById('projects-title').innerText = t('projectsTitle');

    refreshDynamicEvents();
}

// ─────────────────────────────────────────────────────────────
// Image Optimizer
// ─────────────────────────────────────────────────────────────
function optimizeImageUrl(url, w = 600) {
    if (!url) return '';
    if (url.includes('github')) {
        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${w}&output=webp&q=80`;
    }
    return url;
}

// ─────────────────────────────────────────────────────────────
// INIT PORTFOLIO (NO GITHUB FETCH)
// ─────────────────────────────────────────────────────────────
async function initPortfolio() {
    try {
        renderDynamicContent();

        // Populate Experience
        const timeline = document.getElementById('experience-timeline');
        if (timeline && PORTFOLIO_DATA.experience) {
            timeline.innerHTML = '';
            PORTFOLIO_DATA.experience.items.forEach(exp => {
                timeline.insertAdjacentHTML('beforeend', `
                    <div class="experience-item reveal">
                        <div class="exp-header">
                            <div>
                                <h3>${exp.role}</h3>
                                <h4>${exp.company}</h4>
                            </div>
                            <span>${exp.duration}</span>
                        </div>
                        <ul>${exp.description.map(d => `<li>${d}</li>`).join('')}</ul>
                        <strong>Tech:</strong> ${exp.tech_stack}
                    </div>
                `);
            });
        }

        // Skills
        const skills = document.getElementById('skills-container');
        if (skills) {
            skills.innerHTML = '';
            PORTFOLIO_DATA.skills.list.forEach(skill => {
                skills.insertAdjacentHTML('beforeend', `<div class="skill-tag">${skill}</div>`);
            });
        }

        setLanguage(currentLang);
        refreshDynamicEvents();

    } catch (e) {
        console.error('Init error:', e);
    }
}

// ─────────────────────────────────────────────────────────────
// LATE LOAD: FETCH GITHUB (ONLY ONCE)
// ─────────────────────────────────────────────────────────────
let githubFetched = false;

async function fetchGithubProjects() {
    try {
        const res = await fetch(
            'https://api.github.com/users/widifirmaan/repos?sort=updated&type=owner&per_page=100'
        );
        if (!res.ok) return;

        const repos = await res.json();
        const exclude = [
            'widifirmaan.github.io',
            'nextjs-telefish',
            'bash-android-aio-bypass-kit',
            'clover-asus-vivobookflip-tp410ua'
        ];

        PORTFOLIO_DATA.projects.list = repos
            .filter(r => !r.fork && !exclude.includes(r.name.toLowerCase()))
            .map((repo, i) => ({
                title: repo.name.replace(/[-_]/g, ' '),
                tech: repo.topics?.join(', ') || repo.language || 'Mixed',
                color: ['#00E5FF', '#FF5E5B', '#FFFF00'][i % 3],
                repo: repo.full_name,
                branch: repo.default_branch || 'main',
                images: [
                    optimizeImageUrl(`https://opengraph.githubassets.com/1/${repo.full_name}`)
                ],
                description: repo.description || '',
                link: repo.homepage || repo.html_url
            }));

        renderProjects();

    } catch (e) {
        console.error('GitHub fetch error:', e);
    }
}

// ─────────────────────────────────────────────────────────────
// Render Projects
// ─────────────────────────────────────────────────────────────
function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    grid.innerHTML = '';

    PORTFOLIO_DATA.projects.list.forEach((p, i) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="project-card reveal">
                <div class="project-image" style="background:${p.color}">
                    <img src="${p.images[0]}" />
                </div>
                <h3>${p.title.toUpperCase()}</h3>
                <button class="btn project-btn" data-index="${i}">
                    ${t('viewDetails')}
                </button>
            </div>
        `);
    });

    setupHorizontalScroll();
    refreshDynamicEvents();
}

// ─────────────────────────────────────────────────────────────
// Curtain Scroll → TRIGGER GITHUB FETCH
// ─────────────────────────────────────────────────────────────
const leftPanel = document.querySelector('.curtain-panel.left');
const rightPanel = document.querySelector('.curtain-panel.right');

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const progress = Math.min(window.scrollY / window.innerHeight, 1);

    leftPanel.style.transform = `translateX(-${progress * 100}%)`;
    rightPanel.style.transform = `translateX(${progress * 100}%)`;

    if (progress >= 1 && !githubFetched) {
        githubFetched = true;
        ('requestIdleCallback' in window)
            ? requestIdleCallback(fetchGithubProjects)
            : setTimeout(fetchGithubProjects, 500);
    }

    if (hero) hero.style.opacity = 1 - progress;
});

// ─────────────────────────────────────────────────────────────
// Observer & Utilities
// ─────────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('active', e.isIntersecting));
}, { threshold: 0.1 });

function refreshDynamicEvents() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupHorizontalScroll() {
    const outer = document.getElementById('projects-scroll-outer');
    const grid = document.getElementById('project-grid');
    if (!outer || !grid) return;

    outer.style.height = `calc(100vh + ${grid.scrollWidth}px)`;
}

// ─────────────────────────────────────────────────────────────
// Load
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initPortfolio);
