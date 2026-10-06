/**
 * ==========================================================================
 * BHARATH C V — PORTFOLIO INTERACTION ARCHITECTURE
 * Handles Cinematic Opening, Theme Switcher, Skills Filtering,
 * Interactive Timeline, Clickable Project Modals, AI Chat Twin,
 * Contact Form with API Integration Notes, and Parallax Effects.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. CINEMATIC OPENING EXPERIENCE
  // --------------------------------------------------------------------------
  const introScreen = document.getElementById('intro-screen');
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Completes the cinematic intro and unlocks the canvas
   */
  function dismissIntro() {
    if (!introScreen) return;
    introScreen.classList.add('fade-out');
    body.classList.remove('is-loading');

    setTimeout(() => {
      if (introScreen.parentNode) {
        introScreen.remove();
      }
    }, 850);
  }

  if (prefersReducedMotion) {
    dismissIntro();
  } else {
    // 1.7 second cinematic sequence
    setTimeout(() => {
      dismissIntro();
    }, 1700);
  }

  // --------------------------------------------------------------------------
  // 2. NIGHT MODE / THEME TOGGLE
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('editorial-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const activeTheme = savedTheme || (systemDark ? 'dark' : 'light');

  function updateTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('editorial-theme', theme);

    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', isDark.toString());
      const label = themeToggle.querySelector('.theme-pill-label');
      if (label) {
        label.textContent = isDark ? 'Light' : 'Night';
      }
    }
  }

  // Initialize theme
  updateTheme(activeTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'light';
      const target = current === 'dark' ? 'light' : 'dark';
      updateTheme(target);
    });
  }

  // --------------------------------------------------------------------------
  // 3. ORGANIC FLOATING PARALLAX (HERO CARDS)
  // --------------------------------------------------------------------------
  const heroSection = document.getElementById('hero');
  const floatingCards = document.querySelectorAll('.hero-card');

  if (heroSection && floatingCards.length > 0 && !prefersReducedMotion) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX = (e.clientX - centerX) / (rect.width / 2);
      mouseY = (e.clientY - centerY) / (rect.height / 2);
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    function renderParallax() {
      if (window.innerWidth > 1100) {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        floatingCards.forEach((card) => {
          const depth = parseFloat(card.getAttribute('data-depth')) || 1;
          const moveX = currentX * 18 * depth;
          const moveY = currentY * 18 * depth;
          card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
      } else {
        floatingCards.forEach((card) => {
          card.style.transform = '';
        });
      }

      requestAnimationFrame(renderParallax);
    }

    renderParallax();
  }

  // --------------------------------------------------------------------------
  // 4. SCROLL INTERSECTION REVEALS & PROGRESS BAR ANIMATION (Prompt 5 & 14)
  // --------------------------------------------------------------------------
  const revealCards = document.querySelectorAll('.floating-card:not(.hero-card)');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    revealCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';

          // Animate progress bars when entering viewport (Prompt 5)
          const progressFills = entry.target.querySelectorAll('.pixel-progress-fill');
          progressFills.forEach(fill => {
            const parentBar = fill.closest('.pixel-progress-bar');
            if (parentBar) {
              const targetPct = parentBar.style.getPropertyValue('--skill-pct') || '85%';
              fill.style.width = targetPct;
            }
          });

          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealCards.forEach(card => observer.observe(card));
  }

  // --------------------------------------------------------------------------
  // 5. SKILLS SECTION: CATEGORY FILTERING (Prompt 5)
  // Allows visitors to toggle between Backend, Databases, Frontend, and Tools.
  // --------------------------------------------------------------------------
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillClusters = document.querySelectorAll('.skill-cluster');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active tab state
      skillFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter skill cards with smooth transition
      skillClusters.forEach(cluster => {
        const category = cluster.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          cluster.style.display = 'flex';
          setTimeout(() => {
            cluster.style.opacity = '1';
            cluster.style.transform = 'translateY(0)';
          }, 10);
        } else {
          cluster.style.opacity = '0';
          cluster.style.transform = 'translateY(12px)';
          setTimeout(() => {
            cluster.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. TIMELINE SECTION: MILESTONE FILTERING (Prompt 6)
  // Filters career milestones between Education, Major Projects, and Career.
  // --------------------------------------------------------------------------
  const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
  const timelineSteps = document.querySelectorAll('.timeline-step');

  timelineFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-timeline-filter');

      timelineFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      timelineSteps.forEach(step => {
        const milestone = step.getAttribute('data-milestone');
        if (filter === 'all' || milestone === filter) {
          step.style.display = 'grid';
          setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          }, 10);
        } else {
          step.style.opacity = '0';
          step.style.transform = 'translateY(8px)';
          setTimeout(() => {
            step.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. PROJECTS SECTION: CLICKABLE THUMBNAILS & MODAL DIALOG (Prompt 7)
  // Clicking any project thumbnail triggers a detailed specifications modal.
  // Code connects each thumbnail's data-project-id to detailed project metadata.
  // --------------------------------------------------------------------------
  
  // Project detail dataset for interactive modal view
  const projectDetails = {
    piezo: {
      index: 'PROJECT 01',
      year: '2026',
      badge: 'INTERDISCIPLINARY R&D',
      title: 'Piezoelectric Energy Generation & Conversion System',
      image: 'piezo_preview.jpg',
      synopsis: 'An empirical investigation into harvesting ambient kinetic energy from footfall and mechanical pressure. Explored the conversion mechanics of calibrated piezoelectric transducer clusters, full-wave diode bridge rectification, and low-loss capacitor energy storage buffer banks.',
      techStack: ['Energy Harvesting', 'Piezo Transducers', 'Bridge Rectification', 'Sensor Nodes', 'Hardware Testing', 'Signal Analysis'],
      achievements: [
        'Conducted a rigorous 6-week research cycle measuring dynamic open-circuit voltages under calibrated pressure pulses.',
        'Designed full-wave Schottky bridge rectification circuitry with capacitor buffer storage to minimize forward diode voltage drop.',
        'Evaluated charge accumulation cycles to power low-power IoT sensor beacons, demonstrating renewable micro-generation viability.',
        'Documented comprehensive voltage vs. mechanical deflection curves and storage stability metrics.'
      ],
      primaryLinkText: 'Discuss Research →',
      primaryLinkUrl: 'mailto:bharathcv440@gmail.com?subject=Inquiry%20regarding%20Piezoelectric%20Energy%20Harvesting'
    },
    backend: {
      index: 'PROJECT 02',
      year: '2026',
      badge: 'BACKEND ARCHITECTURE',
      title: 'Distributed Spring Boot Backend & RESTful Microservices',
      image: 'backend_preview.jpg',
      synopsis: 'An enterprise-grade software architecture template engineered with modern Java 21 and the Spring Boot framework. Features strictly layered architecture (Controller, Service, Repository), comprehensive Jakarta Bean Validation, and relational MySQL persistence.',
      techStack: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'RESTful APIs', 'MySQL 8.0', 'Maven', 'JUnit 5'],
      achievements: [
        'Engineered stateless, predictable RESTful endpoints following HTTP semantics and standard status codes.',
        'Implemented global exception handling with @ControllerAdvice to return standardized JSON error envelopes.',
        'Configured HikariCP connection pooling and Spring Data JPA repositories with optimized queries to prevent N+1 query overhead.',
        'Architected clean DTO request/response mapping and bean validation layers to safeguard internal entity schemas.'
      ],
      primaryLinkText: 'GitHub Repository →',
      primaryLinkUrl: 'https://github.com'
    },
    database: {
      index: 'PROJECT 03',
      year: '2026',
      badge: 'DATABASE OPTIMIZATION',
      title: 'Relational Data Engine & Query Performance Benchmark',
      image: 'sql_preview.jpg',
      synopsis: 'A database engineering workbench designed to explore relational normalization trade-offs, composite indexing strategies, and automated query execution plan profiling under concurrent transactional loads.',
      techStack: ['MySQL 8.0', 'Relational 3NF', 'B-Tree Indexing', 'EXPLAIN Profiling', 'ACID Compliance', 'Transactions'],
      achievements: [
        'Designed normalized Third Normal Form (3NF) database schemas ensuring strict data integrity and zero redundancy.',
        'Benchmarked composite B-Tree indexes, achieving a 75% reduction in query latency on multi-million row datasets.',
        'Profiled MySQL EXPLAIN execution plans to convert table scans into high-speed index range scans.',
        'Validated transactional consistency across multi-table updates using strict ACID isolation levels.'
      ],
      primaryLinkText: 'Discuss Schema & Specs →',
      primaryLinkUrl: 'mailto:bharathcv440@gmail.com?subject=Inquiry%20regarding%20Database%20Optimization%20Workbench'
    },
    portfolio: {
      index: 'PROJECT 04',
      year: '2026',
      badge: 'DESIGN ARCHITECTURE',
      title: 'Minimalist Editorial Floating Portfolio & Design System',
      image: 'design_preview.jpg',
      synopsis: 'A high-aesthetic developer showcase engineered from scratch with pure semantic HTML5, custom CSS properties, physical diffused shadows, subtle pixel-art styling, and an interactive conversational AI digital twin.',
      techStack: ['Semantic HTML5', 'CSS Custom Tokens', 'Vanilla JavaScript', 'Pixel Art Accents', 'Responsive Design', 'A11y'],
      achievements: [
        'Built with zero external UI frameworks (No Tailwind / Bootstrap) for maximum control and sub-50ms load performance.',
        'Integrated cinematic SVG opening sequence with respectful prefers-reduced-motion user accessibility.',
        'Crafted smooth physics-based card hover transitions and organic mouse parallax effects on hero identity elements.',
        'Fully responsive across all screen dimensions with complete dark/night mode palette persistence.'
      ],
      primaryLinkText: 'Back to Hero ↑',
      primaryLinkUrl: '#hero'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Modal content elements
  const modalImg = document.getElementById('modal-project-img');
  const modalBadge = document.getElementById('modal-project-badge');
  const modalIndex = document.getElementById('modal-project-index');
  const modalYear = document.getElementById('modal-project-year');
  const modalTitle = document.getElementById('modal-project-title');
  const modalSynopsis = document.getElementById('modal-project-synopsis');
  const modalTechStack = document.getElementById('modal-tech-stack');
  const modalAchievements = document.getElementById('modal-achievements');
  const modalPrimaryLink = document.getElementById('modal-primary-link');

  /**
   * Opens Project Modal and populates data based on projectId
   * @param {string} projectId - Identifier matching projectDetails key
   */
  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !projectModal) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalBadge.textContent = data.badge;
    modalIndex.textContent = data.index;
    modalYear.textContent = data.year;
    modalTitle.textContent = data.title;
    modalSynopsis.textContent = data.synopsis;

    // Populate Tech Stack pills
    modalTechStack.innerHTML = '';
    data.techStack.forEach(tech => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.textContent = tech;
      modalTechStack.appendChild(pill);
    });

    // Populate Key Achievements
    modalAchievements.innerHTML = '';
    data.achievements.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      modalAchievements.appendChild(li);
    });

    // Configure primary button
    modalPrimaryLink.textContent = data.primaryLinkText;
    modalPrimaryLink.href = data.primaryLinkUrl;

    // Show modal and prevent body scroll
    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes Project Modal dialog
   */
  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach click listener to all clickable thumbnails (Prompt 7)
  const thumbnailTriggers = document.querySelectorAll('.project-thumbnail-trigger');
  thumbnailTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const card = trigger.closest('.project-card');
      const projectId = card ? card.getAttribute('data-project-id') : null;
      if (projectId) {
        openProjectModal(projectId);
      }
    });

    // Keyboard accessibility: Enter or Space triggers thumbnail
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const card = trigger.closest('.project-card');
        const projectId = card ? card.getAttribute('data-project-id') : null;
        if (projectId) {
          openProjectModal(projectId);
        }
      }
    });
  });

  // Attach click listener to "Detailed Specs" buttons
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  // Close modal via close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  // Close modal when clicking backdrop outside dialog
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Keyboard shortcut: Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) {
      closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // 8. AI CHAT INTERFACE INTEGRATION (Prompt 10)
  // Interactive conversational digital twin simulating messages with realistic
  // typing indicators. Code comments detail where OpenAI/LLM API connects.
  // --------------------------------------------------------------------------
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-user-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatTyping = document.getElementById('chat-typing');
  const chatResetBtn = document.getElementById('chat-reset-btn');
  const chatChips = document.querySelectorAll('.chat-chip-btn');

  // Knowledge base responses for the virtual digital twin
  const aiKnowledge = [
    {
      keywords: ['skill', 'stack', 'tech', 'language', 'java', 'programming', 'c', 'spring'],
      reply: 'Bharath specializes in **Core Java & OOP** (92% proficiency), **Spring Boot** microservices, **MySQL** relational databases, and **C programming**. He also has strong frontend skills in modern semantic HTML5, vanilla CSS design systems, and JavaScript (ES6+).'
    },
    {
      keywords: ['piezo', 'piezoelectric', 'hardware', 'transducer', 'energy', 'sensor'],
      reply: 'The **Piezoelectric Energy Harvesting** project was a 6-week interdisciplinary R&D endeavor where Bharath tested transducer clusters to convert kinetic pressure into usable electrical energy, pairing bridge rectifiers with capacitor banks to power remote IoT sensor nodes.'
    },
    {
      keywords: ['education', 'college', 'degree', 'ait', 'sgpa', 'cgpa', 'marks', 'academic', 'study'],
      reply: 'Bharath is pursuing his **Bachelor of Engineering in Electrical & Electronics Engineering** at **Adichunchanagiri Institute of Technology (AIT)**, Chikkamagaluru (2025–2028). He achieved an **8.0 SGPA** in Semester 2 and currently maintains a cumulative CGPA of 7.35.'
    },
    {
      keywords: ['backend', 'spring boot', 'rest', 'api', 'microservice', 'mvc'],
      reply: 'Bharath architects clean, modular backends with **Spring Boot 3** and **Java 21**. His projects feature stateless REST APIs, DTO validation, service-repository layer separation, and MySQL 8.0 query indexing.'
    },
    {
      keywords: ['hire', 'intern', 'internship', 'job', 'role', 'available', 'opportunity', 'fresher', 'work'],
      reply: 'Yes! Bharath is an **aspiring software developer** actively seeking engineering internships and junior software developer roles. He is open to remote roles as well as relocation across tech hubs in India and worldwide.'
    },
    {
      keywords: ['contact', 'email', 'phone', 'reach', 'message'],
      reply: 'You can reach Bharath directly via email at **bharathcv440@gmail.com** or phone at **+91 8618941372**. You can also submit the Contact form below!'
    },
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'who are you'],
      reply: 'Hello! I am Bharath\'s AI Digital Twin. I can answer questions about his technical projects, programming competencies, engineering education at AIT, and availability for software roles. Ask me anything!'
    }
  ];

  /**
   * Appends a message bubble to the chat container
   * @param {string} sender - 'ai' or 'user'
   * @param {string} text - Message text or markdown-style text
   */
  function appendChatMessage(sender, text) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message message-${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar pixel-font';
    avatarDiv.textContent = sender === 'ai' ? 'B_AI' : 'YOU';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    // Simple markdown bold formatting: **bold** -> <strong>bold</strong>
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    bubbleDiv.innerHTML = `<p>${formattedText}</p><span class="message-time pixel-font">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Simulates AI thinking, calls AI logic or external API, and appends response
   * @param {string} query - The user's input prompt
   */
  function handleAISimulation(query) {
    if (chatTyping) {
      chatTyping.style.display = 'flex';
    }
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /*
     * =========================================================================
     * OPENAI / GEMINI API INTEGRATION POINT (Prompt 10)
     * =========================================================================
     * To connect this interface to a live LLM (such as OpenAI GPT-4o or Google Gemini),
     * replace the setTimeout block below with an asynchronous fetch request:
     * 
     * Example OpenAI Integration:
     * -------------------------------------------------------------------------
     * const response = await fetch('https://api.openai.com/v1/chat/completions', {
     *   method: 'POST',
     *   headers: {
     *     'Content-Type': 'application/json',
     *     'Authorization': `Bearer ${YOUR_OPENAI_API_KEY}`
     *   },
     *   body: JSON.stringify({
     *     model: 'gpt-4o-mini',
     *     messages: [
     *       { role: 'system', content: 'You are Bharath C V, an aspiring software developer specializing in Java and Spring Boot...' },
     *       { role: 'user', content: query }
     *     ]
     *   })
     * });
     * const data = await response.json();
     * const aiText = data.choices[0].message.content;
     * appendChatMessage('ai', aiText);
     * =========================================================================
     */

    // Simulated response with realistic 650ms delay
    setTimeout(() => {
      if (chatTyping) {
        chatTyping.style.display = 'none';
      }

      const lowerQuery = query.toLowerCase();
      let matchedReply = null;

      for (const item of aiKnowledge) {
        const hasKeyword = item.keywords.some(kw => lowerQuery.includes(kw));
        if (hasKeyword) {
          matchedReply = item.reply;
          break;
        }
      }

      if (!matchedReply) {
        matchedReply = `Thank you for your interest! Bharath is passionate about building solid backend systems in **Java & Spring Boot**, relational data modeling with **MySQL**, and tackling interdisciplinary challenges like his **piezoelectric project**. Please reach out via email at **bharathcv440@gmail.com** for more details!`;
      }

      appendChatMessage('ai', matchedReply);
    }, 650);
  }

  // Handle Chat Form Submit
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      appendChatMessage('user', message);
      chatInput.value = '';
      handleAISimulation(message);
    });
  }

  // Quick Question Chips: Clicking sends pre-configured prompt
  chatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        appendChatMessage('user', prompt);
        handleAISimulation(prompt);
      }
    });
  });

  // Chat Reset Button
  if (chatResetBtn && chatMessages) {
    chatResetBtn.addEventListener('click', () => {
      chatMessages.innerHTML = `
        <div class="chat-message message-ai">
          <div class="message-avatar pixel-font">B_AI</div>
          <div class="message-bubble">
            <p>Hello! I am <strong>Bharath's AI Digital Twin</strong>. 👋</p>
            <p>Feel free to ask me anything about Bharath's core competencies in <strong>Java</strong>, <strong>Spring Boot</strong>, his <strong>8.0 SGPA</strong> at AIT, or his <strong>piezoelectric hardware project</strong>. How can I help you today?</p>
            <span class="message-time pixel-font">System Initialized</span>
          </div>
        </div>
      `;
    });
  }

  // --------------------------------------------------------------------------
  // 9. CONTACT FORM WITH CONFIRMATION MESSAGE & API INTEGRATION (Prompt 11)
  // Handles form validation, displays an in-page confirmation banner, and
  // documents the Resend API / email service integration point.
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const confirmationBanner = document.getElementById('contact-confirmation');
  const dismissBannerBtn = document.getElementById('dismiss-banner-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      const submitBtn = document.getElementById('contact-submit-btn');

      // Basic client validation
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill out all required fields before transmitting your message.');
        return;
      }

      const submitSpan = submitBtn.querySelector('span');
      const originalText = submitSpan.textContent;

      submitBtn.disabled = true;
      submitSpan.textContent = 'Transmitting...';

      /*
       * =======================================================================
       * RESEND API / EMAIL SERVICE INTEGRATION POINT (Prompt 11)
       * =======================================================================
       * To send real emails to Bharath's inbox via Resend API (or EmailJS/SendGrid):
       * 
       * Example Resend API Integration:
       * -----------------------------------------------------------------------
       * fetch('https://api.resend.com/emails', {
       *   method: 'POST',
       *   headers: {
       *     'Content-Type': 'application/json',
       *     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
       *   },
       *   body: JSON.stringify({
       *     from: 'Portfolio Visitor <onboarding@resend.dev>',
       *     to: ['bharathcv440@gmail.com'],
       *     subject: `[Portfolio Inquiry] ${subjectInput.value.trim()}`,
       *     html: `
       *       <h3>New Portfolio Inquiry</h3>
       *       <p><strong>Name:</strong> ${nameInput.value.trim()}</p>
       *       <p><strong>Email:</strong> ${emailInput.value.trim()}</p>
       *       <p><strong>Subject:</strong> ${subjectInput.value.trim()}</p>
       *       <p><strong>Message:</strong></p>
       *       <p>${messageInput.value.trim()}</p>
       *     `
       *   })
       * });
       * =======================================================================
       */

      // Simulated successful dispatch with 600ms latency
      setTimeout(() => {
        // Display in-page confirmation banner (Prompt 11)
        if (confirmationBanner) {
          confirmationBanner.style.display = 'flex';
          confirmationBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        contactForm.reset();
        submitBtn.disabled = false;
        submitSpan.textContent = originalText;
      }, 600);
    });
  }

  // Dismiss confirmation banner
  if (dismissBannerBtn && confirmationBanner) {
    dismissBannerBtn.addEventListener('click', () => {
      confirmationBanner.style.display = 'none';
    });
  }

  // --------------------------------------------------------------------------
  // 10. MOBILE NAVIGATION MENU (Prompt 13)
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', (!isExpanded).toString());
      navMenu.classList.toggle('is-open');
    });

    const navLinks = navMenu.querySelectorAll('.nav-item-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. DYNAMIC COPYRIGHT YEAR
  // --------------------------------------------------------------------------
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

});
