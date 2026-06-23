// Landing Page Controller
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initLanding();
  });

  function initLanding() {
    const clubs = getClubs();
    const events = getEvents();
    const user = getUserProfile();

    // Update statistics numbers
    const activeChapters = document.getElementById('active-chapters-count');
    if (activeChapters) activeChapters.innerText = `${clubs.length} Active Guilds`;
    
    const statsClubs = document.getElementById('stats-clubs-count');
    if (statsClubs) statsClubs.innerText = clubs.length;

    const statsEvents = document.getElementById('stats-events-count');
    if (statsEvents) statsEvents.innerText = events.length;

    // Render upcoming events grid (3 items max)
    const upcomingPlaceholder = document.getElementById('upcoming-events-placeholder');
    if (upcomingPlaceholder) {
      const list = events.slice(0, 3);
      const registeredIds = user.registrations.map(r => r.eventId);

      upcomingPlaceholder.innerHTML = list.map(e => {
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
              <div class="card-banner" style="height: 180px; position: relative; overflow: hidden;">
                <img src="${e.image}" alt="${e.title}" class="card-banner-img" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) brightness(0.7);" />
                <div class="convenor-tag" style="position: absolute; top: 12px; left: 12px; background: black; color: white; border: 1px solid rgba(255,255,255,0.1); padding: 4px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase;">${e.clubName}</div>
              </div>

              <div class="card-content" style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                <h3 class="font-display font-semibold text-white" style="font-size: 16px; line-height: 1.25;">${e.title}</h3>
                
                <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px; color: var(--color-gray-400);">
                  <div class="flex-between">
                    <span style="color: var(--color-gray-500);">Schedule</span>
                    <span class="text-white">${eventDateStr}</span>
                  </div>
                  <div class="flex-between">
                    <span style="color: var(--color-gray-500);">Venue</span>
                    <span class="text-white" style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e.venue.split('&')[0]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-content" style="padding: 20px; padding-top: 0; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div class="flex-between" style="font-size: 8px; font-weight: bold; text-transform: uppercase; font-family: monospace;">
                  <span style="color: var(--color-gray-500);">Capacity</span>
                  <span style="color: white;">${e.registeredSeats} / ${e.totalSeats} FILLED</span>
                </div>
                <div class="progress-bar-container" style="width: 100%; height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;">
                  <div class="progress-bar-fill" style="width: ${pct}%; height: 100%; background: white;"></div>
                </div>
              </div>

              <button class="w-full font-display font-bold uppercase" style="font-size: 9px; padding: 10px 0; border-radius: 6px; cursor: pointer; background: ${isRegistered ? 'white' : 'rgba(255,255,255,0.03)'}; color: ${isRegistered ? 'black' : 'var(--color-gray-400)'}; border: 1px solid ${isRegistered ? 'white' : 'rgba(255,255,255,0.08)'};">
                ${isRegistered ? 'Pass Ready' : isSoldOut ? 'Sold Out' : 'Claim Pass'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    lucide.createIcons();
  }
})();
