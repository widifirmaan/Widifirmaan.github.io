// Populate Data from Variable
function initPortfolio() {
    try {
        const data = PORTFOLIO_DATA;

        // Populate Hero
        const heroContainer = document.getElementById('hero-content');
        heroContainer.innerHTML = `
            <h1 class="reveal">${data.hero.title}</h1>
            <p class="reveal">${data.hero.description}</p>
            <div class="hero-btns">
                <a href="#projects" class="btn btn-primary">${data.hero.primaryBtn}</a>
                <a href="#contact" class="btn btn-secondary">${data.hero.secondaryBtn}</a>
            </div>
        `;

        // Populate About
        document.getElementById('about-title').innerText = data.about.title;
        const aboutGrid = document.getElementById('about-grid');
        data.about.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'about-card reveal';
            cardEl.innerHTML = `
                <h3>${card.title}</h3>
                <p>${card.content}</p>
            `;
            aboutGrid.appendChild(cardEl);
        });

        // Populate Projects
        document.getElementById('projects-title').innerText = data.projects.title;
        const projectGrid = document.getElementById('project-grid');
        data.projects.list.forEach((project, index) => {
            const projectEl = document.createElement('div');
            projectEl.className = 'project-card reveal';
            projectEl.innerHTML = `
                <div class="project-image" style="background-color: ${project.color};">
                    ${project.images && project.images.length > 0 ? `<img src="${project.images[0]}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover;">` : ''}
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.tech}</p>
                    <button class="btn btn-primary project-btn" data-index="${index}">VIEW DETAILS →</button>
                </div>
            `;
            projectGrid.appendChild(projectEl);
        });

        // Modal Logic
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        const closeModal = document.querySelector('.close-modal');

        document.querySelectorAll('.project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                const p = data.projects.list[idx];

                modalBody.innerHTML = `
                    <h2 class="section-title">${p.title}</h2>
                    <div class="modal-tech-list">
                        ${p.tech.split(',').map(t => `<span class="skill-tag" style="opacity:1; transform:none;">${t.trim()}</span>`).join('')}
                    </div>
                    
                    <div class="modal-gallery">
                        <div class="gallery-main">
                            <img src="${p.images[0]}" id="main-gallery-img">
                        </div>
                        <div class="thumbnail-grid">
                            ${p.images.map((img, i) => `
                                <div class="thumb-item ${i === 0 ? 'active' : ''}" data-src="${img}">
                                    <img src="${img}">
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="modal-desc">
                        <p>${p.description}</p>
                    </div>
                    <div class="modal-links">
                        <a href="${p.link}" target="_blank" class="btn btn-primary">LIVE DEMO 🚀</a>
                        <a href="#" class="btn btn-secondary">SOURCE CODE 🛠️</a>
                    </div>
                `;

                // Thumbnail Click Logic
                const thumbs = modalBody.querySelectorAll('.thumb-item');
                const mainImg = modalBody.querySelector('#main-gallery-img');

                thumbs.forEach(thumb => {
                    thumb.addEventListener('click', function () {
                        mainImg.src = this.getAttribute('data-src');
                        thumbs.forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                    });
                });

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

        // Populate Skills
        document.getElementById('skills-title').innerText = data.skills.title;
        const skillsContainer = document.getElementById('skills-container');
        data.skills.list.forEach(skill => {
            const skillEl = document.createElement('div');
            skillEl.className = 'skill-tag';
            skillEl.innerText = skill;
            skillsContainer.appendChild(skillEl);
        });

        // Re-initialize observers and events after dynamic content is added
        refreshDynamicEvents();

    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

function refreshDynamicEvents() {
    // Re-select all elements that might be dynamic
    const revealItems = document.querySelectorAll('.reveal, .skills-container, .project-grid, .contact-box, .project-card');
    revealItems.forEach(el => observer.observe(el));

    // Update interactables for cursor
    const interactables = document.querySelectorAll('a, button, .project-card, .skill-tag, .curtain-panel');
    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(3)';
            cursor.style.backgroundColor = 'var(--secondary)';
        });
        item.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'var(--primary)';
        });
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
        } else {
            if (entry.target.classList.contains('skills-container')) {
                const tags = entry.target.querySelectorAll('.skill-tag');
                tags.forEach(tag => {
                    tag.style.opacity = '0';
                    tag.style.transform = 'translateY(20px) scale(0.8)';
                });
            }
            if (entry.target.classList.contains('project-grid')) {
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach(card => card.classList.remove('active'));
            }
            entry.target.classList.remove('active');
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

    // Form Submission (Simulated)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'SENT! 🚀';
            btn.style.background = '#00E5FF';

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }
});
