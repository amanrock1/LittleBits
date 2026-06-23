// Clubs Directory Controller
(function() {
  let searchQuery = '';
  let selectedCategory = 'All';
  let sortBy = 'name'; // 'members' | 'name'

  document.addEventListener('DOMContentLoaded', () => {
    // Get initial category from query parameters if exists
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) {
      selectedCategory = catParam;
    }
    initDirectory();
  });

  function initDirectory() {
    const clubs = getClubs();
    
    // Setup unique categories list
    const cats = new Set(clubs.map(c => c.category));
    const categories = ['All', ...Array.from(cats)];
    
    // Render chips
    const chipsPlaceholder = document.getElementById('category-chips-placeholder');
    if (chipsPlaceholder) {
      chipsPlaceholder.innerHTML = categories.map(cat => `
        <button class="chip ${cat === selectedCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>
      `).join('');

      // Add click listeners to chips
      document.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedCategory = btn.getAttribute('data-cat');
          updateList();
        });
      });
    }

    // Bind inputs
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateList();
    });

    const sortMembersBtn = document.getElementById('sort-members-btn');
    const sortNameBtn = document.getElementById('sort-name-btn');

    sortMembersBtn?.addEventListener('click', () => {
      sortBy = 'members';
      sortMembersBtn.classList.add('active');
      sortNameBtn.classList.remove('active');
      updateList();
    });

    sortNameBtn?.addEventListener('click', () => {
      sortBy = 'name';
      sortNameBtn.classList.add('active');
      sortMembersBtn.classList.remove('active');
      updateList();
    });

    updateList();
  }

  function updateList() {
    const clubs = getClubs();
    const events = getEvents();
    const user = getUserProfile();

    // Filter & Sort
    const filtered = clubs.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            club.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || club.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'members') return b.memberCount - a.memberCount;
      return a.name.localeCompare(b.name);
    });

    const grid = document.getElementById('directory-grid-placeholder');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; py: 80px; text-align: center; padding: 60px; border-radius: 16px;">
          <p style="font-size: 12px; color: var(--color-gray-500); text-transform: uppercase;">No corresponding records found.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(club => {
      const isJoined = user.joinedClubs.includes(club.id);
      const clubEvents = events.filter(e => e.clubId === club.id);
      const isImg = club.logo.startsWith('http') || club.logo.startsWith('/') || club.logo.startsWith('.') || club.logo.includes('/');
      
      const needsInvert = ['coding', 'music', 'photography'].includes(club.category.toLowerCase());
      const filterStyle = needsInvert ? 'filter: invert(1) brightness(1.5);' : '';
      const logoHtml = isImg 
        ? `<img src="${club.logo}" alt="${club.name}" style="width: 40px; height: 40px; object-fit: contain; ${filterStyle} border-radius: 6px;" />`
        : `<span style="font-size: 32px;">${club.logo}</span>`;

      return `
        <div class="club-card glass-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 280px; padding: 24px; border-radius: 16px;">
          <div>
            <div class="flex-between" style="margin-bottom: 16px;">
              ${logoHtml}
              <span class="font-display" style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: var(--color-gray-400); border: 1px solid rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">
                ${club.category}
              </span>
            </div>
            
            <h3 class="font-display font-semibold text-white" style="font-size: 16px;">${club.name}</h3>
            <p style="font-size: 11px; color: var(--color-gray-400); margin-top: 8px; line-clamp: 2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">
              ${club.shortDescription}
            </p>
          </div>

          <div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; display: flex; flex-direction: column; gap: 12px;">
            <div class="font-display" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 8px; color: var(--color-gray-500); font-weight: bold;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <i data-lucide="users" style="width: 12px; height: 12px; opacity: 0.4;"></i>
                <span>${club.memberCount} MEMBERS</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <i data-lucide="calendar" style="width: 12px; height: 12px; opacity: 0.4;"></i>
                <span>${clubEvents.length} EVENTS</span>
              </div>
            </div>

            <div class="flex-between" style="gap: 8px;">
              <a href="club-details.html?id=${club.id}" class="glass-btn font-display font-bold uppercase" style="font-size: 9px; padding: 6px; border-radius: 6px; flex: 1; text-align: center; text-decoration: none; border-color: rgba(255,255,255,0.1);">
                View Details
              </a>
              <button class="join-btn-directory font-display font-bold uppercase" data-id="${club.id}" style="font-size: 9px; padding: 6px; border-radius: 6px; cursor: pointer; transition: all 0.3s; flex: 1;" onclick="handleJoinClick('${club.id}')">
                ${isJoined ? 'Joined' : 'Join Club'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Style the buttons using CSS classes
    document.querySelectorAll('.join-btn-directory').forEach(btn => {
      const cid = btn.getAttribute('data-id');
      const isJoined = user.joinedClubs.includes(cid);
      if (isJoined) {
        btn.classList.add('joined');
        btn.classList.remove('not-joined');
      } else {
        btn.classList.add('not-joined');
        btn.classList.remove('joined');
      }
    });

    // Active Category chip selection style update
    document.querySelectorAll('.chip').forEach(btn => {
      const cat = btn.getAttribute('data-cat');
      if (cat.toLowerCase() === selectedCategory.toLowerCase()) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    lucide.createIcons();
  }

  function showMembershipLetter(clubName, userName) {
    const overlay = document.createElement('div');
    overlay.className = 'invitation-overlay';
    overlay.innerHTML = `
      <div class="invitation-card">
        <div class="invitation-seal">📜</div>
        <h2 class="font-editorial" style="color: white; font-size: 24px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Induction Letter</h2>
        <span style="font-size: 9px; color: var(--color-gray-500); font-family: monospace; text-transform: uppercase; letter-spacing: 0.25em;">LITTLEBITS REGISTERED CHAPTER</span>
        
        <p style="font-size: 13px; color: var(--color-gray-300); line-height: 1.6; margin: 24px 0; font-weight: 300;">
          Congratulations <strong class="text-white" style="font-weight: bold;">${userName}</strong>,<br/>
          You have been officially inducted as a member of the <strong class="text-white" style="font-weight: bold;">${clubName}</strong> chapter. Your credentials have been registered in the student archives.
        </p>

        <div style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 16px; margin-bottom: 24px; font-family: monospace; font-size: 8px; color: var(--color-gray-500); display: flex; justify-content: space-between;">
          <span>SEAL REF: LB-CH-${Math.floor(1000 + Math.random() * 9000)}</span>
          <span>STATUS: ACTIVE MEMBER</span>
        </div>

        <button id="close-invitation-btn" class="btn-white rounded-lg" style="width: 100%; padding: 12px; font-size: 10px;">Acknowledge & Close</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Trigger active state
    setTimeout(() => {
      overlay.classList.add('active');
    }, 50);

    const closeBtn = overlay.querySelector('#close-invitation-btn');
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
      }, 500);
    });
  }

  // Bind globally so it can be called from onclick attribute
  window.handleJoinClick = function(clubId) {
    const userBefore = getUserProfile();
    const isJoining = !userBefore.joinedClubs.includes(clubId);
    
    joinClub(clubId);
    
    if (isJoining) {
      const clubs = getClubs();
      const club = clubs.find(c => c.id === clubId);
      const userAfter = getUserProfile();
      if (club) {
        showMembershipLetter(club.name, userAfter.name);
      }
    }
    
    updateList(); // re-render list inline
  };
})();
