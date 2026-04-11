// preloader

window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
      preloader.classList.add('loaded');
  }
});


// Language Management
let currentLang = localStorage.getItem('portfolioLang') || 'en';

function t(key) {
    const translations = PORTFOLIO_DATA.translations;
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolioLang', lang);

    // Update all static [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);
        if (translation) {
            el.innerHTML = translation;
        }
    });

    // Update all [data-i18n-placeholder] elements
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = t(key);
        if (translation) {
            el.placeholder = translation;
        }
    });

    // Update toggle button label
    const langLabels = { en: '🌐 EN', id: '🌐 ID', zh: '🌐 ZH' };
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) toggleBtn.textContent = langLabels[lang] || '🌐 EN';

    // Update active state in dropdown
    document.querySelectorAll('#lang-dropdown button').forEach(btn => {
        btn.classList.toggle('lang-active', btn.getAttribute('data-lang') === lang);
    });

    // Update dynamic text elements that aren't strictly static data-i18n
    updateDynamicTexts();
}

function updateDynamicTexts() {
    // Re-render Projects title that might have been dynamically inserted or handled
    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.textContent = t('viewDetails');
    });
}

// ─── Utility: Image Optimization ───────────────────────────────────────────
function optimizeImageUrl(url, width = 600) {
    if (!url) return '';
    if (url.includes('github') || url.includes('githubassets.com')) {
        const encodedUrl = encodeURIComponent(url);
        return `https://images.weserv.nl/?url=${encodedUrl}&w=${width}&output=webp&q=80`;
    }
    return url;
}

