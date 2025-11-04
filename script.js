document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioGrid = document.querySelector(".portfolio-grid");
    const blogGrid = document.querySelector(".blog-grid");
    const metricCounters = document.querySelectorAll(".metric-value");
    const chatbotToggle = document.querySelector("#chatbotToggle");
    const chatbotWindow = document.querySelector(".chatbot-window");
    const chatbotClose = document.querySelector(".chatbot-close");
    const chatbotMessages = document.querySelector(".chatbot-messages");
    const chatbotForm = document.querySelector(".chatbot-input");
    const currentYearEl = document.querySelector("#currentYear");

    const root = document.documentElement;
    const computedStyles = getComputedStyle(root);
    const defaultAccent = computedStyles.getPropertyValue("--accent").trim() || "#35f3ff";
    const defaultGradient = computedStyles.getPropertyValue("--accent-grad").trim() || "linear-gradient(135deg, #6f5bff, #35f3ff)";

    const portfolioItems = Array.isArray(window.PORTFOLIO_ITEMS) ? window.PORTFOLIO_ITEMS : [];
    const blogPosts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
    const eventsList = Array.isArray(window.EVENTS_LIST) ? window.EVENTS_LIST : [];
    const musicPlaylists = Array.isArray(window.MUSIC_PLAYLISTS) ? window.MUSIC_PLAYLISTS : [];
    const immersionModes = Array.isArray(window.IMMERSION_MODES) ? window.IMMERSION_MODES : [];

    const modeGrid = document.querySelector(".mode-grid");
    const soundscapeGrid = document.querySelector(".soundscape-grid");
    const eventsGrid = document.querySelector(".events-grid");
    const audioStatusLabel = document.querySelector("[data-audio-status]");
    const currentModeLabel = document.querySelector("[data-current-mode]");
    const audioToggle = document.querySelector("#immersiveAudioToggle");
    const ambientAudio = document.querySelector("#ambientAudio");
    const telemetryNodes = document.querySelectorAll("[data-telemetry]");
    const energyBarElements = document.querySelectorAll(".energy-bar");

    let audioActive = false;
    let currentMode = null;

    const cannedResponses = {
        saludo: "Hola, soy el asistente IA de Xafronox. Puedo ayudarte con roadmap, media kit, agenda y recursos estratégicos.",
        roadmap: "El roadmap de Xafronox se enfoca en Nebula OS 3.0, expansión de Atlas Collective y nuevas alianzas con venture studios.",
        media: "Descarga el media kit completo en https://xafronox.live/media-kit.pdf o solicita versiones personalizadas aquí.",
        agenda: "Reserva una sesión estratégica en https://cal.com/xafronox. Personalizamos mentorías, keynotes y workshops.",
        default: "Gracias por tu mensaje. En breve responderemos personalmente. También puedes escribir a hola@xafronox.com."
    };

    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const renderPortfolio = (filter) => {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = "";
        const items = filter === "todos"
            ? portfolioItems
            : portfolioItems.filter(item => item.category === filter);
        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const card = document.createElement("article");
            card.className = "portfolio-card";
            card.dataset.category = item.category;
            card.innerHTML = `
                <div class="card-header">
                    <h3>${item.title}</h3>
                    <div class="card-tags">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
                </div>
                <p>${item.description}</p>
                <div class="card-metrics">${item.metrics.map(metric => `<div class="metric-chip">${metric}</div>`).join("")}</div>
                <div class="portfolio-links">
                    <a href="${item.links.caseStudy}" target="_blank" rel="noopener">Caso de estudio →</a>
                    <a href="${item.links.deck}" target="_blank" rel="noopener">Investor deck →</a>
                </div>
            `;
            fragment.appendChild(card);
        });

        portfolioGrid.appendChild(fragment);
    };

    const renderBlog = () => {
        if (!blogGrid) return;
        const fragment = document.createDocumentFragment();
        blogPosts.forEach(post => {
            const card = document.createElement("article");
            card.className = "blog-card";
            card.innerHTML = `
                <span>${post.date}</span>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="${post.url}" target="_blank" rel="noopener">Leer artículo →</a>
            `;
            fragment.appendChild(card);
        });
        blogGrid.appendChild(fragment);
    };

    const updateModeUI = () => {
        if (currentModeLabel) {
            const icon = currentMode && currentMode.icon ? `${currentMode.icon} ` : "";
            currentModeLabel.textContent = currentMode ? `${icon}${currentMode.title}` : "Sin modo";
        }
        if (!modeGrid) return;
        modeGrid.querySelectorAll("button[data-mode]").forEach(button => {
            const isActive = currentMode && button.dataset.mode === currentMode.id;
            button.dataset.active = isActive ? "true" : "false";
            button.textContent = isActive ? "Activo" : "Activar";
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    };

    const applyMode = (modeId) => {
        const selectedMode = immersionModes.find(mode => mode.id === modeId);
        const classNames = immersionModes.map(mode => mode.className).filter(Boolean);
        if (classNames.length) {
            body.classList.remove(...classNames);
        }

        if (selectedMode) {
            currentMode = selectedMode;
            if (selectedMode.className) {
                body.classList.add(selectedMode.className);
            }
            root.style.setProperty("--accent", selectedMode.accent || defaultAccent);
            root.style.setProperty("--accent-grad", selectedMode.gradient || defaultGradient);
        } else {
            currentMode = null;
            root.style.setProperty("--accent", defaultAccent);
            root.style.setProperty("--accent-grad", defaultGradient);
        }

        updateModeUI();
    };

    const renderImmersiveModes = () => {
        if (!modeGrid) return;
        modeGrid.innerHTML = "";
        const fragment = document.createDocumentFragment();
        immersionModes.forEach(mode => {
            const card = document.createElement("article");
            card.className = "mode-card";
            if (mode.accent) {
                card.style.borderColor = `${mode.accent}55`;
            }
            card.innerHTML = `
                <div class="mode-headline">
                    <span class="mode-icon" aria-hidden="true">${mode.icon || ""}</span>
                    <h4>${mode.title}</h4>
                </div>
                <p>${mode.description}</p>
                <button type="button" data-mode="${mode.id}">Activar</button>
            `;
            const button = card.querySelector("button");
            if (button && mode.accent) {
                button.style.borderColor = `${mode.accent}55`;
                button.style.color = mode.accent;
            }
            fragment.appendChild(card);
        });
        modeGrid.appendChild(fragment);
        modeGrid.querySelectorAll("button[data-mode]").forEach(button => {
            button.addEventListener("click", () => applyMode(button.dataset.mode));
        });
        if (immersionModes.length) {
            applyMode(immersionModes[0].id);
        } else {
            updateModeUI();
        }
    };

    const renderSoundscapes = () => {
        if (!soundscapeGrid) return;
        soundscapeGrid.innerHTML = "";
        const fragment = document.createDocumentFragment();
        musicPlaylists.forEach(item => {
            const card = document.createElement("article");
            card.className = "sound-card";
            if (item.mood) {
                card.dataset.mood = item.mood;
            }
            const tags = (item.tags || []).map(tag => `<span>${tag}</span>`).join("");
            let embed = "";
            if (item.type === "spotify" && item.embed) {
                embed = `<iframe src="${item.embed}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
            } else if (item.type === "audio" && item.src) {
                embed = `<audio controls preload="metadata" src="${item.src}"></audio>`;
            }
            if (!embed) {
                embed = `<p class="sound-credits">Playlist disponible próximamente.</p>`;
            }
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="sound-tags">${tags}</div>
                ${embed}
                ${item.credits ? `<p class="sound-credits">${item.credits}</p>` : ""}
            `;
            fragment.appendChild(card);
        });
        soundscapeGrid.appendChild(fragment);
    };

    const renderEvents = () => {
        if (!eventsGrid) return;
        eventsGrid.innerHTML = "";
        const fragment = document.createDocumentFragment();
        eventsList.forEach(event => {
            const card = document.createElement("article");
            card.className = "event-card";
            card.innerHTML = `
                <div class="event-meta">
                    <span>${event.date}</span>
                    <span>${event.status || ""}</span>
                </div>
                <h3>${event.title}</h3>
                <p class="event-location">${event.location}</p>
                <p>${event.description}</p>
                <a href="${event.cta}" target="_blank" rel="noopener">Reservar lugar →</a>
            `;
            fragment.appendChild(card);
        });
        eventsGrid.appendChild(fragment);
    };

    const initEnergyBars = () => {
        energyBarElements.forEach(bar => {
            const fill = bar.querySelector(".fill");
            if (!fill) return;
            const value = Math.min(Math.max(parseInt(bar.dataset.value, 10) || 0, 0), 100);
            requestAnimationFrame(() => {
                fill.style.width = `${value}%`;
            });
        });
    };

    const updateAudioStatus = () => {
        if (audioStatusLabel) {
            audioStatusLabel.textContent = audioActive ? "On" : "Off";
        }
        if (audioToggle) {
            audioToggle.textContent = audioActive ? "Desactivar modo sonoro" : "Activar modo sonoro";
            audioToggle.classList.toggle("active", audioActive);
            audioToggle.setAttribute("aria-pressed", audioActive ? "true" : "false");
        }
    };

    const initImmersiveAudio = () => {
        if (!audioToggle || !ambientAudio) return;
        ambientAudio.volume = 0.32;
        audioToggle.addEventListener("click", async () => {
            try {
                if (!audioActive) {
                    await ambientAudio.play();
                    audioActive = true;
                } else {
                    ambientAudio.pause();
                    audioActive = false;
                }
            } catch (error) {
                console.error("No se pudo reproducir el audio inmersivo", error);
            }
            updateAudioStatus();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden && audioActive) {
                ambientAudio.pause();
                audioActive = false;
                updateAudioStatus();
            }
        });

        ambientAudio.addEventListener("pause", () => {
            if (audioActive) {
                audioActive = false;
                updateAudioStatus();
            }
        });

        ambientAudio.addEventListener("play", () => {
            if (!audioActive) {
                audioActive = true;
                updateAudioStatus();
            }
        });

        updateAudioStatus();
    };

    const initTelemetryPulse = () => {
        if (!telemetryNodes.length) return;
        const tick = () => {
            telemetryNodes.forEach(node => {
                const base = parseInt(node.dataset.base, 10) || 85;
                const jitter = Math.floor(Math.random() * 7) - 3;
                const next = Math.max(68, Math.min(100, base + jitter));
                node.textContent = `${next}%`;
            });
        };
        tick();
        setInterval(tick, 7000);
    };

    const animateCounters = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const targetValue = parseFloat(el.dataset.target);
                const isDecimal = el.dataset.target.includes(".");
                const duration = 1800;
                const steps = 120;
                let currentStep = 0;

                const updateCounter = () => {
                    currentStep += 1;
                    const progress = Math.min(currentStep / steps, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = targetValue * eased;
                    el.textContent = isDecimal ? value.toFixed(2) : Math.round(value).toLocaleString("es-ES");
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                };

                updateCounter();
                observer.unobserve(el);
            });
        }, { threshold: 0.6 });

        metricCounters.forEach(counter => observer.observe(counter));
    };

    const toggleNavigation = () => {
        if (!navToggle || !navLinks) return;
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
            });
        });
    };

    const handleFilter = () => {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                renderPortfolio(button.dataset.filter);
            });
        });
    };

    const initAOS = () => {
        if (window.AOS) {
            window.AOS.init({
                once: true,
                duration: 900,
                easing: "ease-out-quart"
            });
        }
    };

    const initChatbot = () => {
        if (!chatbotWindow || !chatbotToggle || !chatbotMessages || !chatbotForm) return;
        const openChat = () => chatbotWindow.classList.add("open");
        const closeChat = () => chatbotWindow.classList.remove("open");

        chatbotToggle.addEventListener("click", () => {
            chatbotWindow.classList.toggle("open");
            if (chatbotWindow.classList.contains("open") && !chatbotMessages.dataset.hasGreeted) {
                pushMessage("bot", cannedResponses.saludo);
                chatbotMessages.dataset.hasGreeted = "true";
            }
        });

        chatbotClose.addEventListener("click", closeChat);

        const pushMessage = (from, text) => {
            const bubble = document.createElement("div");
            bubble.className = `chatbot-message ${from}`;
            bubble.textContent = text;
            chatbotMessages.appendChild(bubble);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        chatbotForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = chatbotForm.message;
            const message = input.value.trim();
            if (!message) return;
            pushMessage("user", message);
            input.value = "";

            const normalized = normalize(message);
            let response = cannedResponses.default;
            if (normalized.includes("roadmap")) {
                response = cannedResponses.roadmap;
            } else if (normalized.includes("media") || normalized.includes("kit")) {
                response = cannedResponses.media;
            } else if (normalized.includes("agenda") || normalized.includes("reunion") || normalized.includes("call")) {
                response = cannedResponses.agenda;
            }

            setTimeout(() => pushMessage("bot", response), 400);
        });
    };

    const initThree = () => {
        const canvas = document.getElementById("portfolioCanvas");
        if (!canvas || !window.THREE) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const scene = new THREE.Scene();
        const fallbackParent = canvas.parentElement;
        const width = canvas.clientWidth || (fallbackParent ? fallbackParent.clientWidth : 600);
        const height = canvas.clientHeight || (fallbackParent ? fallbackParent.clientHeight : 420);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height, false);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 45);

        const ambientLight = new THREE.AmbientLight(0x88aaff, 0.6);
        const pointLight = new THREE.PointLight(0x6f5bff, 1.6);
        pointLight.position.set(18, 26, 32);
        scene.add(ambientLight, pointLight);

        const group = new THREE.Group();
        scene.add(group);

        const material = new THREE.MeshStandardMaterial({
            color: 0x6f5bff,
            metalness: 0.35,
            roughness: 0.25,
            emissive: 0x101133,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9
        });

        const geometry = new THREE.IcosahedronGeometry(12, 1);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x35f3ff, wireframe: true, opacity: 0.4, transparent: true });
        const solidMesh = new THREE.Mesh(geometry, material);
        const wireMesh = new THREE.Mesh(geometry, wireMaterial);
        group.add(solidMesh, wireMesh);

        const spriteMaterial = new THREE.SpriteMaterial({ color: 0xffffff });
        if (portfolioItems.length) {
            portfolioItems.forEach((item, index) => {
                const sprite = new THREE.Sprite(spriteMaterial.clone());
                const angle = (index / portfolioItems.length) * Math.PI * 2;
                const radius = 18;
                sprite.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.4) * radius * 0.6, Math.sin(angle) * radius);
                sprite.scale.set(1.2, 1.2, 1.2);
                sprite.userData.label = item.title;
                group.add(sprite);
            });
        }

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const tooltip = document.createElement("div");
        tooltip.className = "portfolio-tooltip";
        tooltip.style.position = "absolute";
        tooltip.style.pointerEvents = "none";
        tooltip.style.padding = "6px 12px";
        tooltip.style.borderRadius = "12px";
        tooltip.style.background = "rgba(15, 19, 48, 0.92)";
        tooltip.style.border = "1px solid rgba(111, 91, 255, 0.45)";
        tooltip.style.color = "#fff";
        tooltip.style.fontSize = "0.75rem";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 0.2s ease";
        tooltip.style.transform = "translate(-50%, -140%)";
        canvas.parentElement.appendChild(tooltip);

        const onPointerMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            tooltip.style.left = `${event.clientX - rect.left}px`;
            tooltip.style.top = `${event.clientY - rect.top}px`;
        };

        const tick = () => {
            group.rotation.y += 0.003;
            group.rotation.x += 0.0015;
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };

        const onHover = () => {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(group.children);
            const sprite = intersects.find(item => item.object.type === "Sprite");
            if (sprite) {
                tooltip.textContent = sprite.object.userData.label || "Proyecto";
                tooltip.style.opacity = "1";
            } else {
                tooltip.style.opacity = "0";
            }
        };

        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointermove", onHover);
        canvas.addEventListener("pointerleave", () => {
            tooltip.style.opacity = "0";
        });

        const handleResize = () => {
            const newWidth = canvas.clientWidth || (fallbackParent ? fallbackParent.clientWidth : width);
            const newHeight = canvas.clientHeight || (fallbackParent ? fallbackParent.clientHeight : height);
            renderer.setSize(newWidth, newHeight, false);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        };

        window.addEventListener("resize", handleResize);
        tick();
    };

    const initGSAP = () => {
        if (!window.gsap) return;
        if (window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
        }
        const hero = document.querySelector(".hero-intro");
        const cards = document.querySelectorAll(".portfolio-card");
        const soundCards = document.querySelectorAll(".sound-card");
        const eventCards = document.querySelectorAll(".event-card");
        const modeCards = document.querySelectorAll(".mode-card");
        window.gsap.from(hero, {
            opacity: 0,
            y: 40,
            duration: 1,
            delay: 0.2
        });
        if (cards.length) {
            const animationConfig = {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.08
            };
            if (window.ScrollTrigger) {
                animationConfig.scrollTrigger = {
                    trigger: ".portfolio-grid",
                    start: "top bottom"
                };
            }
            window.gsap.from(cards, animationConfig);
        }
        if (soundCards.length) {
            window.gsap.from(soundCards, {
                opacity: 0,
                y: 30,
                duration: 0.9,
                stagger: 0.1,
                delay: 0.15
            });
        }
        if (eventCards.length) {
            window.gsap.from(eventCards, {
                opacity: 0,
                y: 40,
                duration: 0.9,
                stagger: 0.08,
                delay: 0.2
            });
        }
        if (modeCards.length) {
            window.gsap.from(modeCards, {
                opacity: 0,
                y: 24,
                duration: 0.8,
                stagger: 0.06,
                delay: 0.1
            });
        }
    };

    const initScrollTo = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (event) {
                const targetId = this.getAttribute("href");
                if (!targetId || targetId === "#") return;
                const target = document.querySelector(targetId);
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            });
        });
    };

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    renderPortfolio("todos");
    renderBlog();
    renderImmersiveModes();
    renderSoundscapes();
    renderEvents();
    animateCounters();
    initEnergyBars();
    initImmersiveAudio();
    initTelemetryPulse();
    toggleNavigation();
    handleFilter();
    initChatbot();
    initThree();
    initAOS();
    initGSAP();
    initScrollTo();
});
