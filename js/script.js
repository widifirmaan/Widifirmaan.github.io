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
            if (key === 'marquee' || key === 'heroTitle') {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
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

    // Re-render dynamic content
    renderDynamicContent();
}

function renderDynamicContent() {
    const data = PORTFOLIO_DATA;

    // Re-render Hero
    const heroContainer = document.getElementById('hero-content');
    if (heroContainer) {
        heroContainer.innerHTML = `
            <h1 class="reveal active">${t('heroTitle')}</h1>
            <p class="reveal active">${t('heroDesc')}</p>
            <div class="hero-btns">
                <a href="#projects" class="btn btn-primary">${t('heroPrimaryBtn')}</a>
                <a href="#contact" class="btn btn-secondary">${t('heroSecondaryBtn')}</a>
            </div>
        `;
    }

    // Re-render About
    document.getElementById('about-title').innerText = t('aboutTitle');
    const aboutGrid = document.getElementById('about-grid');
    if (aboutGrid) {
        aboutGrid.innerHTML = '';
        const aboutCards = [
            { titleKey: 'aboutStoryTitle', contentKey: 'aboutStoryContent' },
            { titleKey: 'aboutProfileTitle', contentKey: 'aboutProfileContent' }
        ];
        aboutCards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'about-card reveal active';
            cardEl.innerHTML = `
                <h3>${t(card.titleKey)}</h3>
                <p>${t(card.contentKey)}</p>
            `;
            aboutGrid.appendChild(cardEl);
        });
    }

    // Re-render Experience title
    if (data.experience) {
        document.getElementById('experience-title').innerText = t('experienceTitle');
    }

    // Re-render Skills title
    document.getElementById('skills-title').innerText = t('skillsTitle');

    // Re-render Projects title
    document.getElementById('projects-title').innerText = t('projectsTitle');

    // Update view details buttons
    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.textContent = t('viewDetails');
    });

    refreshDynamicEvents();
}

