// Helper Functions for LocalStorage Mock Database
function getCategoryBanner(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes('code') || cat.includes('tech') || cat.includes('hack')) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('music') || cat.includes('beat') || cat.includes('sound')) {
    return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('robot') || cat.includes('hardware') || cat.includes('iot') || cat.includes('science')) {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('photo') || cat.includes('shutter') || cat.includes('camera')) {
    return "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('sport') || cat.includes('athlet') || cat.includes('soccer')) {
    return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('venture') || cat.includes('launch') || cat.includes('entrepreneur')) {
    return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop";
  }
  if (cat.includes('debate') || cat.includes('literary') || cat.includes('speak')) {
    return "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('eco') || cat.includes('env') || cat.includes('nature') || cat.includes('green')) {
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('art') || cat.includes('paint') || cat.includes('crew') || cat.includes('sketch')) {
    return "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('chess') || cat.includes('game') || cat.includes('play')) {
    return "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1200&auto=format&fit=crop";
  }
  if (cat.includes('theatre') || cat.includes('stage') || cat.includes('drama')) {
    return "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop";
  }
  return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop";
}

function getClubs() {
  const data = localStorage.getItem("clubs");
  if (!data) {
    localStorage.setItem("clubs", JSON.stringify(DEFAULT_CLUBS));
    return DEFAULT_CLUBS;
  }
  let parsed = JSON.parse(data);
  let modified = false;

  // Ensure all clubs have a valid banner and logo
  parsed = parsed.map(c => {
    if (!c.banner || c.banner.trim() === "") {
      c.banner = getCategoryBanner(c.category);
      modified = true;
    }
    return c;
  });

  if (parsed.length < DEFAULT_CLUBS.length) {
    DEFAULT_CLUBS.forEach(dc => {
      if (!parsed.some(c => c.id === dc.id)) {
        parsed.push(dc);
        modified = true;
      }
    });
  }

  if (modified) {
    localStorage.setItem("clubs", JSON.stringify(parsed));
  }
  return parsed;
}

function saveClubs(clubs) {
  localStorage.setItem("clubs", JSON.stringify(clubs));
}

function getEvents() {
  const data = localStorage.getItem("events");
  if (!data) {
    localStorage.setItem("events", JSON.stringify(DEFAULT_EVENTS));
    return DEFAULT_EVENTS;
  }
  const parsed = JSON.parse(data);
  if (parsed.length < DEFAULT_EVENTS.length) {
    const updated = [...parsed];
    DEFAULT_EVENTS.forEach(de => {
      if (!updated.some(e => e.id === de.id)) {
        updated.push(de);
      }
    });
    localStorage.setItem("events", JSON.stringify(updated));
    return updated;
  }
  return parsed;
}

function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

function getUserProfile() {
  const data = localStorage.getItem("userProfile");
  if (!data) {
    localStorage.setItem("userProfile", JSON.stringify(SIMULATED_USERS[0]));
    return SIMULATED_USERS[0];
  }
  const cached = JSON.parse(data);
  const usersData = localStorage.getItem("simulatedUsers");
  if (usersData) {
    const users = JSON.parse(usersData);
    const latest = users.find(u => u.email.toLowerCase() === cached.email.toLowerCase());
    if (latest) {
      localStorage.setItem("userProfile", JSON.stringify(latest));
      return latest;
    }
  }
  return cached;
}

function saveUserProfile(profile) {
  localStorage.setItem("userProfile", JSON.stringify(profile));

  // Sync to simulatedUsers list
  const usersData = localStorage.getItem("simulatedUsers");
  if (usersData) {
    const users = JSON.parse(usersData);
    const updatedUsers = users.map(u => u.email.toLowerCase() === profile.email.toLowerCase() ? profile : u);
    localStorage.setItem("simulatedUsers", JSON.stringify(updatedUsers));
  }
}

function triggerToast(msg) {
  // Stacking Toast System
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.right = '24px';
    container.style.zIndex = '99999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'glass-panel';
  toast.style.padding = '16px 20px';
  toast.style.borderRadius = '12px';
  toast.style.fontSize = '12px';
  toast.style.fontWeight = 'bold';
  toast.style.color = 'white';
  toast.style.border = '1px solid rgba(255,255,255,0.15)';
  toast.style.background = 'rgba(12, 12, 16, 0.9)';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.justifyContent = 'space-between';
  toast.style.gap = '16px';
  toast.style.minWidth = '280px';
  toast.style.maxWidth = '400px';
  toast.style.animation = 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';

  toast.innerHTML = `
    <span>${msg}</span>
    <button class="toast-close-btn" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:14px; font-weight:bold; padding:0; line-height:1;">✕</button>
  `;

  container.appendChild(toast);

  // Auto remove toast
  const autoRemoveTimer = setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);

  // Manual dismiss
  toast.querySelector('.toast-close-btn').addEventListener('click', () => {
    clearTimeout(autoRemoveTimer);
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  });

  // Save notification to inbox
  const notifs = JSON.parse(localStorage.getItem("notifications") || "[]");
  notifs.unshift(msg);
  localStorage.setItem("notifications", JSON.stringify(notifs));

  // Dispatch notification update event
  window.dispatchEvent(new Event('notificationsUpdated'));
}

