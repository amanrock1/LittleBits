// Event Details Controller
(function() {
  let eventItem = null;
  let currentStep = 1;
  let formData = { name: '', email: '', studentId: '', phone: '' };
  let isSubmitting = false;
  let registrationResult = null;

  document.addEventListener('DOMContentLoaded', () => {
    initEventDetails();
  });

  function initEventDetails() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    if (!eventId) {
      document.body.innerHTML = `
        <div style="padding: 100px; text-align: center; color: white;">
          <p>Invalid event identifier.</p>
          <a href="events.html" style="color: white; text-decoration: underline;">Back to Index</a>
        </div>
      `;
      return;
    }

    const events = getEvents();
    eventItem = events.find(e => e.id === eventId);

    if (!eventItem) {
      document.body.innerHTML = `
        <div style="padding: 100px; text-align: center; color: white;">
          <p>Event record not found.</p>
          <a href="events.html" style="color: white; text-decoration: underline;">Back to Index</a>
        </div>
      `;
      return;
    }

    // Populate Left Column
    document.getElementById('event-cover-img').src = eventItem.image;
    document.getElementById('event-convenor-label').innerText = `Convened by ${eventItem.clubName}`;
    document.getElementById('event-title-label').innerText = eventItem.title;
    document.getElementById('event-desc-label').innerText = eventItem.description;

    // Render Agenda
    const agendaPlaceholder = document.getElementById('event-agenda-placeholder');
    if (agendaPlaceholder) {
      agendaPlaceholder.innerHTML = eventItem.agenda.map(item => `
        <div style="display: flex; gap: 24px;">
          <span class="font-display font-bold font-mono" style="font-size: 12px; color: var(--color-gray-500); width: 80px; flex-shrink: 0;">${item.time}</span>
          <div>
            <h4 class="font-display font-semibold text-white" style="font-size: 12px;">${item.title}</h4>
            <p style="font-size: 12px; color: var(--color-gray-500); margin-top: 4px; line-height: 1.5;">${item.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // Render Speakers
    const speakersPlaceholder = document.getElementById('event-speakers-placeholder');
    if (speakersPlaceholder) {
      if (eventItem.speakers.length === 0) {
        speakersPlaceholder.innerHTML = `<p style="font-size: 12px; color: var(--color-gray-600); grid-column: 1/-1;">No panel speakers scheduled.</p>`;
      } else {
        speakersPlaceholder.innerHTML = eventItem.speakers.map(sp => `
          <div class="speaker-card glass-card">
            <img src="${sp.avatar}" alt="${sp.name}" style="width: 40px; height: 40px; border-radius: 8px; filter: grayscale(1); border: 1px solid rgba(255,255,255,0.1);" />
            <div>
              <h4 style="font-size: 12px; font-weight: bold; color: white;">${sp.name}</h4>
              <p class="font-display" style="font-size: 9px; color: var(--color-gray-500); text-transform: uppercase; font-weight: bold; margin-top: 2px; letter-spacing: 0.05em;">${sp.role}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // Populate Sidebar Details
    document.getElementById('sidebar-date-label').innerText = new Date(eventItem.date).toLocaleDateString();
    document.getElementById('sidebar-venue-label').innerText = eventItem.venue.split('&')[0];
    document.getElementById('sidebar-seats-label').innerText = `${eventItem.totalSeats - eventItem.registeredSeats} seats remaining`;

    // Render Sidebar Action Button
    updateSidebarActions();

    // Setup modal close actions
    const modal = document.getElementById('register-modal');
    document.getElementById('register-modal-close')?.addEventListener('click', () => modal.classList.remove('active'));

    lucide.createIcons();
  }

  function updateSidebarActions() {
    const user = getUserProfile();
    const isRegistered = user.registrations.some(r => r.eventId === eventItem.id);
    const isSoldOut = eventItem.registeredSeats >= eventItem.totalSeats;
    const container = document.getElementById('sidebar-action-container');
    if (!container) return;

    if (isRegistered) {
      container.innerHTML = `
        <div class="glass-panel" style="padding: 16px; border-radius: 12px; text-align: center; border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.01); display: flex; flex-direction: column; gap: 8px; margin-top: 20px;">
          <h4 style="font-size: 12px; font-weight: bold; color: white; text-transform: uppercase; letter-spacing: 0.05em;">Reservation Confirmed</h4>
          <p style="font-size: 10px; color: var(--color-gray-500);">Exhibition pass generated in your dashboard.</p>
        </div>
      `;
    } else if (isSoldOut) {
      container.innerHTML = `
        <button disabled class="glass-btn rounded-lg w-full" style="padding: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; cursor: not-allowed; opacity: 0.4; margin-top: 20px;">
          Allocation Filled
        </button>
      `;
    } else {
      container.innerHTML = `
        <button id="claim-ticket-btn" class="btn-white rounded-lg w-full" style="margin-top: 20px;">
          Claim Free Ticket
        </button>
      `;

      document.getElementById('claim-ticket-btn')?.addEventListener('click', () => {
        const modal = document.getElementById('register-modal');
        document.getElementById('modal-event-title-label').innerText = eventItem.title;
        currentStep = 1;
        
        // Pre-fill user details if student
        const userProfile = getUserProfile();
        formData = {
          name: userProfile.name,
          email: userProfile.email,
          studentId: 'CS-2026',
          phone: '555-0199'
        };

        modal.classList.add('active');
        renderStepView();
      });
    }
  }

  function renderStepView() {
    const container = document.getElementById('step-views-container');
    if (!container) return;

    // Highlight step label headers
    document.getElementById('step-label-1').className = currentStep >= 1 ? 'active' : '';
    document.getElementById('step-label-2').className = currentStep >= 2 ? 'active' : '';
    document.getElementById('step-label-3').className = currentStep >= 3 ? 'active' : '';

    const errorBox = document.getElementById('register-error-box');
    if (errorBox) errorBox.style.display = 'none';

    if (currentStep === 1) {
      container.innerHTML = `
        <form id="step-1-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div class="input-group">
            <label class="input-label">Name</label>
            <input type="text" name="name" required placeholder="e.g. Marcus Aurelius" value="${formData.name}" class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px;" />
          </div>
          <div class="input-group">
            <label class="input-label">Email</label>
            <input type="email" name="email" required placeholder="e.g. name@campus.edu" value="${formData.email}" class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px;" />
          </div>
          <div class="input-group">
            <label class="input-label">Phone</label>
            <input type="text" name="phone" required placeholder="e.g. 555-0199" value="${formData.phone}" class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px;" />
          </div>
          <button type="submit" class="btn-white rounded-lg w-full" style="margin-top: 16px;">Submit Registration</button>
        </form>
      `;

      // Form step 1 submission
      document.getElementById('step-1-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        formData.name = f.get('name');
        formData.email = f.get('email');
        formData.studentId = 'CS-' + Math.floor(1000 + Math.random() * 9000);
        formData.phone = f.get('phone');
        
        currentStep = 2;
        renderStepView();
      });
    } 
    
    else if (currentStep === 2) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div class="glass-panel" style="padding: 20px; border-radius: 12px; border-color: rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 12px; font-size: 12px; background: rgba(255,255,255,0.01);">
            <div class="flex-between">
              <span style="color: var(--color-gray-500);">Attendee</span>
              <span style="color: white; font-weight: 600;">${formData.name}</span>
            </div>
            <div class="flex-between">
              <span style="color: var(--color-gray-500);">Student ID</span>
              <span style="color: white; font-weight: 600;">${formData.studentId}</span>
            </div>
            <div class="flex-between">
              <span style="color: var(--color-gray-500);">Pass Type</span>
              <span class="font-display text-white font-bold" style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em;">Division Roster</span>
            </div>
          </div>

          <button id="confirm-btn" class="btn-white rounded-lg w-full" ${isSubmitting ? 'disabled' : ''}>
            ${isSubmitting ? 'Generating dossier allocation...' : 'Confirm Allocation'}
          </button>
        </div>
      `;

      document.getElementById('confirm-btn')?.addEventListener('click', () => {
        isSubmitting = true;
        renderStepView();

        setTimeout(() => {
          const res = registerForEvent(eventItem.id, formData);
          isSubmitting = false;
          
          if (res.success && res.registration) {
            registrationResult = res.registration;
            currentStep = 3;
            renderStepView();

            // Refresh parent sidebar seats count and actions
            const freshEvents = getEvents();
            eventItem = freshEvents.find(e => e.id === eventItem.id);
            document.getElementById('sidebar-seats-label').innerText = `${eventItem.totalSeats - eventItem.registeredSeats} seats remaining`;
            updateSidebarActions();

            // Confetti explosion
            confetti({
              particleCount: 120,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#ffffff', '#a1a1aa', '#71717a']
            });
          } else {
            const errBox = document.getElementById('register-error-box');
            errBox.innerText = res.error || 'Failed to complete registration.';
            errBox.style.display = 'block';
            currentStep = 2;
            renderStepView();
          }
        }, 1200);
      });
    } 
    
    else if (currentStep === 3) {
      // Secured Pass ticket render
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 24px; text-align: center;">
          <h4 class="font-display font-bold text-white uppercase" style="font-size: 14px; letter-spacing: 0.05em;">Pass Secured</h4>
          
          <div class="qr-box-frame">
            <div class="qr-pixel-grid">
              ${Array.from({ length: 36 }).map((_, i) => {
                const isDark = (i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 5 || i === 30 || i === 35;
                return `<div class="qr-pixel ${isDark ? 'dark' : ''}"></div>`;
              }).join('')}
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: var(--color-gray-500); letter-spacing: 0.1em;">Entry Signature</div>
              <code style="font-size: 12px; color: white; font-family: monospace;">${registrationResult.regId}</code>
            </div>
          </div>

          <div style="display: flex; gap: 16px;">
            <button id="export-pass-btn" class="glass-btn rounded-lg" style="flex: 1; padding: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Export Pass</button>
            <button id="done-pass-btn" class="btn-white rounded-lg" style="flex: 1; padding: 12px; font-size: 11px; font-weight: bold;">Done</button>
          </div>
        </div>
      `;

      document.getElementById('export-pass-btn')?.addEventListener('click', () => {
        alert(`Downloading Dossier Pass: ${registrationResult.regId}`);
      });

      document.getElementById('done-pass-btn')?.addEventListener('click', () => {
        document.getElementById('register-modal').classList.remove('active');
      });
    }

    lucide.createIcons();
  }
})();