// Populate Data from Variable
async function initPortfolio() {
    try {
        const data = PORTFOLIO_DATA;

        // Populate Hero
        const heroContainer = document.getElementById('hero-content');
        heroContainer.innerHTML = `
            <h1 class="reveal">${t('heroTitle')}</h1>
            <p class="reveal">${t('heroDesc')}</p>
            <div class="hero-btns">
                <a href="#projects" class="btn btn-primary">${t('heroPrimaryBtn')}</a>
                <a href="#contact" class="btn btn-secondary">${t('heroSecondaryBtn')}</a>
            </div>
        `;

        // Populate About
        document.getElementById('about-title').innerText = t('aboutTitle');
        const aboutGrid = document.getElementById('about-grid');
        const aboutCards = [
            { titleKey: 'aboutStoryTitle', contentKey: 'aboutStoryContent' },
            { titleKey: 'aboutProfileTitle', contentKey: 'aboutProfileContent' }
        ];
        aboutCards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'about-card reveal';
            cardEl.innerHTML = `
                <h3>${t(card.titleKey)}</h3>
                <p>${t(card.contentKey)}</p>
            `;
            aboutGrid.appendChild(cardEl);
        });

        // Populate Experience
        if (data.experience) {
            document.getElementById('experience-title').innerText = t('experienceTitle');
            const experienceTimeline = document.getElementById('experience-timeline');
            data.experience.items.forEach(exp => {
                const expEl = document.createElement('div');
                expEl.className = 'experience-item reveal';
                expEl.innerHTML = `
                    <div class="exp-header">
                        <div class="exp-role-company">
                            <h3>${exp.role}</h3>
                            <h4>${exp.company}</h4>
                        </div>
                        <span class="exp-duration">${exp.duration}</span>
                    </div>
                    <div class="exp-body">
                        <ul>
                            ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                        </ul>
                        <div class="exp-tech">
                            <strong>Tech:</strong> ${exp.tech_stack}
                        </div>
                    </div>
                `;
                experienceTimeline.appendChild(expEl);
            });
        }

        // Populate Skills
        document.getElementById('skills-title').innerText = t('skillsTitle');
        const skillsContainer = document.getElementById('skills-container');
        data.skills.list.forEach(skill => {
            const skillEl = document.createElement('div');
            skillEl.className = 'skill-tag';
            skillEl.innerText = skill;
            skillsContainer.appendChild(skillEl);
        });

        // Initial render for static sections
        refreshDynamicEvents();

        // Fetch GitHub Projects dynamically
        try {
            const githubRes = await fetch('https://api.github.com/users/widifirmaan/repos?sort=updated&type=owner&per_page=100');
            if (githubRes.ok) {
                const repos = await githubRes.json();
                const colors = ['#00E5FF', '#FF5E5B', '#FFFF00', '#FFC0CB', '#00FF00', '#FFFFFF'];
                const excludeRepos = ['widifirmaan.github.io', 'nextjs-telefish', 'bash-android-aio-bypass-kit', 'clover-asus-vivobookflip-tp410ua'];

                // Exclude specific unwanted repos and forks
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
                        images: [`https://opengraph.githubassets.com/1/${repo.full_name}`],
                        description: repo.description || 'No description available for this repository.',
                        link: repo.homepage && repo.homepage !== "" ? repo.homepage : repo.html_url
                    };
                });
            }
        } catch (e) {
            console.error('Error fetching GitHub repos:', e);
            // Will fallback to data.js projects if fetch fails
        }

        // Populate Projects
        document.getElementById('projects-title').innerText = t('projectsTitle');
        const projectGrid = document.getElementById('project-grid');
        data.projects.list.forEach((project, index) => {
            const projectEl = document.createElement('div');
            projectEl.className = 'project-card reveal';
            projectEl.innerHTML = `
                <div class="project-image" id="project-image-${index}" style="background-color: ${project.color};">
                    ${project.images && project.images.length > 0 ? `<img src="${project.images[0]}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover;">` : ''}
                </div>
                <div class="project-info">
                    <h3>${project.title.toUpperCase()}</h3>
                    <button class="btn btn-primary project-btn" data-index="${index}">${t('viewDetails')}</button>
                </div>
            `;
            projectGrid.appendChild(projectEl);
        });

        // Fetch READMEs for thumbnails asynchronously
        data.projects.list.forEach((p, idx) => {
            if (p.repo) {
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
                        const imgRegex = /!\[.*?\]\(((?:[^)(]+|\([^)(]*\))+)\)|<img.*?src=["'](.*?)["']/g;
                        let images = [];
                        let match;
                        while ((match = imgRegex.exec(text)) !== null) {
                            let url = match[1] || match[2];
                            if (url && !url.includes('shields.io') && !url.includes('badge')) {
                                if (!url.startsWith('http')) {
                                    url = `https://raw.githubusercontent.com/${p.repo}/${p.branch}/${url.replace(/^\.\//, '')}`;
                                }
                                images.push(url);
                            }
                        }

                        // Remove duplicates
                        images = [...new Set(images)];

                        if (images.length > 0) {
                            p.images = images; // Update data so modal gets these
                            const imgContainer = document.getElementById(`project-image-${idx}`);
                            if (imgContainer) {
                                let gridClass = 'project-image-grid-1';
                                if (images.length === 2) gridClass = 'project-image-grid-2';
                                else if (images.length === 3) gridClass = 'project-image-grid-3';
                                else if (images.length >= 4) gridClass = 'project-image-grid-4';

                                imgContainer.className = `project-image project-image-grid ${gridClass}`;
                                imgContainer.style.backgroundColor = 'var(--black)';

                                const numImages = Math.min(images.length, 4);
                                let html = '';
                                for (let i = 0; i < numImages; i++) {
                                    html += `<img src="${images[i]}" alt="${p.title}">`;
                                }
                                imgContainer.innerHTML = html;
                            }
                        }
                    })
                    .catch(err => { });
            }
        });

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

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        closeModal.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };

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

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
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
                tags.forEach((tag, i) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0) scale(1)';
                    }, i * 100);
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

            // Stop observing — animate only once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Dynamic Floating Shapes Parallax
document.addEventListener('mousemove', (e) => {
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

// Curtain Scroll Animation
const leftPanel = document.querySelector('.curtain-panel.left');
const rightPanel = document.querySelector('.curtain-panel.right');
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
        leftPanel.style.transform = `translateY(-${curtainProgress * 100}%)`;
        rightPanel.style.transform = `translateY(${curtainProgress * 100}%)`;
    } else {
        leftPanel.style.transform = `translateX(-${curtainProgress * 100}%)`;
        rightPanel.style.transform = `translateX(${curtainProgress * 100}%)`;
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