function joinClub(clubId) {
  const profile = getUserProfile();
  const clubs = getClubs();

  if (profile.joinedClubs.includes(clubId)) {
    profile.joinedClubs = profile.joinedClubs.filter(id => id !== clubId);
    const updatedClubs = clubs.map(c => {
      if (c.id === clubId) {
        return { ...c, memberCount: Math.max(0, c.memberCount - 1) };
      }
      return c;
    });
    saveClubs(updatedClubs);
    triggerToast(`Left ${clubs.find(c => c.id === clubId)?.name || 'Club'}.`);
  } else {
    profile.joinedClubs.push(clubId);
    if (profile.joinedClubs.length === 1 && !profile.badges.some(b => b.id === "badge-1")) {
      profile.badges.push({
        id: "badge-1",
        name: "Community Starter",
        icon: "🌱",
        desc: "Joined your first club.",
        unlockedAt: new Date().toISOString().split('T')[0]
      });
    }
    const updatedClubs = clubs.map(c => {
      if (c.id === clubId) {
        return { ...c, memberCount: c.memberCount + 1 };
      }
      return c;
    });
    saveClubs(updatedClubs);
    triggerToast(`Successfully joined ${clubs.find(c => c.id === clubId)?.name || 'Club'}!`);
  }

  saveUserProfile(profile);
  return profile;
}

function registerForEvent(eventId, details) {
  const events = getEvents();
  const profile = getUserProfile();

  const eventIdx = events.findIndex(e => e.id === eventId);
  if (eventIdx === -1) return { success: false, error: "Event not found." };

  const event = events[eventIdx];
  if (event.registeredSeats >= event.totalSeats) {
    return { success: false, error: "Event is fully booked." };
  }

  if (profile.registrations.some(r => r.eventId === eventId)) {
    return { success: false, error: "Already registered for this event." };
  }

  const studentIdHash = details.studentId.replace(/[^A-Za-z0-9]/g, '').slice(-2).toUpperCase() || "X";
  const regId = "REG-" + Math.floor(1000 + Math.random() * 9000) + "-" + studentIdHash;
  const newReg = {
    eventId,
    regId,
    qrCode: `${regId}-${event.clubName}`,
    date: new Date().toISOString().split('T')[0]
  };

  profile.registrations.push(newReg);
  profile.streak += 1;

  if (event.title.toLowerCase().includes("hackathon") && !profile.badges.some(b => b.id === "badge-hack")) {
    profile.badges.push({
      id: "badge-hack",
      name: "Hackathon Hero",
      icon: "⚡",
      desc: "Registered for a campus Hackathon.",
      unlockedAt: new Date().toISOString().split('T')[0]
    });
  }

  if (profile.registrations.length >= 3 && !profile.badges.some(b => b.id === "badge-cert")) {
    profile.badges.push({
      id: "badge-cert",
      name: "Event Voyager",
      icon: "🎖️",
      desc: "Registered for 3 or more campus events.",
      unlockedAt: new Date().toISOString().split('T')[0]
    });
  }

  event.registeredSeats += 1;
  events[eventIdx] = event;

  saveEvents(events);
  saveUserProfile(profile);

  triggerToast(`Reserved seat at ${event.title}! Code: ${regId}`);
  return { success: true, registration: newReg };
}

function claimCertificate(eventId) {
  const profile = getUserProfile();
  const events = getEvents();
  const event = events.find(e => e.id === eventId);

  if (!event) return profile;

  if (profile.certificates.some(c => c.eventTitle.includes(event.title))) {
    return profile;
  }

  const certId = "CERT-" + event.clubName.slice(0, 3).toUpperCase() + "-" + Math.floor(10000 + Math.random() * 90000);
  profile.certificates.push({
    id: certId,
    eventTitle: event.title,
    clubName: event.clubName,
    date: new Date().toISOString().split('T')[0],
    code: certId
  });

  saveUserProfile(profile);
  triggerToast("Certificate claimed! Added to your credentials.");
  return profile;
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