// Populate Data from Variable
async function initPortfolio() {
    try {
        const data = PORTFOLIO_DATA;

        // Static sections are now hardcoded in HTML and translated via i18n data attributes.



        // Fetch GitHub Projects dynamically with localStorage caching
        const CACHE_KEY = 'portfolioGithubData';
        const CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours
        let cachedData = null;

        try {
            const cachedString = localStorage.getItem(CACHE_KEY);
            if (cachedString) {
                const parsed = JSON.parse(cachedString);
                if (Date.now() - parsed.timestamp < CACHE_TIME) {
                    cachedData = parsed.data;
                }
            }
        } catch (e) {
            console.error('Error reading cache:', e);
        }

        if (cachedData) {
            data.projects.list = cachedData;
        } else {
            try {
                const githubRes = await fetch('https://api.github.com/users/widifirmaan/repos?sort=updated&type=owner&per_page=30'); // Reduced to 30 for perf
                if (githubRes.ok) {
                    const repos = await githubRes.json();
                    const colors = ['#00E5FF', '#FF5E5B', '#FFFF00', '#FFC0CB', '#00FF00', '#FFFFFF'];
                    const excludeRepos = ['widifirmaan.github.io', 'nextjs-telefish', 'bash-android-aio-bypass-kit', 'clover-asus-vivobookflip-tp410ua'];

                    data.projects.list = repos.filter(repo => !repo.fork && !excludeRepos.includes(repo.name.toLowerCase())).map((repo, idx) => {
                        const color = colors[idx % colors.length];
                        let techList = repo.language || 'Multiple Technologies';
                        if (repo.topics && repo.topics.length > 0) {
                            techList = repo.topics.join(', ');
                        }

                        return {
                            title: repo.name.replace(/[-_]/g, ' '),
                            tech: techList,
                            color: color,
                            repo: repo.full_name,
                            branch: repo.default_branch || 'main',
                            images: [optimizeImageUrl(`https://opengraph.githubassets.com/1/${repo.full_name}`)],
                            description: repo.description || 'No description available for this repository.',
                            link: repo.homepage && repo.homepage !== "" ? repo.homepage : repo.html_url
                        };
                    });
                }
            } catch (e) {
                console.error('Error fetching GitHub repos:', e);
            }
        }


        // Populate Projects
        document.getElementById('projects-title').innerText = t('projectsTitle');
        const projectGrid = document.getElementById('project-grid');
        data.projects.list.forEach((project, index) => {
            const projectEl = document.createElement('div');
            projectEl.className = 'project-card reveal';
            projectEl.innerHTML = `
                <div class="project-image" id="project-image-${index}" style="background-color: ${project.color};">
                    ${project.images && project.images.length > 0 ? `<img src="${project.images[0]}" alt="${project.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">` : ''}
                </div>
                <div class="project-info">
                    <h3>${project.title.toUpperCase()}</h3>
                    <button class="btn btn-primary project-btn" data-index="${index}">${t('viewDetails')}</button>
                </div>
            `;
            projectGrid.appendChild(projectEl);
        });

        // Init horizontal scroll now that all cards are in the DOM
        // Use requestAnimationFrame so browser has painted before we measure widths
        requestAnimationFrame(() => setupHorizontalScroll());

        // Only fetch READMEs if not working from cache
        if (!cachedData) {
            const readmePromises = data.projects.list.map(async (p, idx) => {
                if (!p.repo) return;
                try {
                    const response = await fetch(`https://raw.githubusercontent.com/${p.repo}/${p.branch}/README.md`)
                        .then(res => res.ok ? res : fetch(`https://raw.githubusercontent.com/${p.repo}/${p.branch}/Readme.md`))
                        .then(res => res.ok ? res : fetch(`https://raw.githubusercontent.com/${p.repo}/${p.branch}/readme.md`));

                    if (!response.ok) throw new Error('README not found');
                    const text = await response.text();

                    const imgRegex = /!\[.*?\]\(((?:[^)(]+|\([^)(]*\))+)\)|<img.*?src=["'](.*?)["']/g;
                    let images = [];
                    let match;
                    let count = 0;
                    while ((match = imgRegex.exec(text)) !== null && count < 8) {
                        let url = match[1] || match[2];
                        if (url && !url.includes('shields.io') && !url.includes('badge')) {
                            if (!url.startsWith('http')) {
                                url = `https://raw.githubusercontent.com/${p.repo}/${p.branch}/${url.replace(/^\.\//, '')}`;
                            }
                            images.push(optimizeImageUrl(url));
                            count++;
                        }
                    }

                    images = [...new Set(images)];

                    if (images.length > 0) {
                        // Ensure the primary OpenGraph image remains if available
                        const ogImage = p.images && p.images[0] ? p.images[0] : null;
                        p.images = ogImage ? [ogImage, ...images] : images;
                        
                        const imgContainer = document.getElementById(`project-image-${idx}`);
                        if (imgContainer) {
                            let gridClass = 'project-image-grid-1';
                            if (p.images.length === 2) gridClass = 'project-image-grid-2';
                            else if (p.images.length === 3) gridClass = 'project-image-grid-3';
                            else if (p.images.length >= 4) gridClass = 'project-image-grid-4';

                            imgContainer.className = `project-image project-image-grid ${gridClass}`;
                            imgContainer.style.backgroundColor = 'var(--black)';

                            const numImages = Math.min(p.images.length, 4);
                            let html = '';
                            for (let i = 0; i < numImages; i++) {
                                html += `<img src="${p.images[i]}" alt="${p.title}" loading="lazy">`;
                            }
                            imgContainer.innerHTML = html;
                        }
                    }
                } catch (err) {
                    // Silently fail if README not found
                }
            });

            await Promise.all(readmePromises);
            
            // Save to cache
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: data.projects.list
                }));
            } catch (e) {
                console.warn('Could not cache github data:', e);
            }
        } else {
            // Apply loaded cached images to DOM
            data.projects.list.forEach((p, idx) => {
                const imgContainer = document.getElementById(`project-image-${idx}`);
                if (imgContainer && p.images && p.images.length > 1) {
                    let gridClass = 'project-image-grid-1';
                    if (p.images.length === 2) gridClass = 'project-image-grid-2';
                    else if (p.images.length === 3) gridClass = 'project-image-grid-3';
                    else if (p.images.length >= 4) gridClass = 'project-image-grid-4';

                    imgContainer.className = `project-image project-image-grid ${gridClass}`;
                    imgContainer.style.backgroundColor = 'var(--black)';

                    const numImages = Math.min(p.images.length, 4);
                    let html = '';
                    for (let i = 0; i < numImages; i++) {
                        html += `<img src="${p.images[i]}" alt="${p.title}" loading="lazy">`;
                    }
                    imgContainer.innerHTML = html;
                }
            });
        }

        // EXTRA: Preload all final image URLs to ensure they are in browser cache
        const allImageUrls = data.projects.list.flatMap(p => p.images || []);
        if (allImageUrls.length > 0) {
            const preloadPromises = allImageUrls.map(url => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if one image fails
                    img.src = url;
                });
            });
            await Promise.all(preloadPromises);
        }

        // Modal Logic
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        const closeModal = document.querySelector('.close-modal');

        document.querySelectorAll('.project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                const p = data.projects.list[idx];

                let modalContentHTML = `
                    <h2 class="section-title">${p.title.toUpperCase()}</h2>
                    
                    <div class="modal-links" style="margin-bottom: 20px;">
                        <a href="${p.link}" target="_blank" class="btn btn-primary">${t('liveDemo')}</a>
                        ${p.repo ? `<a href="https://github.com/${p.repo}" target="_blank" class="btn btn-secondary">${t('sourceCode')}</a>` : `<a href="#" class="btn btn-secondary">${t('sourceCode')}</a>`}
                    </div>
                `;

                modalContentHTML += `
                    <div class="modal-desc" id="modal-desc-container">
                        <p>${p.description}</p>
                    </div>
                `;

                modalBody.innerHTML = modalContentHTML;

                // Fetch README if repo exists
                if (p.repo) {
                    const descContainer = modalBody.querySelector('#modal-desc-container');
                    descContainer.innerHTML = `<p>${t('loadingReadme')}</p>`;

                    fetch(`https://raw.githubusercontent.com/${p.repo}/${p.branch}/README.md`)
                        .then(response => {
                            if (!response.ok) {
                                return fetch(`https://raw.githubusercontent.com/${p.repo}/${p.branch}/Readme.md`)
                                    .then(res => {
                                        if (!res.ok) {
                                            return fetch(`https://raw.githubusercontent.com/${p.repo}/${p.branch}/readme.md`);
                                        }
                                        return res;
                                    });
                            }
                            return response;
                        })
                        .then(response => {
                            if (!response.ok) throw new Error('README not found');
                            return response.text();
                        })
                        .then(text => {
                            // Convert image relative paths to absolute raw URLs
                            let processedText = text.replace(/!\[([^\]]*)\]\((?!http|https)((?:[^)(]+|\([^)(]*\))+)\)/g,
                                `![$1](https://raw.githubusercontent.com/${p.repo}/${p.branch}/$2)`);

                            // Use marked to parse
                            if (typeof marked !== 'undefined') {
                                descContainer.innerHTML = marked.parse(processedText);
                                descContainer.classList.add('markdown-body');
                            } else {
                                descContainer.innerHTML = `<pre>${processedText}</pre>`;
                            }
                        })
                        .catch(err => {
                            console.error("Error loading README:", err);
                            descContainer.innerHTML = `<p>${p.description}</p>`;
                        });
                }

                if (window.loadMarked) window.loadMarked();
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        closeModal.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Re-initialize observers and events after dynamic content is added
        refreshDynamicEvents();

        // Apply saved language to static elements
        setLanguage(currentLang);

    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

