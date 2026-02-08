/* Matrix Rain Canvas */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const columns = Math.floor(width / 20);
const drops = [];

// Initialize drops
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

const matrixChars = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ0123456789";

function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.05)'; // Fade effect (Cyber dark bg)
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0f0'; // Green text (or change to cyber-lime #bef264 for theme match)
    ctx.font = '15px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));

        // Randomly color characters (mostly green, occasional white/glitch)
        ctx.fillStyle = Math.random() > 0.95 ? '#fff' : '#bef264';

        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

// Resize handling
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});


/* Custom Cursor */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay (handled by CSS transition)
    cursorOutline.style.transform = `translate(${posX}px, ${posY}px)`;
});

// Hover Effect
const hoverTriggers = document.querySelectorAll('.hover-trigger');
hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
    });
    trigger.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
    });
});


/* Typing Animation */
const typingText = document.getElementById('typing-text');
const textToType = "System: Online | Latency: <1ms | status: Engineer @ Zoho";
let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        typingText.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50); // Typing speed
    }
}

// Start typing after a slight delay
setTimeout(typeWriter, 1000);


/* Intersection Observer for Animations */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Unobserve if you only want it to animate once
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.slide-in-bottom, .slide-in-left').forEach(el => {
    observer.observe(el);
});

/* Dynamic Experience Line Drawing */
const timelineContainer = document.getElementById('timeline-container');
const timelineLine = document.getElementById('timeline-line');
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Draw the line
            timelineLine.classList.add('animate-draw');

            // Reveal items sequentially relative to line drawing
            timelineItems.forEach((item, index) => {
                const dot = item.querySelector('.timeline-dot');
                const connector = item.querySelector('.timeline-connector');

                // Delay dots/connectors to match line progress roughly
                setTimeout(() => {
                    if (dot) dot.classList.add('scale-100');
                    if (connector) connector.classList.add('scale-100');
                    item.classList.remove('opacity-0');
                    item.classList.add('slide-in-bottom', 'visible');
                }, 500 + (index * 800)); // Stagger based on index
            });

            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (timelineContainer) {
    timelineObserver.observe(timelineContainer);
}

/* 3D Tilt Effect for Cards */
document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const inner = card.querySelector('.card-inner');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (max 10 degrees)
        const xRotation = -1 * ((y - rect.height / 2) / rect.height * 10);
        const yRotation = (x - rect.width / 2) / rect.width * 10;

        inner.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        const inner = card.querySelector('.card-inner');
        inner.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    });
});


/* Project Fetching (Backend Integration) */
const API_URL = '/api/projects';
const projectList = document.getElementById('project-list');

async function fetchProjects() {
    try {
        const response = await fetch(API_URL);
        const projects = await response.json();
        const otherProjects = projects.filter(p => !p.title.includes('Lovable'));
        renderProjects(otherProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

const iconMap = {
    'Java': 'fab fa-java',
    'Spring Boot': 'fas fa-leaf',
    'MySQL': 'fas fa-database',
    'Docker': 'fab fa-docker',
    'React': 'fab fa-react',
    'Node.js': 'fab fa-node-js',
    'Express': 'fas fa-server',
    'MongoDB': 'fas fa-envira',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'JavaScript': 'fab fa-js',
    'PostgreSQL': 'fas fa-database',
    'Redis': 'fas fa-memory'
};

function getTechIcon(tech) {
    return iconMap[tech] || 'fas fa-code';
}

function getProjectIcon(title) {
    if (title.toLowerCase().includes('commerce')) return 'fas fa-shopping-cart';
    if (title.toLowerCase().includes('task')) return 'fas fa-tasks';
    if (title.toLowerCase().includes('portfolio')) return 'fas fa-laptop-code';
    if (title.toLowerCase().includes('chat')) return 'far fa-comments';
    return 'far fa-folder';
}

function renderProjects(projects) {
    if (!projectList) return; // Guard clause
    projectList.innerHTML = '';
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = "group relative bg-cyber-slate/10 border border-white/5 rounded-lg overflow-hidden backdrop-blur-sm hover:border-cyber-lime/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(190,242,100,0.05)] opacity-0 slide-in-bottom";
        card.style.transitionDelay = `${index * 100}ms`;

        // Tech stack chips with icons
        const chips = (project.techStack || []).map(tech =>
            `<span class="px-2 py-1 bg-cyber-indigo/5 rounded text-cyber-indigo/80 text-xs border border-cyber-indigo/10 flex items-center gap-1">
                <i class="${getTechIcon(tech)}"></i> ${tech}
             </span>`
        ).join('');

        const links = [];
        if (project.githubLink) links.push(`<a href="${project.githubLink}" target="_blank" class="text-slate-500 hover:text-cyber-lime hover-trigger"><i class="fab fa-github"></i></a>`);
        if (project.liveLink) links.push(`<a href="${project.liveLink}" target="_blank" class="text-slate-500 hover:text-cyber-lime hover-trigger"><i class="fas fa-external-link-alt"></i></a>`);

        const projectIcon = getProjectIcon(project.title);

        card.innerHTML = `
            <div class="p-6 h-full flex flex-col">
                 <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-full bg-cyber-dark/50 flex items-center justify-center border border-white/5 group-hover:border-cyber-lime/50 transition-colors">
                        <i class="${projectIcon} text-lg text-slate-400 group-hover:text-cyber-lime transition-colors"></i>
                    </div>
                    <div class="flex gap-4 text-lg">
                        ${links.join('')}
                    </div>
                </div>
                <h3 class="text-xl font-bold mb-2 text-gray-200 group-hover:text-cyber-lime transition-colors">${project.title}</h3>
                <p class="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                    ${project.description}
                </p>
                <div class="flex flex-wrap gap-2 font-mono mt-4 pt-4 border-t border-white/5">
                    ${chips}
                </div>
            </div>
        `;

        observer.observe(card);
        // Important: Add hover listeners to new elements for cursor effect
        card.querySelectorAll('.hover-trigger').forEach(trigger => {
            trigger.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            trigger.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        projectList.appendChild(card);
    });
}

// Initial Fetch
fetchProjects();

/* Mobile Menu Toggle */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}
