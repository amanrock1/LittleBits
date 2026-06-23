// Campus Events Page Controller
(function() {
  let searchQuery = '';
  let filterMode = 'all'; // 'all' | 'registered'
  let timerInterval = null;

  document.addEventListener('DOMContentLoaded', () => {
    initEvents();
  });

  function initEvents() {
    const user = getUserProfile();

    // Set count on switcher button
    document.getElementById('switch-my-btn').innerText = `My Bookings (${user.registrations.length})`;

    // Bind filters
    const searchInput = document.getElementById('search-events-input');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateEventsList();
    });

    const switchAllBtn = document.getElementById('switch-all-btn');
    const switchMyBtn = document.getElementById('switch-my-btn');

    switchAllBtn?.addEventListener('click', () => {
      filterMode = 'all';
      switchAllBtn.classList.add('active');
      switchMyBtn.classList.remove('active');
      updateEventsList();
    });

    switchMyBtn?.addEventListener('click', () => {
      filterMode = 'registered';
      switchMyBtn.classList.add('active');
      switchAllBtn.classList.remove('active');
      updateEventsList();
    });

    updateEventsList();
  }

  function updateEventsList() {
    const events = getEvents();
    const user = getUserProfile();
    const registeredIds = user.registrations.map(r => r.eventId);

    const filtered = events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.clubName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMode = filterMode === 'all' || registeredIds.includes(e.id);
      return matchesSearch && matchesMode;
    });

    const grid = document.getElementById('events-grid-placeholder');
    if (!grid) return;

    // Clear any existing countdown intervals
    if (timerInterval) clearInterval(timerInterval);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; padding: 60px; text-align: center; border-radius: 16px;">
          <p style="font-size: 12px; color: var(--color-gray-500); text-transform: uppercase;">No matching exhibition records.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(e => {
      const isRegistered = registeredIds.includes(e.id);
      const isSoldOut = e.registeredSeats >= e.totalSeats;
      const pct = Math.min(100, Math.round((e.registeredSeats / e.totalSeats) * 100));
      const eventDateStr = new Date(e.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <div class="event-card glass-card" style="cursor: pointer;" onclick="window.location.href='event-details.html?id=${e.id}'">
          <div>
            <!-- Banner -->
            <div class="card-banner">
              <img src="${e.image}" alt="${e.title}" class="card-banner-img" />
              <div class="convenor-tag">${e.clubName}</div>
              
              <!-- Countdown timer slots -->
              <div class="timer-overlay font-display" data-date="${e.date}">
                <div class="timer-box countdown-days">0D</div>
                <div class="timer-box countdown-hours">0H</div>
                <div class="timer-box countdown-mins">0M</div>
              </div>
            </div>

            <!-- Details -->
            <div class="card-content" style="display: flex; flex-direction: column; gap: 16px;">
              <h3 class="font-display font-semibold text-white" style="font-size: 18px; line-height: 1.25;">${e.title}</h3>
              
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--color-gray-400);">
                <div class="flex-between" style="border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 8px;">
                  <span style="color: var(--color-gray-500);">Schedule</span>
                  <span class="text-white">${eventDateStr}</span>
                </div>
                <div class="flex-between">
                  <span style="color: var(--color-gray-500);">Venue</span>
                  <span class="text-white" style="max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e.venue.split('&')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-content" style="padding-top: 0; display: flex; flex-direction: column; gap: 20px;">
            <!-- Progress seats -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div class="flex-between" style="font-size: 9px; font-weight: bold; text-transform: uppercase; font-family: monospace;">
                <span style="color: var(--color-gray-500);">Seat Capacity</span>
                <span class="${isSoldOut ? 'text-rose-400' : 'text-white'}">
                  ${isSoldOut ? 'SOLD OUT' : `${e.registeredSeats} / ${e.totalSeats} FILLED`}
                </span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill ${isSoldOut ? 'sold-out' : ''}" style="width: ${pct}%;"></div>
              </div>
            </div>

            <!-- Button action -->
            <button class="event-action-btn w-full font-display font-bold uppercase" style="font-size: 10px; padding: 12px 0; border-radius: 8px; cursor: pointer; transition: all 0.3s; background: ${isRegistered ? 'white' : 'rgba(255,255,255,0.03)'}; color: ${isRegistered ? 'black' : 'var(--color-gray-400)'}; border: 1px solid ${isRegistered ? 'white' : 'rgba(255,255,255,0.08)'};">
              ${isRegistered ? 'Registered (Pass Ready)' : isSoldOut ? 'Sold Out' : 'Claim Pass'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Setup active countdown update loops
    const updateTimers = () => {
      document.querySelectorAll('.timer-overlay').forEach(el => {
        const targetStr = el.getAttribute('data-date');
        const diff = +new Date(targetStr) - +new Date();
        
        let days = 0, hours = 0, mins = 0;
        if (diff > 0) {
          days = Math.floor(diff / (1000 * 60 * 60 * 24));
          hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          mins = Math.floor((diff / 1000 / 60) % 60);
        }

        const daysBox = el.querySelector('.countdown-days');
        const hoursBox = el.querySelector('.countdown-hours');
        const minsBox = el.querySelector('.countdown-mins');

        if (daysBox) daysBox.innerText = `${days}D`;
        if (hoursBox) hoursBox.innerText = `${hours}H`;
        if (minsBox) minsBox.innerText = `${mins}M`;
      });
    };

    updateTimers();
    timerInterval = setInterval(updateTimers, 1000);

    // Populate Past Events Gallery
    const pastEvents = [
      {
        title: "Spring Symposium 2025",
        clubName: "Vanguard Robotics",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
        date: "2025-04-12",
        venue: "Research Block Room 102"
      },
      {
        title: "AI & Society Summit",
        clubName: "Apex Coders",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
        date: "2025-05-18",
        venue: "Dean Conference Hall"
      },
      {
        title: "Acoustic Solo Exhibition",
        clubName: "Octave Beats",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
        date: "2025-06-02",
        venue: "Lakeview Amphitheatre"
      }
    ];

    const pastPlaceholder = document.getElementById('past-events-placeholder');
    if (pastPlaceholder) {
      pastPlaceholder.innerHTML = pastEvents.map(pe => `
        <div class="event-card glass-card" style="opacity: 0.85;">
          <div class="card-banner" style="height: 180px; position: relative;">
            <img src="${pe.image}" alt="${pe.title}" class="card-banner-img" />
            <div class="convenor-tag">${pe.clubName}</div>
          </div>
          <div class="card-content" style="padding: 20px;">
            <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: var(--color-gray-500); font-family: monospace;">Completed Exhibit</span>
            <h3 class="font-display font-semibold text-white" style="font-size: 16px; margin-top: 6px;">${pe.title}</h3>
            <p style="font-size: 11px; color: var(--color-gray-500); margin-top: 8px;">Held on ${new Date(pe.date).toLocaleDateString()} at ${pe.venue}</p>
          </div>
        </div>
      `).join('');
    }

    lucide.createIcons();
  }
})();
