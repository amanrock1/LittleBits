// Admin Dashboard Controller
(function() {
  let activeTab = 'dashboard';
  window.adminActiveTab = 'dashboard';

  document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
  });

  function initAdmin() {
    const user = getUserProfile();
    if (!user || user.role !== 'admin') {
      window.location.href = 'index.html?unauthorized=true';
      return;
    }

    // Header Scope Info
    const scopeLabel = document.getElementById('admin-user-scope');
    if (scopeLabel) {
      scopeLabel.innerText = user.name + (user.adminForClubId ? ` (Scope: Club ${user.adminForClubId.split('-')[1]})` : ' (Scope: Super Admin)');
    }

    // Add Club Trigger button logic
    const addClubBtn = document.getElementById('add-club-modal-trigger');
    if (addClubBtn) addClubBtn.style.display = 'block';

    // Bind Add Club
    const addClubModal = document.getElementById('add-club-modal');
    document.getElementById('add-club-modal-trigger')?.addEventListener('click', () => {
      addClubModal.classList.add('active');
    });
    document.getElementById('add-club-modal-close')?.addEventListener('click', () => {
      addClubModal.classList.remove('active');
    });

    document.getElementById('add-club-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const name = f.get('name');
      const category = f.get('category');
      const logo = f.get('logo');
      const desc = f.get('description');

      const newClub = {
        id: `club-${Date.now()}`,
        name,
        category,
        logo,
        banner: getCategoryBanner(category),
        description: desc,
        shortDescription: desc.slice(0, 100) + '...',
        memberCount: 0,
        featured: false,
        adminUsername: "System Director",
        achievements: [{ date: "Today", title: "Club Launched", desc: "Successfully formed the club community." }],
        activities: [],
        members: [{ name: user.name, role: "Founder", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Admin" }]
      };

      const clubs = getClubs();
      saveClubs([...clubs, newClub]);

      // Add club ID to creator's joinedClubs and save to DB
      const currentUser = getUserProfile();
      if (!currentUser.joinedClubs) {
        currentUser.joinedClubs = [];
      }
      if (!currentUser.joinedClubs.includes(newClub.id)) {
        currentUser.joinedClubs.push(newClub.id);
      }
      if (currentUser.role === 'admin' && !currentUser.adminForClubId) {
        currentUser.adminForClubId = newClub.id;
      }
      saveUserProfile(currentUser);

      addClubModal.classList.remove('active');
      e.target.reset();
      triggerToast(`Chapter registered: ${name}`);
      renderAdminDashboard();
    });

    // Bind Deploy Event
    const deployEventModal = document.getElementById('deploy-event-modal');
    document.getElementById('deploy-event-modal-trigger')?.addEventListener('click', () => {
      openDeployEventModal();
    });
    
    document.getElementById('deploy-event-modal-close')?.addEventListener('click', () => {
      deployEventModal.classList.remove('active');
    });

    document.getElementById('deploy-event-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const targetClubId = user.adminForClubId || f.get('clubId');
      const title = f.get('title');
      const venue = f.get('venue');
      const totalSeats = Number(f.get('totalSeats'));
      const date = f.get('date');

      if (!targetClubId) {
        alert("Please select a hosting club.");
        return;
      }

      const clubsList = getClubs();
      const club = clubsList.find(c => c.id === targetClubId);
      if (!club) {
        alert(`Error: The assigned club (ID: ${targetClubId}) does not exist. Please select a valid club or re-register it.`);
        return;
      }

      const currentEvents = getEvents();
      
      // Check if editing
      const editEventId = document.getElementById('deploy-event-form').getAttribute('data-edit-id');
      if (editEventId) {
        const updatedEvents = currentEvents.map(ev => {
          if (ev.id === editEventId) {
            return {
              ...ev,
              clubId: targetClubId,
              clubName: club.name,
              title,
              date: new Date(date).toISOString(),
              venue,
              totalSeats
            };
          }
          return ev;
        });
        saveEvents(updatedEvents);
        triggerToast(`Event Updated: ${title}`);
      } else {
        const newEvent = {
          id: `event-${Date.now()}`,
          clubId: targetClubId,
          clubName: club.name,
          title,
          description: `Workshops and research presentations hosted by ${club.name}. Join us for positioning lectures and collaborations.`,
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
          date: new Date(date).toISOString(),
          venue,
          totalSeats,
          registeredSeats: 0,
          speakers: [],
          agenda: [{ time: "09:00 AM", title: "Orientation", desc: "Brief welcome and setup instruction session." }]
        };
        saveEvents([...currentEvents, newEvent]);
        triggerToast(`Live Event Deployed: ${title}`);
      }

      deployEventModal.classList.remove('active');
      document.getElementById('deploy-event-form').removeAttribute('data-edit-id');
      e.target.reset();
      renderAdminDashboard();
    });

    // Tab bindings
    const tabs = ['dashboard', 'events', 'members', 'settings', 'verify'];
    tabs.forEach(tabName => {
      const btn = document.getElementById(`tab-${tabName}-label`);
      btn?.addEventListener('click', () => {
        activeTab = tabName;
        window.adminActiveTab = tabName;
        tabs.forEach(t => document.getElementById(`tab-${t}-label`)?.classList.remove('active'));
        btn.classList.add('active');
        if (typeof window.renderAdminTable === 'function') {
          window.renderAdminTable();
        }
      });
    });

    renderAdminDashboard();
  }

  window.openDeployEventModal = function(editId = null) {
    const user = getUserProfile();
    const select = document.getElementById('hosting-club-select');
    const staticDiv = document.getElementById('hosting-club-static');
    const clubsList = getClubs();
    const deployEventModal = document.getElementById('deploy-event-modal');
    const form = document.getElementById('deploy-event-form');

    if (user.adminForClubId) {
      const assignedClub = clubsList.find(c => c.id === user.adminForClubId);
      if (assignedClub) {
        select.style.display = 'block';
        staticDiv.style.display = 'none';
        select.innerHTML = clubsList.map(c => `<option value="${c.id}" ${c.id === user.adminForClubId ? 'selected' : ''}>${c.name}</option>`).join('');
      } else {
        staticDiv.style.display = 'none';
        select.style.display = 'block';
        select.innerHTML = `<option value="">Select a Club</option>` + 
          clubsList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      }
    } else {
      staticDiv.style.display = 'none';
      select.style.display = 'block';
      select.innerHTML = `<option value="">Select a Club</option>` + 
        clubsList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    if (editId) {
      const ev = getEvents().find(e => e.id === editId);
      if (ev) {
        form.setAttribute('data-edit-id', editId);
        form.title.value = ev.title;
        form.venue.value = ev.venue;
        form.totalSeats.value = ev.totalSeats;
        
        // format ISO date to local datetime format
        const d = new Date(ev.date);
        const pad = (num) => String(num).padStart(2, '0');
        const formattedDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        form.date.value = formattedDate;
        
        if (!user.adminForClubId) {
          form.clubId.value = ev.clubId;
        }
      }
    } else {
      form.removeAttribute('data-edit-id');
      form.reset();
      
      // Pre-populate with tomorrow at 10:00 AM
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
      const pad = (num) => String(num).padStart(2, '0');
      const formattedDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      form.date.value = formattedDate;
    }

    deployEventModal?.classList.add('active');
  }

  window.renderAdminDashboard = function() {
    const clubs = getClubs();
    const events = getEvents();

    // Metrics
    const mClubs = document.getElementById('metric-clubs-count');
    if (mClubs) mClubs.innerText = clubs.length;
    
    const mEvents = document.getElementById('metric-events-count');
    if (mEvents) mEvents.innerText = events.length;

    const mMembers = document.getElementById('metric-members-count');
    if (mMembers) mMembers.innerText = clubs.reduce((a, b) => a + b.memberCount, 0);

    const mSeats = document.getElementById('metric-seats-count');
    if (mSeats) mSeats.innerText = events.reduce((a, b) => a + b.registeredSeats, 0);

    if (typeof window.renderAdminTable === 'function') {
      window.renderAdminTable();
    }
  }
})();
