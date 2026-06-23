// Animated Ambient Glassmorphism Background
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-background';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  canvas.style.backgroundColor = '#060608';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const orbs = [
    {
      x: width * 0.25,
      y: height * 0.3,
      vx: 0.12,
      vy: 0.08,
      radius: Math.min(width, height) * 0.45,
      color: 'rgba(30, 27, 75, 0.15)', // Indigo (reduced opacity)
    },
    {
      x: width * 0.75,
      y: height * 0.7,
      vx: -0.1,
      vy: -0.12,
      radius: Math.min(width, height) * 0.5,
      color: 'rgba(76, 29, 149, 0.12)', // Violet (reduced opacity)
    },
    {
      x: width * 0.5,
      y: height * 0.5,
      vx: 0.06,
      vy: -0.06,
      radius: Math.min(width, height) * 0.4,
      color: 'rgba(8, 47, 73, 0.12)', // Sky Blue (reduced opacity)
    },
  ];

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    orbs[0].radius = Math.min(width, height) * 0.45;
    orbs[1].radius = Math.min(width, height) * 0.5;
    orbs[2].radius = Math.min(width, height) * 0.4;
  }

  window.addEventListener('resize', handleResize);

  // --- Floating Club Emojis Background Feature ---
  const style = document.createElement('style');
  style.textContent = `
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) {
      position: relative;
      z-index: 2;
      pointer-events: none; /* Let pointer events fall through empty space */
    }
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) .glass-card,
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) .glass-panel,
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) a,
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) button,
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) input,
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) select,
    body > *:not(#ambient-background):not(#floating-clubs-bg):not(.modal-backdrop):not(.invitation-overlay):not(#intro-loader):not(#navbar-placeholder) textarea {
      pointer-events: auto; /* Re-enable pointer events only for actual cards/buttons/inputs */
    }
    #floating-clubs-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1; /* Keep strictly in the background */
      overflow: hidden;
    }
    .floating-club-node {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .floating-club-node:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.25);
      box-shadow: 0 8px 30px rgba(255,255,255,0.08), 0 0 15px rgba(255,255,255,0.05);
    }
    .floating-club-emoji {
      font-size: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .floating-club-emoji img {
      width: 24px;
      height: 24px;
      object-fit: cover;
      border-radius: 4px;
    }
    .floating-club-tooltip {
      position: absolute;
      bottom: 125%;
      left: 50%;
      transform: translate(-50%, 6px) scale(0.92);
      opacity: 0;
      pointer-events: none;
      background: rgba(6, 6, 8, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 9px;
      font-family: sans-serif;
      font-weight: bold;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      transition: opacity 0.25s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .floating-club-node:hover .floating-club-tooltip {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
  `;
  document.head.appendChild(style);

  const floatContainer = document.createElement('div');
  floatContainer.id = 'floating-clubs-bg';
  document.body.prepend(floatContainer);

  let floatingNodes = [];

  function initFloatingClubs() {
    floatContainer.innerHTML = '';
    floatingNodes = [];
    if (typeof getClubs !== 'function') return;
    const clubs = getClubs();
    
    clubs.forEach((club) => {
      const el = document.createElement('div');
      el.className = 'floating-club-node';
      
      const isImg = club.logo.startsWith('http') || club.logo.startsWith('/') || club.logo.startsWith('.') || club.logo.includes('/');
      const needsInvert = ['coding', 'music', 'photography'].includes(club.category.toLowerCase());
      const filterStyle = needsInvert ? 'filter: invert(1) brightness(1.5);' : '';
      const logoHtml = isImg ? `<img src="${club.logo}" alt="${club.name}" style="${filterStyle}" />` : club.logo;
      
      el.innerHTML = `
        <span class="floating-club-emoji">${logoHtml}</span>
        <span class="floating-club-tooltip">${club.name}</span>
      `;
      
      // Click navigates to club details
      el.addEventListener('click', () => {
        window.location.href = `club-details.html?id=${club.id}`;
      });

      floatContainer.appendChild(el);

      const size = 44;
      const x = Math.random() * (window.innerWidth - size - 40) + 20;
      const y = Math.random() * (window.innerHeight - size - 40) + 20;
      
      // Random velocity (slow drift)
      const vx = (Math.random() - 0.5) * 0.4;
      const vy = (Math.random() - 0.5) * 0.4;

      let isHovered = false;
      el.addEventListener('mouseenter', () => { 
        isHovered = true; 
        floatContainer.style.zIndex = '9999';
        el.style.zIndex = '10000';
      });
      el.addEventListener('mouseleave', () => { 
        isHovered = false; 
        floatContainer.style.zIndex = '1';
        el.style.zIndex = '';
      });

      floatingNodes.push({
        element: el,
        x,
        y,
        vx,
        vy,
        size,
        get isHovered() { return isHovered; }
      });
    });
  }

  initFloatingClubs();
  window.addEventListener('resize', () => {
    // Re-initialize to keep them within bounds on resize
    initFloatingClubs();
  });

  function animate() {
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, width, height);

    // Draw Orbs
    orbs.forEach((orb) => {
      orb.x += orb.vx;
      orb.y += orb.vy;

      if (orb.x < -orb.radius || orb.x > width + orb.radius) orb.vx *= -1;
      if (orb.y < -orb.radius || orb.y > height + orb.radius) orb.vy *= -1;

      const gradient = ctx.createRadialGradient(
        orb.x,
        orb.y,
        0,
        orb.x,
        orb.y,
        orb.radius
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, 'rgba(6, 6, 8, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Blueprint Tech Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    const gridSize = 100;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Update floating club nodes
    floatingNodes.forEach(node => {
      if (!node.isHovered) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 10 || node.x > width - node.size - 10) {
          node.vx *= -1;
          node.x = Math.max(10, Math.min(node.x, width - node.size - 10));
        }
        if (node.y < 10 || node.y > height - node.size - 10) {
          node.vy *= -1;
          node.y = Math.max(10, Math.min(node.y, height - node.size - 10));
        }
      }
      
      node.element.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
})();
