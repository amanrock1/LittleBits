// Student Dashboard Controller
(function() {
  let selectedCert = null;

  document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
  });

  function initDashboard() {
    const user = getUserProfile();
    if (!user || (user.role !== 'student' && user.role !== 'admin')) {
      window.location.href = 'index.html?unauthorized_student=true';
      return;
    }
    const clubs = getClubs();
    const events = getEvents();

    // Render Notifications Panel at the top of dashboard if any exist
    const existingNotifBox = document.getElementById('dashboard-notifications-box');
    if (existingNotifBox) existingNotifBox.remove();

    // Populate profile header
    const avatarEl = document.getElementById('avatar-initial');
    if (user.avatar) {
      avatarEl.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" />`;
      avatarEl.style.background = 'transparent';
    } else {
      avatarEl.innerText = user.name.charAt(0);
      avatarEl.style.background = 'white';
      avatarEl.innerHTML = user.name.charAt(0);
    }
    document.getElementById('user-display-name').innerText = user.name;
    document.getElementById('user-streak-value').innerText = `${user.streak} SESSIONS`;

    // Render registrations pass log
    const registrationsList = document.getElementById('registrations-list-placeholder');
    if (registrationsList) {
      const registeredEvents = events.filter(e => user.registrations.some(r => r.eventId === e.id));
      
      if (registeredEvents.length === 0) {
        registrationsList.innerHTML = `
          <div class="glass-panel" style="padding: 48px; text-align: center; border-radius: 12px; font-size: 12px; color: var(--color-gray-500);">
            No active registrations.
            <a href="events.html" style="color: white; text-decoration: underline; display: block; margin-top: 12px; font-weight: bold;">Find Exhibitions</a>
          </div>
        `;
      } else {
        registrationsList.innerHTML = registeredEvents.map(event => {
          const isUpcoming = new Date(event.date) > new Date();
          return `
            <div class="pass-item-card glass-card">
              <div style="display: flex; align-items: center; gap: 16px;">
                <img src="${event.image}" alt="${event.title}" style="width: 48px; height: 48px; object-fit: cover; filter: grayscale(1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);" />
                <div>
                  <h4 style="font-size: 12px; font-weight: bold; color: white;">${event.title}</h4>
                  <span style="font-size: 9px; color: var(--color-gray-500); text-transform: uppercase; font-family: monospace; display: block; margin-top: 4px;">
                    ${new Date(event.date).toLocaleDateString()} // ${event.venue.split('&')[0]}
                  </span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; justify-content: flex-end;">
                ${!isUpcoming && !user.certificates.some(c => c.eventTitle.includes(event.title)) ? `
                  <button class="claim-cert-action-btn" data-eid="${event.id}" style="padding: 6px 12px; font-size: 9px; font-weight: bold; text-transform: uppercase; border-radius: 6px; cursor: pointer; background: white; color: black; border: 1px solid white;">
                    Claim Certificate
                  </button>
                ` : ''}
                <span class="font-display font-bold uppercase" style="padding: 4px 8px; font-size: 9px; border-radius: 4px; border: 1px solid ${isUpcoming ? 'white' : 'rgba(255,255,255,0.1)'}; color: ${isUpcoming ? 'white' : 'var(--color-gray-500)'};">
                  ${isUpcoming ? 'Upcoming' : 'Completed'}
                </span>
              </div>
            </div>
          `;
        }).join('');

        // Bind claim certificate triggers
        document.querySelectorAll('.claim-cert-action-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const eid = btn.getAttribute('data-eid');
            claimCertificate(eid);
            initDashboard(); // refresh
          });
        });
      }
    }

    // Render credentials list
    const credentialsGrid = document.getElementById('credentials-grid-placeholder');
    if (credentialsGrid) {
      if (user.certificates.length === 0) {
        credentialsGrid.innerHTML = `
          <div class="glass-panel" style="grid-column: 1 / -1; padding: 32px; text-align: center; border-radius: 12px; font-size: 12px; color: var(--color-gray-600);">
            Participate in completed exhibitions to unlock academic credentials.
          </div>
        `;
      } else {
        credentialsGrid.innerHTML = user.certificates.map(cert => `
          <div class="cert-item-card glass-card" data-cid="${cert.id}">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: var(--color-gray-500);">${cert.clubName}</span>
              <h4 style="font-size: 12px; font-weight: bold; color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">${cert.eventTitle}</h4>
              <span style="font-size: 9px; color: var(--color-gray-600); font-family: monospace;">${cert.code}</span>
            </div>
            <span style="font-size: 24px; opacity: 0.25;">🎓</span>
          </div>
        `).join('');

        // Bind credentials click to open print modal
        document.querySelectorAll('.cert-item-card').forEach(btn => {
          btn.addEventListener('click', () => {
            const cid = btn.getAttribute('data-cid');
            selectedCert = user.certificates.find(c => c.id === cid);
            openCertPrintModal();
          });
        });
      }
    }

    // Render Affiliations list
    const affiliationsList = document.getElementById('affiliations-list-placeholder');
    if (affiliationsList) {
      const joinedClubs = clubs.filter(c => (user.joinedClubs || []).includes(c.id) || user.adminForClubId === c.id);
      if (joinedClubs.length === 0) {
        affiliationsList.innerHTML = `<p style="font-size: 12px; color: var(--color-gray-600);">No active chapter affiliations.</p>`;
      } else {
        affiliationsList.innerHTML = joinedClubs.map(club => {
          const isImg = club.logo.startsWith('http') || club.logo.startsWith('/') || club.logo.startsWith('.') || club.logo.includes('/');
          const needsInvert = ['coding', 'music', 'photography'].includes(club.category.toLowerCase());
          const filterStyle = needsInvert ? 'filter: invert(1) brightness(1.5);' : '';
          const logoHtml = isImg 
            ? `<img src="${club.logo}" alt="${club.name}" style="width: 24px; height: 24px; object-fit: contain; ${filterStyle} border-radius: 4px;" />`
            : `<span style="font-size: 16px;">${club.logo}</span>`;

          return `
            <div class="glass-card flex-between" style="padding: 12px; border-radius: 8px; cursor: pointer;" onclick="window.location.href='club-details.html?id=${club.id}'">
              <div style="display: flex; align-items: center; gap: 10px; font-size: 12px;">
                ${logoHtml}
                <span style="font-weight: 600; color: white;">${club.name}</span>
              </div>
              <i data-lucide="chevron-right" style="width: 14px; height: 14px; color: var(--color-gray-500);"></i>
            </div>
          `;
        }).join('');
      }
    }

    // Render Accolades (Achievement Badges)
    const accoladesGrid = document.getElementById('accolades-grid-placeholder');
    if (accoladesGrid) {
      accoladesGrid.innerHTML = user.badges.map(badge => `
        <div class="badge-tile glass-card">
          <span>${badge.icon}</span>
          <div class="badge-tooltip glass-panel shadow-lg">
            <strong style="color: white; display: block; margin-bottom: 2px;">${badge.name}</strong>
            ${badge.desc}
          </div>
        </div>
      `).join('');
    }

    // Print modal triggers
    const modal = document.getElementById('cert-print-modal');
    document.getElementById('cert-modal-close')?.addEventListener('click', () => modal.classList.remove('active'));

    lucide.createIcons();
  }

  function openCertPrintModal() {
    if (!selectedCert) return;

    const user = getUserProfile();

    document.getElementById('cert-code-label').innerText = `ID: ${selectedCert.code}`;
    document.getElementById('cert-user-name').innerText = user.name;
    document.getElementById('cert-event-title').innerText = selectedCert.eventTitle;
    document.getElementById('cert-convenor-name').innerText = selectedCert.clubName;
    document.getElementById('cert-date-label').innerText = selectedCert.date;

    const modal = document.getElementById('cert-print-modal');
    modal.classList.add('active');
  }

  // Print buttons binders
  document.getElementById('print-now-btn')?.addEventListener('click', () => {
    window.print();
  });
  document.getElementById('pdf-download-btn')?.addEventListener('click', () => {
    alert('Dossier exported to PDF.');
  });

  // Profile Edit Modal bindings
  const profileModal = document.getElementById('profile-edit-modal');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const profileModalClose = document.getElementById('profile-modal-close');
  const profileEditForm = document.getElementById('profile-edit-form');
  const avatarInput = document.getElementById('profile-edit-avatar');
  let avatarBase64 = null;

  avatarInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        avatarBase64 = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  editProfileBtn?.addEventListener('click', () => {
    const u = getUserProfile();
    document.getElementById('profile-edit-name').value = u.name;
    document.getElementById('profile-edit-email').value = u.email;
    avatarBase64 = u.avatar || null;
    if (avatarInput) avatarInput.value = ''; // reset file input selection
    profileModal.classList.add('active');
  });

  profileModalClose?.addEventListener('click', () => {
    profileModal.classList.remove('active');
  });

  profileEditForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('profile-edit-name').value;
    const newEmail = document.getElementById('profile-edit-email').value;

    const profile = getUserProfile();
    const oldEmail = profile.email;
    
    profile.name = newName;
    profile.email = newEmail;
    if (avatarBase64) {
      profile.avatar = avatarBase64;
    }

    // Update in simulatedUsers first if email changed
    const usersData = localStorage.getItem("simulatedUsers");
    if (usersData) {
      const users = JSON.parse(usersData);
      const updatedUsers = users.map(u => u.email.toLowerCase() === oldEmail.toLowerCase() ? profile : u);
      localStorage.setItem("simulatedUsers", JSON.stringify(updatedUsers));
    }

    saveUserProfile(profile);
    profileModal.classList.remove('active');
    
    // Refresh page elements
    initDashboard();

    // Trigger toast notification
    if (typeof triggerToast === 'function') {
      triggerToast("Profile successfully updated!");
    }
  });
})();
