<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LittleBits — Chapters & Exhibitions Hub</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0B0B0F;
    --card:rgba(18,18,24,0.72);
    --card-soft:rgba(255,255,255,0.04);
    --border:rgba(255,255,255,0.08);
    --text:#ECECF1;
    --muted:#8C8C99;
    --violet:#7C5CFC;
    --teal:#34D8C5;
    --amber:#F4B860;
    --display:'Space Grotesk', sans-serif;
    --body:'Inter', sans-serif;
    --mono:'JetBrains Mono', monospace;
  }

  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}

  body{
    background:
      radial-gradient(circle at 15% 0%, rgba(124,92,252,0.16), transparent 45%),
      radial-gradient(circle at 85% 20%, rgba(52,216,197,0.10), transparent 40%),
      var(--bg);
    color:var(--text);
    font-family:var(--body);
    overflow-x:hidden;
    min-height:100vh;
  }

  @media (prefers-reduced-motion: reduce){
    *{animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important;}
  }

  /* ---------- floating background emojis ---------- */
  .emoji-field{
    position:fixed; inset:0; z-index:0; overflow:hidden; pointer-events:none;
  }
  .emoji-field span{
    position:absolute;
    font-size:28px;
    opacity:0.16;
    bottom:-60px;
    filter:saturate(0.8);
    animation:float-up linear infinite;
  }
  @keyframes float-up{
    0%{transform:translateY(0) rotate(0deg); opacity:0;}
    10%{opacity:0.18;}
    90%{opacity:0.18;}
    100%{transform:translateY(-120vh) rotate(25deg); opacity:0;}
  }

  /* ---------- layout shell ---------- */
  .wrap{position:relative; z-index:1; max-width:980px; margin:0 auto; padding:0 24px;}

  header.hero{
    padding:120px 24px 80px;
    text-align:center;
    position:relative;
    z-index:1;
  }
  .eyebrow{
    font-family:var(--mono);
    font-size:12px;
    letter-spacing:0.18em;
    text-transform:uppercase;
    color:var(--teal);
    display:inline-flex;
    align-items:center;
    gap:8px;
    margin-bottom:22px;
    opacity:0;
    animation:rise 0.7s ease forwards;
    animation-delay:0.05s;
  }
  .eyebrow::before{
    content:'';
    width:6px; height:6px; border-radius:50%;
    background:var(--teal);
    box-shadow:0 0 0 0 rgba(52,216,197,0.6);
    animation:pulse 2s ease-in-out infinite;
  }
  @keyframes pulse{
    0%{box-shadow:0 0 0 0 rgba(52,216,197,0.5);}
    70%{box-shadow:0 0 0 8px rgba(52,216,197,0);}
    100%{box-shadow:0 0 0 0 rgba(52,216,197,0);}
  }

  h1.title{
    font-family:var(--display);
    font-weight:700;
    font-size:clamp(40px, 7vw, 76px);
    line-height:1.04;
    letter-spacing:-0.02em;
    background:linear-gradient(120deg,#fff 30%, var(--violet) 65%, var(--teal) 100%);
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
    background-size:200% 100%;
    animation:rise 0.8s ease forwards, sheen 6s linear infinite 1s;
    opacity:0;
    animation-delay:0.15s, 1.2s;
  }
  @keyframes sheen{
    0%{background-position:0% 0%;}
    100%{background-position:200% 0%;}
  }

  p.subtitle{
    font-size:18px;
    color:var(--muted);
    max-width:560px;
    margin:22px auto 0;
    line-height:1.6;
    opacity:0;
    animation:rise 0.8s ease forwards;
    animation-delay:0.3s;
  }

  @keyframes rise{
    from{opacity:0; transform:translateY(16px);}
    to{opacity:1; transform:translateY(0);}
  }

  .stack-tags{
    display:flex; flex-wrap:wrap; justify-content:center; gap:10px;
    margin-top:34px;
    opacity:0;
    animation:rise 0.8s ease forwards;
    animation-delay:0.45s;
  }
  .stack-tags span{
    font-family:var(--mono);
    font-size:12.5px;
    padding:7px 14px;
    border-radius:100px;
    background:var(--card-soft);
    border:1px solid var(--border);
    color:var(--muted);
  }

  /* ---------- toast demo button ---------- */
  .demo-row{
    margin-top:46px;
    display:flex; justify-content:center; gap:14px; flex-wrap:wrap;
    opacity:0; animation:rise 0.8s ease forwards; animation-delay:0.6s;
  }
  button.demo-btn{
    font-family:var(--body);
    font-weight:600;
    font-size:14.5px;
    color:var(--bg);
    background:linear-gradient(120deg,var(--teal),var(--violet));
    border:none;
    padding:13px 26px;
    border-radius:12px;
    cursor:pointer;
    transition:transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow:0 8px 24px rgba(124,92,252,0.25);
  }
  button.demo-btn:hover{transform:translateY(-2px); box-shadow:0 12px 30px rgba(124,92,252,0.35);}
  button.demo-btn:active{transform:translateY(0);}
  button.ghost-btn{
    font-family:var(--body);
    font-weight:600;
    font-size:14.5px;
    color:var(--text);
    background:var(--card-soft);
    border:1px solid var(--border);
    padding:13px 26px;
    border-radius:12px;
    cursor:pointer;
    transition:border-color 0.2s ease, background 0.2s ease;
  }
  button.ghost-btn:hover{border-color:var(--teal); background:rgba(52,216,197,0.06);}

  /* ---------- toast container (mirrors feature #7) ---------- */
  #toast-container{
    position:fixed;
    bottom:24px; right:24px;
    z-index:999;
    display:flex; flex-direction:column; gap:10px;
    width:300px;
  }
  .toast{
    background:var(--card);
    backdrop-filter:blur(16px);
    border:1px solid var(--border);
    border-left:3px solid var(--teal);
    border-radius:12px;
    padding:14px 16px;
    font-size:13.5px;
    display:flex; align-items:flex-start; gap:10px;
    animation:slide-in 0.35s ease forwards, fade-out 0.4s ease forwards 3.6s;
    box-shadow:0 12px 28px rgba(0,0,0,0.45);
  }
  .toast .dot{
    width:7px;height:7px;border-radius:50%;background:var(--teal);margin-top:4px;flex-shrink:0;
  }
  .toast .close{
    margin-left:auto; cursor:pointer; color:var(--muted); font-size:14px; line-height:1;
  }
  @keyframes slide-in{from{transform:translateX(40px); opacity:0;} to{transform:translateX(0); opacity:1;}}
  @keyframes fade-out{to{opacity:0; transform:translateX(20px);}}

  /* ---------- section heading ---------- */
  .section-head{
    margin:96px 0 36px;
  }
  .section-head .label{
    font-family:var(--mono);
    font-size:12px;
    letter-spacing:0.16em;
    text-transform:uppercase;
    color:var(--violet);
  }
  .section-head h2{
    font-family:var(--display);
    font-size:clamp(26px,4vw,36px);
    margin-top:8px;
    letter-spacing:-0.01em;
  }
  .section-head p{
    color:var(--muted);
    margin-top:10px;
    max-width:560px;
    line-height:1.6;
  }

  /* ---------- feature cards (reveal on scroll) ---------- */
  .feature-list{display:flex; flex-direction:column; gap:14px;}
  .feature{
    background:var(--card);
    backdrop-filter:blur(16px);
    border:1px solid var(--border);
    border-radius:16px;
    padding:24px 26px;
    display:grid;
    grid-template-columns:46px 1fr;
    gap:18px;
    opacity:0;
    transform:translateY(18px);
    transition:opacity 0.6s ease, transform 0.6s ease, border-color 0.25s ease, background 0.25s ease;
  }
  .feature.in-view{opacity:1; transform:translateY(0);}
  .feature:hover{border-color:rgba(124,92,252,0.4); background:rgba(24,22,34,0.78);}
  .feature .num{
    font-family:var(--mono);
    font-size:14px;
    color:var(--teal);
    background:rgba(52,216,197,0.08);
    border:1px solid rgba(52,216,197,0.25);
    border-radius:10px;
    width:40px; height:40px;
    display:flex; align-items:center; justify-content:center;
  }
  .feature h3{
    font-family:var(--display);
    font-size:17px;
    font-weight:600;
    margin-bottom:8px;
  }
  .feature p{
    font-size:14.5px;
    color:var(--muted);
    line-height:1.65;
  }
  .feature p strong{color:var(--text); font-weight:600;}
  .feature code{
    font-family:var(--mono);
    font-size:12.5px;
    background:rgba(255,255,255,0.06);
    padding:2px 6px;
    border-radius:5px;
    color:var(--amber);
  }

  /* ---------- tech grid ---------- */
  .tech-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:14px;
  }
  .tech-card{
    background:var(--card);
    backdrop-filter:blur(16px);
    border:1px solid var(--border);
    border-radius:14px;
    padding:20px;
    opacity:0; transform:translateY(18px);
    transition:opacity 0.6s ease, transform 0.6s ease;
  }
  .tech-card.in-view{opacity:1; transform:translateY(0);}
  .tech-card .role{
    font-family:var(--mono);
    font-size:11px;
    letter-spacing:0.1em;
    text-transform:uppercase;
    color:var(--violet);
    margin-bottom:8px;
  }
  .tech-card .val{font-size:14px; color:var(--text); line-height:1.5;}

  /* ---------- demo accounts ---------- */
  .accounts{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
    gap:16px;
  }
  .account-card{
    background:var(--card);
    backdrop-filter:blur(16px);
    border:1px solid var(--border);
    border-radius:16px;
    padding:22px;
    position:relative;
    overflow:hidden;
    opacity:0; transform:translateY(18px);
    transition:opacity 0.6s ease, transform 0.6s ease, transform 0.3s ease;
  }
  .account-card.in-view{opacity:1; transform:translateY(0);}
  .account-card:hover{transform:translateY(-4px);}
  .account-card .badge{
    display:inline-block;
    font-family:var(--mono);
    font-size:11px;
    padding:5px 11px;
    border-radius:100px;
    margin-bottom:14px;
  }
  .badge.super{background:rgba(124,92,252,0.15); color:#B9A6FF; border:1px solid rgba(124,92,252,0.35);}
  .badge.club{background:rgba(244,184,96,0.15); color:var(--amber); border:1px solid rgba(244,184,96,0.35);}
  .badge.student{background:rgba(52,216,197,0.15); color:var(--teal); border:1px solid rgba(52,216,197,0.35);}
  .account-card h3{font-family:var(--display); font-size:19px; margin-bottom:4px;}
  .account-card .email{font-family:var(--mono); font-size:12.5px; color:var(--muted); margin-bottom:12px;}
  .account-card p{font-size:13.5px; color:var(--muted); line-height:1.6;}

  /* ---------- code block ---------- */
  .code-block{
    background:#070708;
    border:1px solid var(--border);
    border-radius:14px;
    padding:20px 22px;
    font-family:var(--mono);
    font-size:13px;
    line-height:1.8;
    color:#C9C9D8;
    overflow-x:auto;
    position:relative;
  }
  .code-block .copy{
    position:absolute; top:14px; right:14px;
    font-family:var(--body);
    font-size:11.5px;
    background:var(--card-soft);
    border:1px solid var(--border);
    color:var(--muted);
    padding:5px 10px;
    border-radius:7px;
    cursor:pointer;
    transition:color 0.2s ease, border-color 0.2s ease;
  }
  .code-block .copy:hover{color:var(--teal); border-color:var(--teal);}
  .code-block .comment{color:#5C5C68;}
  .code-block .str{color:var(--teal);}

  footer{
    margin-top:100px;
    padding:40px 0 60px;
    text-align:center;
    color:var(--muted);
    font-size:13px;
    border-top:1px solid var(--border);
  }
  footer .heart{color:var(--violet);}

  /* faint divider rule used between major sections */
  .rule{height:1px; background:linear-gradient(90deg, transparent, var(--border), transparent); margin:0;}
</style>
</head>
<body>

<div class="emoji-field" id="emojiField"></div>
<div id="toast-container"></div>

<div class="wrap">

  <header class="hero">
    <div class="eyebrow">campus clubs &amp; exhibitions</div>
    <h1 class="title">LittleBits</h1>
    <p class="subtitle">A clean, interactive portal for students to discover clubs, RSVP to workshops, track events, manage activity passes, and run admin consoles — built in vanilla HTML, CSS, and ES6.</p>
    <div class="stack-tags">
      <span>HTML5</span><span>CSS3</span><span>ES6 JS</span><span>LocalStorage DB</span><span>Lucide Icons</span><span>Dicebear Avatars</span>
    </div>
    <div class="demo-row">
      <button class="demo-btn" id="toastBtn">Trigger a toast notification ↗</button>
      <button class="ghost-btn" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">See what's inside</button>
    </div>
  </header>

  <div class="rule"></div>

  <section id="features">
    <div class="section-head">
      <div class="label">Changelog · nine resolved fixes</div>
      <h2>Core features &amp; resolved fixes</h2>
      <p>Each entry below is a real fix shipped during development — the order reflects the sequence they were tackled in, from data persistence to the glass aesthetic.</p>
    </div>

    <div class="feature-list" id="featureList">
      <div class="feature">
        <div class="num">01</div>
        <div>
          <h3>Unified architecture &amp; clean file splitting</h3>
          <p>Modules are split for maintainability: <code>db.js</code> / <code>db2.js</code> for the mock database, <code>navbar.js</code> / <code>navbar2.js</code> for navigation and auth modals, and <code>admin.js</code> / <code>admin2.js</code> for the authority control panel and its dynamic tabs.</p>
        </div>
      </div>

      <div class="feature">
        <div class="num">02</div>
        <div>
          <h3>Sign-up data persistence</h3>
          <p><strong>Issue:</strong> registering clubs or new accounts triggered a self-healing reset on reload, wiping <code>localStorage</code>. <strong>Fix:</strong> the reset now only fires if the three mandatory demo accounts are entirely missing — custom data persists permanently.</p>
        </div>
      </div>

      <div class="feature">
        <div class="num">03</div>
        <div>
          <h3>Quick demo logins</h3>
          <p>One-click login buttons inside the Auth Modal and the Unauthorized Access warning let testers instantly become Shoubhik, Aman, or Doei and land directly on the right panel.</p>
        </div>
      </div>

      <div class="feature">
        <div class="num">04</div>
        <div>
          <h3>Admin tab switcher &amp; event deployment</h3>
          <p><strong>Issue:</strong> tab clicks rendered blank tables — active state was trapped in local closures. <strong>Fix:</strong> <code>window.adminActiveTab</code> is now global, so Dashboard, Events, and Members render instantly. A Club Admin's own club is pre-selected when configuring an event.</p>
        </div>
      </div>

      <div class="feature">
        <div class="num">05</div>
        <div>
          <h3>Guest interception on the dashboard</h3>
          <p>A navigation guard on the Dashboard tab intercepts guests with a clear modal: <em>"Access Denied: Authentication Required."</em> No silent redirects.</p>
        </div>
      </div>

      <div class="feature">
        <div class="num">06</div>
        <div>
          <h3>Selective loading screen (bypass loader)</h3>
          <p>A <code>skipIntroNext</code> session flag skips the 3-second loader on action-based reloads (login, signup, logout) while keeping it for first loads and manual refreshes.</p>
        </div>
      </div>

      <div class="feature">
        <div class="num">07</div>
        <div>
          <h3>Toast notification stacking</h3>
          <p>A vertical stacking container in the bottom-right slides toasts in, stacks them neatly, and auto-dismisses after 4 seconds — or on click. <em>(Try the button above — it's the same pattern.)</em></p>
        </div>
      </div>

      <div class="feature">
        <div class="num">08</div>
        <div>
          <h3>Premium glassmorphism</h3>
          <p>Frosted cards at <code>rgba(18,18,24,0.72)</code> with a <code>16px</code> backdrop blur replace flat borders. Dark outline logos for Coding, Music, and Photography auto-invert to white for contrast.</p>
        </div>
      </div>

      <div class="feature">
        <div class="num">09</div>
        <div>
          <h3>Interactive background emoji layering</h3>
          <p>Emojis float behind every card at <code>z-index: 1</code>, letting pointer events pass through gaps. Hovering one lifts it to <code>z-index: 9999</code> to reveal its club tooltip. <em>(The drifting emojis on this page are the same idea.)</em></p>
        </div>
      </div>
    </div>
  </section>

  <div class="rule"></div>

  <section>
    <div class="section-head">
      <div class="label">Stack</div>
      <h2>Tech stack</h2>
    </div>
    <div class="tech-grid" id="techGrid">
      <div class="tech-card"><div class="role">Core structure</div><div class="val">HTML5 — semantic tags, templates</div></div>
      <div class="tech-card"><div class="role">Styling</div><div class="val">CSS3 — variable tokens, flexbox, grids, frosted-glass filters, keyframes</div></div>
      <div class="tech-card"><div class="role">Icons</div><div class="val">Lucide Icons via CDN, rendered as inline SVG</div></div>
      <div class="tech-card"><div class="role">Database</div><div class="val">LocalStorage mock database API</div></div>
      <div class="tech-card"><div class="role">Avatars</div><div class="val">Dicebear Pixel Art SVG API</div></div>
    </div>
  </section>

  <div class="rule"></div>

  <section>
    <div class="section-head">
      <div class="label">Setup</div>
      <h2>Running it locally</h2>
      <p>No bundlers, no package manager — clone it and open it.</p>
    </div>
    <div class="code-block">
      <button class="copy" onclick="copyCode(this)">Copy</button>
<span class="comment"># clone the repository</span>
git clone https://github.com/amanrock1/LittleBits.git
cd LittleBits

<span class="comment"># then either open index.html directly, or serve it:</span>
python -m http.server 8000
<span class="comment"># → open http://localhost:8000</span>
    </div>
  </section>

  <div class="rule"></div>

  <section>
    <div class="section-head">
      <div class="label">Reference</div>
      <h2>Demo accounts</h2>
      <p>Three roles, three scopes of access — use the quick login buttons in-app to switch between them instantly.</p>
    </div>
    <div class="accounts" id="accountsGrid">
      <div class="account-card">
        <span class="badge super">Super Admin</span>
        <h3>Shoubhik</h3>
        <div class="email">shoubhik@campus.edu</div>
        <p>Full access to the Authority Panel — manage all clubs, verify all passes, and remove members.</p>
      </div>
      <div class="account-card">
        <span class="badge club">Club Admin</span>
        <h3>Aman</h3>
        <div class="email">aman@campus.edu</div>
        <p>Admin of Apex Coders — manage its events, verify rosters, and edit event details.</p>
      </div>
      <div class="account-card">
        <span class="badge student">Student</span>
        <h3>Doei</h3>
        <div class="email">doei@campus.edu</div>
        <p>Undergraduate student — RSVP to events, claim certificates, and view earned badges.</p>
      </div>
    </div>
  </section>

  <footer>
    Built with vanilla HTML, CSS &amp; JS — frosted glass and a little <span class="heart">♥</span>
  </footer>

</div>

<script>
  // ---------- floating background emojis ----------
  const emojis = ['🎨','🎵','💻','📸','🎤','🎯','🧩','🎬'];
  const field = document.getElementById('emojiField');
  for(let i=0;i<14;i++){
    const s = document.createElement('span');
    s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    s.style.left = Math.random()*100 + '%';
    s.style.animationDuration = (14 + Math.random()*12) + 's';
    s.style.animationDelay = (Math.random()*10) + 's';
    s.style.fontSize = (20 + Math.random()*22) + 'px';
    field.appendChild(s);
  }

  // ---------- toast demo ----------
  const toastMessages = [
    'Saved successfully.',
    'You joined Apex Coders.',
    'Event registration confirmed.',
    'Badge unlocked: First RSVP.'
  ];
  let toastIndex = 0;
  function showToast(){
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    const msg = toastMessages[toastIndex % toastMessages.length];
    toastIndex++;
    toast.innerHTML = `<div class="dot"></div><div>${msg}</div><div class="close">✕</div>`;
    toast.querySelector('.close').onclick = () => toast.remove();
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
  document.getElementById('toastBtn').addEventListener('click', showToast);

  // ---------- scroll reveal ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in-view'); });
  }, {threshold:0.15});
  document.querySelectorAll('.feature, .tech-card, .account-card').forEach(el => observer.observe(el));

  // stagger feature card reveal slightly
  document.querySelectorAll('.feature').forEach((el,i) => el.style.transitionDelay = (i*0.04)+'s');

  // ---------- copy button ----------
  function copyCode(btn){
    const text = btn.parentElement.innerText.replace('Copy','').trim();
    navigator.clipboard.writeText(text);
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(()=>btn.textContent = original, 1500);
  }
</script>

</body>
</html>