function refreshDynamicEvents() {
    // Re-select all elements that might be dynamic
    const revealItems = document.querySelectorAll('.reveal, .skills-container, .project-grid, .experience-timeline, .contact-box, .project-card');
    revealItems.forEach(el => observer.observe(el));

    // Update interactables for cursor
    const interactables = document.querySelectorAll('a, button, .project-card, .skill-tag, .curtain-panel');
    interactables.forEach(item => {
        if (!item.dataset.cursorBound) {
            item.dataset.cursorBound = 'true';
            item.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(3)';
                cursor.style.backgroundColor = 'var(--secondary)';
            });
            item.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.backgroundColor = 'var(--primary)';
            });
        }
    });

    // Animate hero reveals immediately
    document.querySelectorAll('.hero .reveal').forEach(el => {
        el.classList.add('active');
    });
}

// Custom Cursor & Floating Shapes Parallax
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    // Move custom cursor
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Parallax for hero shapes
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, idx) => {
        const speed = (idx + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${15 * idx}deg)`;
    });
});

// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            if (entry.target.classList.contains('skills-container')) {
                const tags = entry.target.querySelectorAll('.skill-tag');
                if (entry.target._timeouts) {
                    entry.target._timeouts.forEach(t => clearTimeout(t));
                }
                entry.target._timeouts = [];

                tags.forEach((tag, i) => {
                    const t = setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0) scale(1)';
                    }, i * 100);
                    entry.target._timeouts.push(t);
                });
            }

            if (entry.target.classList.contains('project-grid')) {
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.add('active');
                    }, i * 200);
                });
            }

            if (entry.target.classList.contains('experience-timeline')) {
                const items = entry.target.querySelectorAll('.experience-item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, i * 200);
                });
            }
        } else {
            entry.target.classList.remove('active');

            if (entry.target.classList.contains('skills-container')) {
                if (entry.target._timeouts) {
                    entry.target._timeouts.forEach(t => clearTimeout(t));
                }
                const tags = entry.target.querySelectorAll('.skill-tag');
                tags.forEach((tag) => {
                    tag.style.opacity = '0';
                    tag.style.transform = 'translateY(20px) scale(0.9)';
                });
            }

            if (entry.target.classList.contains('project-grid')) {
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach((card) => {
                    card.classList.remove('active');
                });
            }

            if (entry.target.classList.contains('experience-timeline')) {
                const items = entry.target.querySelectorAll('.experience-item');
                items.forEach((item) => {
                    item.classList.remove('active');
                });
            }
        }
    });
}, observerOptions);


const leftPanel = document.querySelector('.curtain-panel.left');
const rightPanel = document.querySelector('.curtain-panel.right');

// ─── Horizontal Scroll – Projects ───────────────────────────────────────────
function setupHorizontalScroll() {
    const outer = document.getElementById('projects-scroll-outer');
    const grid = document.getElementById('project-grid');
    if (!outer || !grid) return;

    // Total scroll distance = extra width of the track (cards that overflow)
    const totalWidth = grid.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth + viewportWidth * 0.1; // keep 10vw gap at end

    // Give the outer div enough height so the sticky element has room to "scroll"
    // We add one viewport height so the section header is visible before cards start moving
    outer.style.height = `calc(100vh + ${scrollDistance}px)`;
}

function updateHorizontalScroll() {
    const outer = document.getElementById('projects-scroll-outer');
    const grid = document.getElementById('project-grid');
    if (!outer || !grid) return;

    const outerRect = outer.getBoundingClientRect();
    const totalScrollable = outer.offsetHeight - window.innerHeight;

    // outerRect.top is negative once we've scrolled past the outer start
    const scrolled = -outerRect.top;
    if (scrolled < 0 || scrolled > totalScrollable) return;

    const progress = scrolled / totalScrollable; // 0 → 1
    const totalWidth = grid.scrollWidth;
    const viewportWidth = window.innerWidth;
    const maxShift = totalWidth - viewportWidth + viewportWidth * 0.1;
    const shift = progress * maxShift;

    grid.style.transform = `translateX(-${shift}px)`;
}

// Re-calculate on resize
window.addEventListener('resize', setupHorizontalScroll);

// Re-selected in refreshDynamicEvents if needed, but for scroll we can select here
window.addEventListener('scroll', () => {
    const heroText = document.getElementById('hero-content');
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight - windowHeight;

    let curtainProgress = Math.min(scrollPos / windowHeight, 1);
    let globalProgress = (scrollPos / totalHeight) * 100;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        leftPanel.style.transform = `translate3d(0, -${curtainProgress * 100}%, 0)`;
        rightPanel.style.transform = `translate3d(0, ${curtainProgress * 100}%, 0)`;
    } else {
        leftPanel.style.transform = `translate3d(-${curtainProgress * 100}%, 0, 0)`;
        rightPanel.style.transform = `translate3d(${curtainProgress * 100}%, 0, 0)`;
    }

    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.height = globalProgress + '%';
    }



    if (heroText) {
        heroText.style.opacity = 1 - curtainProgress;
        heroText.style.transform = `translateY(-${curtainProgress * 50}px)`;
    }


    const hero = document.querySelector('.hero');
    if (curtainProgress >= 1) {
        hero.style.pointerEvents = 'none';
        hero.style.opacity = '0';
        hero.style.visibility = 'hidden';
    } else {
        hero.style.pointerEvents = 'all';
        hero.style.opacity = '1';
        hero.style.visibility = 'visible';
    }

    // Drive horizontal scroll for projects
    updateHorizontalScroll();
});




// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();


    // Language Switcher Logic
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');

    if (langToggle && langDropdown) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });

        langDropdown.querySelectorAll('button[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
                langDropdown.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-switcher')) {
                langDropdown.classList.remove('active');
            }
        });
    }

    // Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Form Submission (Simulated)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            // Open default mail client
            window.location.href = `mailto:widifirmaan@outlook.com?subject=${subject}&body=${body}`;

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = t('contactSending');
            btn.style.background = '#00E5FF';

            setTimeout(() => {
                btn.innerText = t('contactSend');
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Marked.js Dynamic Loader
window.loadMarked = function() {
    if (typeof marked === 'undefined') {
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(s);
    }
};
