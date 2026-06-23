// Global Dynamic Navbar Loader & Controller
(function () {
  loadNavbar();

  function getDynamicUsers() {
    const local = localStorage.getItem("simulatedUsers");
    if (!local) {
      localStorage.setItem("simulatedUsers", JSON.stringify(SIMULATED_USERS));
      return SIMULATED_USERS;
    }
    return JSON.parse(local);
  }

  function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    const user = getUserProfile();
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const activeUsersList = getDynamicUsers();

    // Pin Super Admin (System Director) to the top of the directory switcher
    const superAdminIdx = activeUsersList.findIndex(u => u.role === 'admin' && !u.adminForClubId);
    if (superAdminIdx > -1) {
      const superAdminObj = activeUsersList.splice(superAdminIdx, 1)[0];
      activeUsersList.unshift(superAdminObj);
    }

    const isGuest = !user || user.role === 'guest';

    // Dynamic markup injection
    placeholder.innerHTML = `
      <nav class="main-nav flex-between">
        <a href="index.html" class="logo">
          <div class="logo-box">L/B</div>
          <span class="font-display font-bold text-white tracking-wider">
            LITTLE<span class="text-gray" style="font-weight: 300;">BITS</span>
          </span>
        </a>

        <div class="nav-links">
          <a href="index.html" class="nav-link" id="nav-landing">Overview</a>
          <a href="clubs.html" class="nav-link" id="nav-clubs">Communities</a>
          <a href="events.html" class="nav-link" id="nav-events">Exhibitions</a>
          <a href="dashboard.html" class="nav-link" id="nav-dashboard">Dashboard</a>
          <a href="admin.html" class="nav-link border border-white/20 px-3 py-1" id="nav-admin" style="border-radius: 6px;">Authority Panel</a>
        </div>

        <div class="flex-between" style="gap: 24px;">
          <!-- Inbox Dropdown -->
          <div style="position: relative;">
            <button id="inbox-btn" class="nav-link nav-btn-link">
              INBOX ${notifications.length > 0 ? `<span class="text-white font-bold">(${notifications.length})</span>` : ''}
            </button>
            <div id="inbox-dropdown" class="glass-panel nav-dropdown inbox-dropdown">
              <div class="flex-between" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <h4 style="font-size: 11px; font-weight: bold; text-transform: uppercase;">Rosters Log</h4>
                ${notifications.length > 0 ? `<button id="clear-notifs-btn" class="nav-btn-link" style="font-size: 10px; color: var(--color-gray-500);">Clear all</button>` : ''}
              </div>
              <div id="inbox-list" style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
                ${notifications.length === 0 ? `<p style="font-size: 10px; color: var(--color-gray-500); text-align: center; padding: 16px 0;">No recent logs.</p>` :
        notifications.map(n => `<div style="padding: 8px; border-left: 2px solid rgba(255,255,255,0.15); font-size: 10px; color: var(--color-gray-400); background: rgba(255,255,255,0.01);">${n}</div>`).join('')
      }
              </div>
            </div>
          </div>

          <!-- Switcher / Wireframe Login Sign Up -->
          <div style="position: relative; display: flex; align-items: center; gap: 12px;">
            ${isGuest ? `
              <div class="flex-between font-display" style="gap: 8px; font-size: 12px;">
                <button id="nav-login-btn" class="nav-btn-link">Login</button>
                <span style="color: var(--color-gray-600);">|</span>
                <button id="nav-signup-btn" class="nav-btn-link">Sign Up</button>
              </div>
            ` : `
              <div style="display: flex; align-items: center; gap: 12px;">
                <button id="user-switcher-btn" class="font-display font-bold uppercase nav-btn-link" style="border-bottom: 1px solid rgba(255,255,255,0.2); color: white;">
                  ${user.name.split(' ')[0]} ▾
                </button>
                <span style="color: rgba(255,255,255,0.15);">|</span>
                <button id="nav-logout-btn" class="nav-btn-link" style="font-size: 10px; color: var(--color-gray-500);">Sign Out</button>
              </div>
            `}
            
            <div id="user-dropdown" class="glass-panel nav-dropdown user-dropdown">
              <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--color-gray-500); padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">Simulate Directory</div>
              ${activeUsersList.map((sim, i) => `
                <button class="sim-user-option" data-idx="${i}">
                  <span style="font-size: 11px; font-weight: 600; color: ${user.name === sim.name ? 'white' : 'var(--color-gray-400)'};">${sim.name}</span>
                  <span style="font-size: 9px; color: var(--color-gray-500);">${sim.role === 'admin' ? (sim.adminForClubId ? `Admin of Club ${sim.adminForClubId.split('-')[1]}` : 'Director General') : 'Undergrad Student'}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </nav>

      <!-- Authenticator & Sign-up Portal Modal -->
      <div id="auth-modal" class="modal-backdrop">
        <div class="modal-content glass-panel" style="max-width: 420px;">
          <button id="auth-close-btn" class="modal-close">✕</button>
          
          <!-- Modal Tab Header -->
          <div class="flex-between font-display" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 24px;">
            <button id="tab-login-btn" class="nav-link active" style="background:none; border:none; font-size:14px; font-weight:bold; cursor:pointer;">LOG IN</button>
            <button id="tab-signup-btn" class="nav-link" style="background:none; border:none; font-size:14px; font-weight:bold; cursor:pointer;">SIGN UP</button>
          </div>

          <div id="auth-error-msg" class="glass-panel" style="display: none; padding: 12px; margin-bottom: 16px; color: #ef4444; border-color: rgba(239,68,68,0.2); font-size: 10px; font-weight: bold; text-transform: uppercase; border-radius: 8px;"></div>
          
          <!-- Login Form -->
          <form id="login-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div class="form-group">
              <label class="form-label">College Email Address</label>
              <input id="login-email-input" type="email" placeholder="e.g. student@campus.edu" required class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px;" />
              <span style="font-size: 9px; color: var(--color-gray-600); font-style: italic;">Use a registered email (e.g. student@campus.edu or alex@campus.edu)</span>
            </div>
            <button type="submit" class="btn-white rounded-lg" style="padding: 12px; font-size: 11px; font-weight: bold;">Access Portal</button>
            <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; text-align: center;">
              <span style="font-size: 10px; color: var(--color-gray-500); text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 8px;">Quick Demo Accounts</span>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button type="button" class="glass-btn demo-login-btn" data-email="shoubhik@campus.edu" style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <span>Shoubhik <span style="font-weight: normal; color: var(--color-gray-500);">(Super Admin)</span></span>
                  <span style="font-family: monospace; font-size: 9px; color: var(--color-primary-glow);">shoubhik@campus.edu</span>
                </button>
                <button type="button" class="glass-btn demo-login-btn" data-email="aman@campus.edu" style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <span>Aman <span style="font-weight: normal; color: var(--color-gray-500);">(Club Admin)</span></span>
                  <span style="font-family: monospace; font-size: 9px; color: var(--color-primary-glow);">aman@campus.edu</span>
                </button>
                <button type="button" class="glass-btn demo-login-btn" data-email="doei@campus.edu" style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <span>Doei <span style="font-weight: normal; color: var(--color-gray-500);">(Student)</span></span>
                  <span style="font-family: monospace; font-size: 9px; color: var(--color-primary-glow);">doei@campus.edu</span>
                </button>
              </div>
            </div>
          </form>

          <!-- Signup Form -->
          <form id="signup-form" style="display: none; flex-direction: column; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input id="signup-name-input" type="text" placeholder="e.g. Jane Doe" required class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px;" />
            </div>
            <div class="form-group">
              <label class="form-label">College Email Address</label>
              <input id="signup-email-input" type="email" placeholder="e.g. jane@campus.edu" required class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px;" />
            </div>
            <div class="form-group">
              <label class="form-label">Roster Role</label>
              <select id="signup-role-select" class="glass-input form-select">
                <option value="student">Student Member</option>
                <option value="admin">Club Authority / Admin</option>
              </select>
            </div>
            <div id="signup-admin-type-container" class="form-group" style="display: none;">
              <label class="form-label">Admin Authority Type</label>
              <select id="signup-admin-type-select" class="glass-input form-select">
                <option value="club">Club Coordinator (Club Admin)</option>
                <option value="super">Director General (Super Admin)</option>
              </select>
            </div>
            <div id="signup-club-container" class="form-group" style="display: none;">
              <label class="form-label">Select Club</label>
              <select id="signup-club-select" class="glass-input form-select">
                ${getClubs().map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                <option value="new-custom-club">+ Add your own club</option>
              </select>
            </div>
            <div id="signup-custom-club-container" class="form-group" style="display: none;">
              <label class="form-label">New Club Name</label>
              <input id="signup-custom-club-input" type="text" placeholder="e.g. Astro Society" class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px;" />
            </div>
            <div id="signup-custom-club-category-container" class="form-group" style="display: none;">
              <label class="form-label">New Club Category (Related To)</label>
              <select id="signup-custom-club-category-select" class="glass-input form-select">
                <option value="Coding">Coding</option>
                <option value="Music">Music</option>
                <option value="Robotics">Robotics</option>
                <option value="Science">Science</option>
                <option value="Literary">Literary</option>
                <option value="Environment">Environment</option>
                <option value="Fine Arts">Fine Arts</option>
                <option value="Sports">Sports</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
              </select>
            </div>
            <button type="submit" class="btn-white rounded-lg" style="padding: 12px; font-size: 11px; font-weight: bold;">Create Account</button>
          </form>
        </div>
      </div>

      <!-- Custom CSS Access Warning Modal -->
      <div id="unauthorized-modal" class="modal-backdrop">
        <div class="modal-content glass-panel" style="max-width: 400px; text-align: center; padding: 40px; border-color: rgba(239, 68, 68, 0.25);">
          <button id="unauth-close-btn" class="modal-close">✕</button>
          <div style="font-size: 40px; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(239,68,68,0.2));">🛡️</div>
          <h3 id="unauth-modal-title" class="font-display font-bold text-white uppercase" style="font-size: 15px; letter-spacing: 0.05em; margin-bottom: 12px;">Authority Portal Access Required</h3>
          <p id="unauth-modal-desc" style="font-size: 11px; color: var(--color-gray-400); line-height: 1.6; margin-bottom: 24px;">
            Access to the Authority Control Panel is restricted. Please sign in with an authorized administrator account from the profile switcher.
          </p>
          <div style="display: flex; gap: 12px; margin-bottom: 20px;" id="unauth-modal-actions-container">
            <button id="unauth-login-trigger-btn" class="btn-white rounded-lg" style="flex: 1; padding: 12px; font-size: 11px; font-weight: bold;">Log In</button>
            <button id="unauth-close-action-btn" class="glass-btn rounded-lg" style="flex: 1; padding: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Dismiss</button>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; text-align: center;">
            <span style="font-size: 10px; color: var(--color-gray-500); text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 12px;">Quick Switch to Demo Accounts</span>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <button type="button" class="glass-btn demo-login-btn" data-email="shoubhik@campus.edu" style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>Shoubhik <span style="font-weight: normal; color: var(--color-gray-500);">(Super Admin)</span></span>
                <span style="font-family: monospace; font-size: 9px; color: var(--color-primary-glow);">shoubhik@campus.edu</span>
              </button>
              <button type="button" class="glass-btn demo-login-btn" data-email="aman@campus.edu" style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>Aman <span style="font-weight: normal; color: var(--color-gray-500);">(Club Admin)</span></span>
                <span style="font-family: monospace; font-size: 9px; color: var(--color-primary-glow);">aman@campus.edu</span>
              </button>
              <button type="button" class="glass-btn demo-login-btn" data-email="doei@campus.edu" style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>Doei <span style="font-weight: normal; color: var(--color-gray-500);">(Student)</span></span>
                <span style="font-family: monospace; font-size: 9px; color: var(--color-primary-glow);">doei@campus.edu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Move modals to body to prevent transform containing block centering bugs
    const authModal = document.getElementById('auth-modal');
    const unauthModal = document.getElementById('unauthorized-modal');
    if (authModal) document.body.appendChild(authModal);
    if (unauthModal) document.body.appendChild(unauthModal);

    // Highlight active link based on filename
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    if (pageName === 'index.html') document.getElementById('nav-landing')?.classList.add('active');
    else if (pageName === 'clubs.html' || pageName === 'club-details.html') document.getElementById('nav-clubs')?.classList.add('active');
    else if (pageName === 'events.html' || pageName === 'event-details.html') document.getElementById('nav-events')?.classList.add('active');
    else if (pageName === 'dashboard.html') document.getElementById('nav-dashboard')?.classList.add('active');
    else if (pageName === 'admin.html') document.getElementById('nav-admin')?.classList.add('active');

    // Notify navbar2.js that DOM navbar elements have been loaded and events can be bound
    if (typeof window.initNavbarEvents === 'function') {
      window.initNavbarEvents();
    }
  }
})();
