// Raj's Java Software Developer Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. Theme Configuration (Dark / Light Mode)
    // =========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const themeIcon = document.getElementById('theme-icon');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeIcon.className = 'fas fa-sun';
            themeIconMobile.className = 'fas fa-sun';
        } else {
            document.documentElement.classList.remove('dark');
            themeIcon.className = 'fas fa-moon';
            themeIconMobile.className = 'fas fa-moon';
        }
        localStorage.setItem('theme', theme);
    };

    // Initial theme setup
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Toggle event listeners
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    themeToggleMobileBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    // =========================================================================
    // 2. Mobile Navigation Menu
    // =========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars text-xl';
        } else {
            icon.className = 'fas fa-times text-xl';
        }
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
        });
    });

    // =========================================================================
    // 3. Hero Typing Effect
    // =========================================================================
    const typingTextElement = document.getElementById('typing-text');
    const phrases = [
        "Java Software Developer",
        "Spring Boot Developer",
        "Backend API Engineer",
        "Clean Code Enthusiast"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deletion
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full text
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Brief pause before typing next
        }

        setTimeout(typeEffect, typingSpeed);
    };

    typeEffect();

    // =========================================================================
    // 4. Hero Code Class Runner (Developer.java)
    // =========================================================================
    const runCodeBtn = document.getElementById('run-code-btn');
    const codeOutput = document.getElementById('code-output');

    runCodeBtn.addEventListener('click', () => {
        codeOutput.classList.remove('hidden');
        runCodeBtn.classList.add('pointer-events-none');
        runCodeBtn.querySelector('i').className = 'fas fa-spinner animate-spin text-amber-500';
        
        setTimeout(() => {
            runCodeBtn.querySelector('i').className = 'fas fa-check text-emerald-500';
            runCodeBtn.classList.remove('pointer-events-none');
        }, 1500);
    });

    // =========================================================================
    // 5. Skills Filtering
    // =========================================================================
    const skillFilterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            skillFilterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate-fade-in');
                }
            });
        });
    });

    // =========================================================================
    // 6. Interactive Java Terminal Simulator
    // =========================================================================
    const terminalBody = document.getElementById('terminal-body');
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const quickCmdButtons = document.querySelectorAll('.terminal-quick-btn');

    // Terminal command history
    let commandHistory = [];
    let historyIndex = -1;

    // Helper to append text/HTML outputs to the terminal screen
    const appendToTerminal = (htmlContent) => {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        terminalBody.appendChild(div);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    // Execute custom terminal command
    const executeCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        
        // Command logging in terminal
        appendToTerminal(`<div class="text-slate-400 mt-2">raj@ubuntu:~$ <span class="text-white">${cmd}</span></div>`);

        if (trimmedCmd === '') return;

        // Add to history
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        switch (trimmedCmd) {
            case 'help':
                appendToTerminal(`
                    <div class="text-amber-500 font-bold mb-1">Available Commands:</div>
                    <table class="w-full text-xs font-mono text-slate-300">
                        <tr><td class="w-28 text-javaOrange">help</td><td>Show this directory of commands.</td></tr>
                        <tr><td class="text-javaOrange">about</td><td>Print core profile details about Raj.</td></tr>
                        <tr><td class="text-javaOrange">skills</td><td>List complete Java development technical stack.</td></tr>
                        <tr><td class="text-javaOrange">springboot run</td><td>Simulate starting a production Spring Boot application.</td></tr>
                        <tr><td class="text-javaOrange">db-status</td><td>Inspect PostgreSQL schema & connection status.</td></tr>
                        <tr><td class="text-javaOrange">java -version</td><td>Print active JVM JDK version.</td></tr>
                        <tr><td class="text-javaOrange">clear</td><td>Clear terminal screen logs.</td></tr>
                    </table>
                `);
                break;
                
            case 'about':
                appendToTerminal(`
                    <div class="text-slate-300 space-y-1">
                        <p><strong class="text-white">Name:</strong> Raj Kumar</p>
                        <p><strong class="text-white">Age:</strong> 23 Years</p>
                        <p><strong class="text-white">Role:</strong> Java Software Developer</p>
                        <p><strong class="text-white">Experience:</strong> 1 Year (Full-time)</p>
                        <p><strong class="text-white">Core Focus:</strong> REST APIs, Spring Boot Microservices, ORM/Hibernate, SQL tuning.</p>
                        <p class="text-slate-400 text-xs italic mt-1">"I build server-side solutions that scale seamlessly."</p>
                    </div>
                `);
                break;

            case 'skills':
                appendToTerminal(`
                    <div class="text-slate-300">
                        <div class="text-emerald-400 font-bold mb-1">Java Developer Stack Matrix:</div>
                        <p>+---------------------+---------------------------------+</p>
                        <p>| <span class="text-yellow-500">Category</span>            | <span class="text-yellow-500">Technologies / Frameworks</span>        |</p>
                        <p>+---------------------+---------------------------------+</p>
                        <p>| Core Languages      | Java 8/11/17, SQL, ES6 JS       |</p>
                        <p>| Frameworks          | Spring Boot, MVC, Security, Cloud|</p>
                        <p>| Persistence         | Hibernate ORM, JPA, JDBC        |</p>
                        <p>| Databases           | PostgreSQL, MySQL, H2 In-Memory |</p>
                        <p>| Tools & Devops      | Git, Docker, Maven, Postman, JWT|</p>
                        <p>| Testing             | JUnit 5, Mockito                |</p>
                        <p>+---------------------+---------------------------------+</p>
                    </div>
                `);
                break;

            case 'springboot run':
            case 'run':
                appendToTerminal(`<div class="text-emerald-400 animate-pulse">Initializing Spring Boot Application Bootstrap...</div>`);
                
                // Simulated Spring Boot Boot Sequence
                const logs = [
                    `
  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\\\ \\\\ \\\\ \\\\
( ( )\\___ | '_ | '_| | '_ \\\\/ _\` | \\\\ \\\\ \\\\ \\\\
 \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.2)
                    `,
                    `2024-10-14T10:24:15.102Z  INFO 14205 --- [           main] c.r.p.PortfolioApplicationKt            : Starting PortfolioApplication v1.0.0 on Ubuntu-Server-Raj`,
                    `2024-10-14T10:24:15.108Z  INFO 14205 --- [           main] c.r.p.PortfolioApplicationKt            : No active profile set, falling back to default profiles: default`,
                    `2024-10-14T10:24:16.890Z  INFO 14205 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.`,
                    `2024-10-14T10:24:17.310Z  INFO 14205 --- [           main] o.h.e.t.j.p.i.JtaPlatformInitiator      : HHH000490: Using JtaPlatform for transactions.`,
                    `2024-10-14T10:24:18.005Z  INFO 14205 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)`,
                    `2024-10-14T10:24:18.450Z  INFO 14205 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''`,
                    `2024-10-14T10:24:18.460Z  INFO 14205 --- [           main] c.r.p.PortfolioApplicationKt            : <span class="text-emerald-400 font-bold font-mono">✔ Application started successfully in 3.358 seconds (JVM running for 4.12)</span>`,
                    `<span class="text-blue-400">⚡ API endpoints online. Try hit: GET http://localhost:8080/api/v1/raj/profile</span>`
                ];

                let delay = 300;
                logs.forEach((log, index) => {
                    setTimeout(() => {
                        appendToTerminal(`<pre class="text-xs font-mono leading-tight text-emerald-500 whitespace-pre-wrap">${log}</pre>`);
                    }, delay * (index + 1));
                });
                break;

            case 'db-status':
                appendToTerminal(`
                    <div class="text-slate-300">
                        <div class="text-cyan-400 font-bold mb-1">PostgreSQL Database Connection Status:</div>
                        <p class="text-emerald-500">✔ Connection: ACTIVE (HikariPool-1)</p>
                        <p>Database: <span class="text-white">raj_portfolio_db</span></p>
                        <p>Total Tables: <span class="text-white">8</span></p>
                        <p>Active Schema: <span class="text-white">public</span></p>
                        <p>Pool Size: <span class="text-white">10 connections (2 active, 8 idle)</span></p>
                        <p class="text-slate-400 text-xs mt-2">Tables Catalog Matrix:</p>
                        <p class="text-xs text-slate-500">- customers (Rows: 1,420, Size: 240KB)</p>
                        <p class="text-xs text-slate-500">- orders (Rows: 9,851, Size: 1.2MB)</p>
                        <p class="text-xs text-slate-500">- products (Rows: 450, Size: 96KB)</p>
                        <p class="text-xs text-slate-500">- system_logs (Rows: 145,023, Size: 45MB)</p>
                    </div>
                `);
                break;

            case 'java -version':
                appendToTerminal(`
                    <div class="text-slate-300">
                        <p>openjdk version "17.0.8" 2023-07-18</p>
                        <p>OpenJDK Runtime Environment (build 17.0.8+7-Ubuntu-1ubuntu222.04)</p>
                        <p>OpenJDK 64-Bit Server VM (build 17.0.8+7-Ubuntu-1ubuntu222.04, mixed mode, sharing)</p>
                    </div>
                `);
                break;

            case 'clear':
                terminalBody.innerHTML = `
                    <div class="text-slate-500">// Terminal cleared. Type 'help' for options.</div>
                    <div class="text-slate-400">raj@ubuntu:~$ <span class="text-white">_</span></div>
                `;
                break;

            default:
                appendToTerminal(`<div class="text-rose-500">Command not found: '${cmd}'. Type <strong class="text-white">help</strong> to view valid commands.</div>`);
                break;
        }
    };

    // Form submit command handling
    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = terminalInput.value;
        executeCommand(cmd);
        terminalInput.value = '';
    });

    // Quick Command Buttons Click
    quickCmdButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });

    // Keyboard navigation for command history
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });

    // =========================================================================
    // 7. Technical Details Modal Management
    // =========================================================================
    const detailsModal = document.getElementById('details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalElements = [
        document.getElementById('close-modal'),
        document.getElementById('close-modal-btn')
    ];
    const projectDetailsButtons = document.querySelectorAll('.project-details-btn');

    const projectData = {
        shopease: {
            title: "ShopEase API - Enterprise E-Commerce Backend",
            content: `
                <div class="space-y-4">
                    <p><strong>ShopEase API</strong> is a fully-featured, production-ready backend designed with Spring Boot for highly scalable enterprise retail platforms.</p>
                    
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1 mb-2">Architectural Highlights:</h4>
                        <ul class="list-disc pl-5 space-y-1.5">
                            <li><strong>Security:</strong> Implements stateless Spring Security using custom JWT authentication and authorization roles (Admin, Merchant, Customer).</li>
                            <li><strong>Caching Layer:</strong> Integrated Redis caching for high-traffic endpoints (Product Catalog, Categories), boosting fetch queries by 60%.</li>
                            <li><strong>Database Design:</strong> Implemented safe transaction rollbacks using Spring's <code>@Transactional</code> under PostgreSQL, with precise many-to-many schema mapping.</li>
                            <li><strong>Payment Integration:</strong> Built mock transactional adapters resembling Stripe, handling asynchronous state webhooks.</li>
                        </ul>
                    </div>

                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl font-mono text-xs border border-slate-100 dark:border-slate-800 space-y-1">
                        <div class="text-amber-500 font-bold mb-1">API Endpoint Schema Example:</div>
                        <div>POST /api/v1/auth/login  --> Returns Bearer JWT</div>
                        <div>GET  /api/v1/products    --> Supports pagination & filtering (Cached)</div>
                        <div>POST /api/v1/orders      --> Processes checkout transaction</div>
                    </div>
                </div>
            `
        },
        taskflow: {
            title: "TaskFlow Engine - Distributed Task Scheduler",
            content: `
                <div class="space-y-4">
                    <p><strong>TaskFlow Engine</strong> is a complete microservices project designed to coordinate heavy scheduled workloads and distributed tasks across enterprise nodes.</p>
                    
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1 mb-2">Architectural Highlights:</h4>
                        <ul class="list-disc pl-5 space-y-1.5">
                            <li><strong>Service Registry & Discovery:</strong> Configured Spring Cloud Netflix Eureka for active service registration and dynamic client-side load balancing.</li>
                            <li><strong>API Gateway:</strong> Centralized routing using Spring Cloud Gateway, incorporating rate-limiting filters (Token Bucket Algorithm) to prevent API abuse.</li>
                            <li><strong>Asynchronous Pipelines:</strong> Integrated RabbitMQ message broker to handle non-blocking, heavy automated email notifications upon task completion.</li>
                            <li><strong>Resilience:</strong> Integrated Resilience4j Circuit Breaker patterns to gracefully fallback if the notification microservice is offline.</li>
                        </ul>
                    </div>

                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl font-mono text-xs border border-slate-100 dark:border-slate-800 space-y-1">
                        <div class="text-blue-500 font-bold mb-1">Microservices Topology:</div>
                        <div>[Client Request] --> [Spring Gateway: 8080]</div>
                        <div>                         |--> [Eureka Server: 8761]</div>
                        <div>                         |--> [Task Microservice: 8081]</div>
                        <div>                         |--> [Notification Microservice: 8082]</div>
                    </div>
                </div>
            `
        },
        libtrack: {
            title: "LibTrack System - Automated Library Manager",
            content: `
                <div class="space-y-4">
                    <p><strong>LibTrack System</strong> is a highly optimized core Java system coupled with Hibernate ORM to handle heavy concurrent operations for institutional libraries.</p>
                    
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1 mb-2">Architectural Highlights:</h4>
                        <ul class="list-disc pl-5 space-y-1.5">
                            <li><strong>Object-Relational Mapping:</strong> Leveraged advanced Hibernate mappings (One-to-Many, Many-to-Many) with Lazy Loading strategies to keep memory footprint low.</li>
                            <li><strong>Transaction Security:</strong> Implemented robust ACID transaction models avoiding deadlocks during simultaneous book checkouts.</li>
                            <li><strong>Fine Calculation Engine:</strong> Built customized algorithmic rule engines using Java Streams and LocalDates to dynamically compute late fees.</li>
                            <li><strong>Clean Console & API:</strong> Designed both a command-line dashboard and a lightweight HTTP layer using Spring Boot for seamless integration.</li>
                        </ul>
                    </div>

                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl font-mono text-xs border border-slate-100 dark:border-slate-800 space-y-1">
                        <div class="text-purple-500 font-bold mb-1">Domain Model Mapping snippet:</div>
                        <div>@Entity public class Book { @Id Long id; String title; }</div>
                        <div>@Entity public class Member { @OneToMany List&lt;Transaction&gt; checkouts; }</div>
                    </div>
                </div>
            `
        }
    };

    // Open Modal
    projectDetailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            const data = projectData[projectId];
            
            if (data) {
                modalTitle.textContent = data.title;
                modalBody.innerHTML = data.content;
                
                detailsModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    // Close Modal helpers
    const closeModal = () => {
        detailsModal.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling
    };

    closeModalElements.forEach(el => {
        el.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside of it
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !detailsModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // =========================================================================
    // 8. Contact Form Submission Simulator
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form field values
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        const message = document.getElementById('form-message').value;

        // Reset and display status box
        formStatus.classList.remove('hidden', 'bg-emerald-500/10', 'text-emerald-500', 'bg-rose-500/10', 'text-rose-500');
        formStatus.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        formStatus.innerHTML = `<i class="fas fa-spinner animate-spin"></i> Initializing SMTP handshake...`;

        // Simulated SMTP Transmission Steps
        const steps = [
            { text: "✔ Connected to mailserver.raj.developer", delay: 800 },
            { text: "✔ Authenticated TLS Security Layer", delay: 1500 },
            { text: "✔ Transmitting email payload data...", delay: 2200 },
            { text: "✔ Message transmitted successfully! Thank you, I will contact you soon.", delay: 3000 }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                formStatus.innerHTML = `<i class="fas fa-circle-notch animate-spin text-javaOrange"></i> ${step.text}`;
                
                // Final Success State
                if (index === steps.length - 1) {
                    formStatus.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
                    formStatus.classList.add('bg-emerald-500/10', 'text-emerald-500', 'border', 'border-emerald-500/20');
                    formStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${step.text}`;
                    
                    // Clear fields
                    contactForm.reset();
                }
            }, step.delay);
        });
    });

    // =========================================================================
    // 9. Current Copyright Year Helper
    // =========================================================================
    document.getElementById('current-year').textContent = new Date().getFullYear();

});
