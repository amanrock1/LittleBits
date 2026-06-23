// Club Details Controller
(function() {
  let activeTab = 'overview';
  let club = null;

  document.addEventListener('DOMContentLoaded', () => {
    initDetails();
  });

  function initDetails() {
    const params = new URLSearchParams(window.location.search);
    const clubId = params.get('id');

    if (!clubId) {
      document.body.innerHTML = `
        <div style="padding: 100px; text-align: center; color: white;">
          <p>Invalid club identifier.</p>
          <a href="clubs.html" style="color: white; text-decoration: underline;">Back to Index</a>
        </div>
      `;
      return;
    }

    const clubs = getClubs();
    club = clubs.find(c => c.id === clubId);

    if (!club) {
      document.body.innerHTML = `
        <div style="padding: 100px; text-align: center; color: white;">
          <p>Club record not found.</p>
          <a href="clubs.html" style="color: white; text-decoration: underline;">Back to Index</a>
        </div>
      `;
      return;
    }

    const events = getEvents();
    const hostedEvents = events.filter(e => e.clubId === club.id);

    // Populate header details
    document.getElementById('club-banner-img').src = club.banner;
    document.getElementById('club-category-label').innerText = `${club.category} Group`;
    document.getElementById('club-name-label').innerText = club.name;
    document.getElementById('club-members-count-label').innerText = `${club.memberCount} Members`;
    document.getElementById('club-events-count-label').innerText = `${hostedEvents.length} Events Scheduled`;

    const isImg = club.logo.startsWith('http') || club.logo.startsWith('/') || club.logo.startsWith('.') || club.logo.includes('/');
    const needsInvert = ['coding', 'music', 'photography'].includes(club.category.toLowerCase());
    const filterStyle = needsInvert ? 'filter: invert(1) brightness(1.5);' : '';
    document.getElementById('club-logo-placeholder').innerHTML = isImg
      ? `<img src="${club.logo}" alt="${club.name}" style="width: 100%; height: 100%; object-fit: contain; ${filterStyle} border-radius: 8px;" />`
      : `<span style="position: relative; z-index: 10;">${club.logo}</span>`;

    // Join action button setup
    const joinBtn = document.getElementById('join-club-action-btn');
    const joinBottomBtn = document.getElementById('join-club-bottom-btn');
    
    const updateJoinBtn = () => {
      const user = getUserProfile();
      const isJoined = user.joinedClubs.includes(club.id);
      const styleBtn = (btn) => {
        if (!btn) return;
        if (isJoined) {
          btn.innerText = 'Leave Club';
          btn.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          btn.style.color = '#ef4444';
          btn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        } else {
          btn.innerText = 'Join Chapter';
          btn.style.backgroundColor = 'white';
          btn.style.color = 'black';
          btn.style.borderColor = 'white';
        }
      };
      styleBtn(joinBtn);
      styleBtn(joinBottomBtn);
    };

    updateJoinBtn();

    const handleJoinAction = () => {
      const userBefore = getUserProfile();
      const isJoining = !userBefore.joinedClubs.includes(club.id);

      joinClub(club.id);
      // Reload club data to get updated member count
      club = getClubs().find(c => c.id === clubId);
      document.getElementById('club-members-count-label').innerText = `${club.memberCount} Members`;
      updateJoinBtn();

      if (isJoining) {
        const userAfter = getUserProfile();
        showMembershipLetter(club.name, userAfter.name);
      }
    };

    joinBtn?.addEventListener('click', handleJoinAction);
    joinBottomBtn?.addEventListener('click', handleJoinAction);

    // Tab buttons click setup
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.getAttribute('data-tab');
        renderTabContent();
      });
    });

    renderTabContent();
  }

  function renderTabContent() {
    const placeholder = document.getElementById('panel-content-placeholder');
    if (!placeholder) return;

    const events = getEvents();
    const hostedEvents = events.filter(e => e.clubId === club.id);

    if (activeTab === 'overview') {
      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 32px;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h4 class="stat-label font-display" style="font-weight: bold; color: var(--color-gray-500);">Mission Statement</h4>
            <p style="font-size: 14px; color: var(--color-gray-400); line-height: 1.7; font-weight: 300;">
              ${club.description}
            </p>
          </div>

          <!-- Exhibitions list -->
          <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 32px; display: flex; flex-direction: column; gap: 20px;">
            <h4 class="stat-label font-display" style="font-weight: bold; color: var(--color-gray-500);">Scheduled Exhibitions</h4>
            ${hostedEvents.length === 0 ? `<p style="font-size: 12px; color: var(--color-gray-600);">No events currently scheduled.</p>` : `
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                ${hostedEvents.map(e => `
                  <a href="event-details.html?id=${e.id}" class="event-preview-card glass-card">
                    <img src="${e.image}" alt="${e.title}" style="width: 64px; height: 64px; object-fit: cover; filter: grayscale(1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);" />
                    <div style="display: flex; flex-direction: column; justify-content: space-between;">
                      <h5 style="font-size: 12px; font-weight: bold; color: white; line-clamp: 1; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${e.title}</h5>
                      <span style="font-size: 9px; text-transform: uppercase; font-weight: bold; color: var(--color-gray-400); letter-spacing: 0.05em;">${e.venue.split('&')[0]}</span>
                      <span style="font-size: 9px; color: var(--color-gray-600);">${new Date(e.date).toLocaleDateString()}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    } 
    
    else if (activeTab === 'timeline') {
      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${club.achievements.length === 0 ? `<p style="font-size: 12px; color: var(--color-gray-600);">No achievements documented.</p>` : 
            club.achievements.map(ach => `
              <div style="display: flex; gap: 24px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 24px;">
                <span class="font-display font-bold font-mono" style="font-size: 12px; color: var(--color-gray-600); width: 80px; flex-shrink: 0; letter-spacing: 0.05em;">${ach.date}</span>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <h4 class="font-display font-semibold text-white" style="font-size: 14px;">${ach.title}</h4>
                  <p style="font-size: 12px; color: var(--color-gray-400); font-weight: 300; line-height: 1.5;">${ach.desc}</p>
                </div>
              </div>
            `).join('')
          }
        </div>
      `;
    } 
    
    else if (activeTab === 'activities') {
      placeholder.innerHTML = `
        ${club.activities.length === 0 ? `<p style="font-size: 12px; color: var(--color-gray-600);">No activities currently listed.</p>` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
            ${club.activities.map(act => `
              <div class="activity-card glass-card">
                <img src="${act.image}" alt="${act.title}" style="width: 100%; height: 160px; object-fit: cover; filter: grayscale(1); transition: filter 0.3s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(1)'" />
                <div style="padding: 16px; display: flex; flex-direction: column; gap: 6px;">
                  <h4 class="font-display font-semibold text-white" style="font-size: 12px;">${act.title}</h4>
                  <p style="font-size: 10px; color: var(--color-gray-500); line-height: 1.5;">${act.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      `;
    } 
    
    else if (activeTab === 'members') {
      const allUsers = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
      const dynamicMembers = allUsers.filter(u => u.joinedClubs && u.joinedClubs.includes(club.id));
      
      const combinedMembers = [...club.members];
      dynamicMembers.forEach(dm => {
        if (!combinedMembers.some(cm => cm.name.toLowerCase() === dm.name.toLowerCase())) {
          combinedMembers.push({
            name: dm.name,
            role: dm.role === 'admin' ? 'Officer' : 'Student Member',
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${dm.name}`
          });
        }
      });

      placeholder.innerHTML = `
        ${combinedMembers.length === 0 ? `<p style="font-size: 12px; color: var(--color-gray-600);">No member records public.</p>` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
            ${combinedMembers.map(member => `
              <div class="member-card glass-card">
                <img src="${member.avatar}" alt="${member.name}" style="width: 40px; height: 40px; border-radius: 8px; filter: grayscale(1); border: 1px solid rgba(255,255,255,0.1);" />
                <div>
                  <h4 style="font-size: 12px; font-weight: bold; color: white;">${member.name}</h4>
                  <p class="font-display" style="font-size: 9px; color: var(--color-gray-500); text-transform: uppercase; font-weight: bold; margin-top: 2px; letter-spacing: 0.05em;">${member.role}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      `;
    }

    lucide.createIcons();
  }
})();
