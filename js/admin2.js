// Table Renders, scanning verifications, and member operations for Admin Console
(function() {
  function canManageClub(clubId) {
    const user = getUserProfile();
    if (!user.adminForClubId) return true; // Super Admin
    return user.adminForClubId === clubId;
  }

  // Export to window so it can be called from admin.js initializers
  window.renderAdminTable = function() {
    const clubs = getClubs();
    const events = getEvents();
    const placeholder = document.getElementById('admin-table-placeholder');
    if (!placeholder) return;

    // Read active tab dynamically from parent closure context state or DOM tab class
    let activeTab = window.adminActiveTab || 'dashboard';
    const activeLabel = document.querySelector('.admin-tabs .active, .admin-sidebar .active, .glass-panel .active');
    if (activeLabel && !window.adminActiveTab) {
      const idStr = activeLabel.id || '';
      activeTab = idStr.replace('tab-', '').replace('-label', '') || 'dashboard';
    }

    if (activeTab === 'dashboard') {
      const user = getUserProfile();
      const isSuperAdmin = !user.adminForClubId;
      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%;">
          <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.04);">
            <h3 style="font-size: 14px; font-weight: bold; color: white; margin-bottom: 8px;">Managed Chapters</h3>
            <p style="font-size: 11px; color: var(--color-gray-500);">Review general configuration metrics of student guilds registered on the system.</p>
          </div>
          ${clubs.map(club => {
            const isManaged = canManageClub(club.id);
            return `
              <div class="admin-row">
                <div>
                  <h4 style="font-size: 13px; font-weight: bold; color: white;">
                    ${club.name}
                  </h4>
                  <span style="font-size: 9px; color: var(--color-gray-500); text-transform: uppercase;">${club.category}</span>
                </div>
                <div style="display: flex; gap: 24px; align-items: center;">
                  <span style="font-size: 11px; color: var(--color-gray-400);">${club.memberCount} Members</span>
                  <span style="font-size: 11px; color: ${isManaged ? 'var(--color-primary-glow)' : 'var(--color-gray-600)'}; font-weight: bold; margin-right: 8px;">
                    ${isManaged ? 'Active Control' : 'Locked'}
                  </span>
                  ${isSuperAdmin ? `
                    <button class="action-icon-btn rose delete-club-btn" data-id="${club.id}" data-name="${club.name}" title="Delete Club">
                      <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Bind delete club triggers for Super Admin
      document.querySelectorAll('.delete-club-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const clubId = btn.getAttribute('data-id');
          const clubName = btn.getAttribute('data-name');
          if (confirm(`Are you sure you want to delete the club "${clubName}"?`)) {
            // Delete club
            const currentClubs = getClubs();
            const updatedClubs = currentClubs.filter(c => c.id !== clubId);
            saveClubs(updatedClubs);
            
            // Clean up member/admin links (remove from joinedClubs and adminForClubId)
            const allUsers = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
            const updatedUsers = allUsers.map(u => {
              const isMember = u.joinedClubs?.includes(clubId);
              const isAdminOfClub = u.adminForClubId === clubId;
              if (isMember || isAdminOfClub) {
                return {
                  ...u,
                  joinedClubs: u.joinedClubs.filter(id => id !== clubId),
                  adminForClubId: isAdminOfClub ? null : u.adminForClubId
                };
              }
              return u;
            });
            localStorage.setItem("simulatedUsers", JSON.stringify(updatedUsers));
            
            // Sync current profile
            const curProfile = getUserProfile();
            const matchedUpdated = updatedUsers.find(u => u.email === curProfile.email);
            if (matchedUpdated) {
              saveUserProfile(matchedUpdated);
            }
            
            triggerToast(`Club "${clubName}" successfully deleted.`);
            window.renderAdminDashboard();
          }
        });
      });
      lucide.createIcons();
    } 
    
    else if (activeTab === 'events') {
      const allUsers = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%;">
          <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="font-size: 14px; font-weight: bold; color: white; margin-bottom: 4px;">Live Exhibition list</h3>
              <p style="font-size: 11px; color: var(--color-gray-500);">Deploy new expos, modify agendas, or delete active passes.</p>
            </div>
            <button id="inline-deploy-event-btn" class="btn-white rounded-lg font-display uppercase" style="padding: 8px 16px; font-size: 10px;">Create Event</button>
          </div>
          ${events.length === 0 ? `
            <div style="padding: 40px; text-align: center; color: var(--color-gray-500);">No active events.</div>
          ` : events.map(event => {
            const isManaged = canManageClub(event.clubId);
            const eventRegistrations = [];
            allUsers.forEach(u => {
              const reg = u.registrations?.find(r => r.eventId === event.id);
              if (reg) {
                eventRegistrations.push({ user: u, reg: reg });
              }
            });

            return `
              <div class="admin-row" style="flex-direction: column; align-items: stretch; gap: 12px;">
                <div class="flex-between w-full" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <img src="${event.image}" alt="${event.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; filter: grayscale(1);" />
                    <div>
                      <h4 style="font-size: 13px; font-weight: bold; color: white;">${event.title}</h4>
                      <span style="font-size: 9px; color: var(--color-gray-500); display: block; margin-top: 2px;">${event.clubName} // ${new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 11px; color: var(--color-gray-400);">${eventRegistrations.length} / ${event.totalSeats} booked</span>
                    <div style="display: flex; gap: 8px;">
                      ${isManaged ? `
                        <button class="glass-btn toggle-roster-btn" data-id="${event.id}" style="padding: 6px 12px; font-size: 9px; font-weight: bold; text-transform: uppercase; border-radius: 6px; cursor: pointer;">
                          Roster
                        </button>
                        <button class="action-icon-btn edit-event-btn" data-id="${event.id}" title="Edit Event">
                          <i data-lucide="edit-3" style="width: 15px; height: 15px;"></i>
                        </button>
                        <button class="action-icon-btn rose delete-event-btn" data-id="${event.id}" title="Delete Event">
                          <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
                        </button>
                      ` : `✕`}
                    </div>
                  </div>
                </div>

                <!-- Event Roster Expanded Drawer -->
                <div class="roster-drawer-panel glass-panel" id="roster-${event.id}" style="display: none; padding: 20px; border-radius: 12px; flex-direction: column; gap: 16px; background: rgba(0,0,0,0.15); margin-top: 8px; border: 1px solid rgba(255,255,255,0.05);">
                  <div class="flex-between" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                    <h5 style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: white;">Event Registration Roster</h5>
                    ${eventRegistrations.length > 0 ? `
                      <button class="btn-white export-roster-btn" data-id="${event.id}" style="padding: 6px 12px; font-size: 9px; font-weight: bold; border-radius: 6px; text-transform: uppercase;">
                        Export to Excel (CSV)
                      </button>
                    ` : ''}
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 10px; max-height: 240px; overflow-y: auto;">
                    ${eventRegistrations.length === 0 ? `
                      <div style="font-size: 11px; color: var(--color-gray-500); text-align: center; padding: 12px 0;">No students registered for this event yet.</div>
                    ` : eventRegistrations.map(er => {
                      const isRegVerified = er.reg.verified === true;
                      return `
                        <div class="flex-between" style="padding: 8px 12px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.02); border-radius: 8px;">
                          <div>
                            <div style="font-size: 12px; font-weight: bold; color: white;">${er.user.name}</div>
                            <div style="font-size: 9px; color: var(--color-gray-500);">${er.user.email} // Code: <span style="font-family: monospace; color: var(--color-gray-400);">${er.reg.regId}</span></div>
                          </div>
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: ${isRegVerified ? '#4ade80' : '#f59e0b'};">
                              ${isRegVerified ? 'Verified' : 'Pending'}
                            </span>
                            ${!isRegVerified ? `
                              <button class="glass-btn inline-verify-btn" data-email="${er.user.email}" data-regid="${er.reg.regId}" style="padding: 4px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase; border-radius: 4px; border-color: rgba(255,255,255,0.15);">
                                Verify
                              </button>
                            ` : ''}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Bind Inline Create Event Button
      document.getElementById('inline-deploy-event-btn')?.addEventListener('click', () => {
        if (typeof window.openDeployEventModal === 'function') {
          window.openDeployEventModal();
        }
      });

      // Bind toggles for Roster
      document.querySelectorAll('.toggle-roster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const panel = document.getElementById(`roster-${id}`);
          if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
          }
        });
      });

      // Bind inline verifications
      document.querySelectorAll('.inline-verify-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const email = btn.getAttribute('data-email');
          const regId = btn.getAttribute('data-regid');
          
          // update user registrations lists
          const updatedUsers = allUsers.map(u => {
            if (u.email === email) {
              return {
                ...u,
                registrations: u.registrations.map(r => r.regId === regId ? { ...r, verified: true } : r)
              };
            }
            return u;
          });
          localStorage.setItem("simulatedUsers", JSON.stringify(updatedUsers));

          // sync current logged-in user profile if matching
          const curProfile = getUserProfile();
          if (curProfile.email === email) {
            curProfile.registrations = curProfile.registrations.map(r => r.regId === regId ? { ...r, verified: true } : r);
            saveUserProfile(curProfile);
          }

          triggerToast("Student pass successfully verified.");
          window.renderAdminTable(); // refresh events tab
        });
      });

      // Bind Roster Exports
      document.querySelectorAll('.export-roster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const targetEvent = events.find(e => e.id === id);
          if (!targetEvent) return;

          const eventRegs = [];
          allUsers.forEach(u => {
            const reg = u.registrations?.find(r => r.eventId === id);
            if (reg) {
              eventRegs.push({ user: u, reg: reg });
            }
          });

          // Generate Excel (CSV)
          const headers = ["Name", "Email", "Registration ID", "Date Registered", "Status"];
          const rows = eventRegs.map(er => [
            er.user.name,
            er.user.email,
            er.reg.regId,
            er.reg.date || "",
            er.reg.verified ? "Verified" : "Pending"
          ]);

          const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
            
          const encodedUri = encodeURI(csvContent);
          const downloadLink = document.createElement("a");
          downloadLink.setAttribute("href", encodedUri);
          downloadLink.setAttribute("download", `Roster_${targetEvent.title.replace(/[^a-zA-Z0-9]/g, "_")}.csv`);
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          triggerToast(`Roster exported for ${targetEvent.title}`);
        });
      });

      // Bind edits
      document.querySelectorAll('.edit-event-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (typeof window.openDeployEventModal === 'function') {
            window.openDeployEventModal(id);
          }
        });
      });

      // Bind delete events
      document.querySelectorAll('.delete-event-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (confirm("Are you sure you want to delete this event? This cannot be undone.")) {
            const list = getEvents().filter(ev => ev.id !== id);
            saveEvents(list);
            window.renderAdminDashboard();
          }
        });
      });
    } 
    
    else if (activeTab === 'members') {
      const allUsers = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
      const clubsList = getClubs();
      const user = getUserProfile();
      const isSuperAdmin = !user.adminForClubId;
      
      const registeredMembers = allUsers.map(u => {
        let joinedNames = [];
        if (u.role === 'admin' && u.adminForClubId) {
          const club = clubsList.find(c => c.id === u.adminForClubId);
          if (club) joinedNames.push(club.name);
        } else if (u.joinedClubs) {
          u.joinedClubs.forEach(cid => {
            const club = clubsList.find(c => c.id === cid);
            if (club) joinedNames.push(club.name);
          });
        }
        return {
          name: u.name,
          email: u.email,
          status: u.role === 'admin' ? "Officer" : "Active",
          joined: joinedNames.join(', ') || 'None'
        };
      });

      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%;">
          <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.04);">
            <h3 style="font-size: 14px; font-weight: bold; color: white; margin-bottom: 4px;">Member Management</h3>
            <p style="font-size: 11px; color: var(--color-gray-500);">Revoke access keys, configure roles, or audit chapter registrations.</p>
          </div>
          ${registeredMembers.map(m => `
            <div class="admin-row">
              <div>
                <h4 style="font-size: 13px; font-weight: bold; color: white;">${m.name}</h4>
                <span style="font-size: 9px; color: var(--color-gray-500);">${m.email}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 24px;">
                <span style="font-size: 11px; color: var(--color-gray-400); max-width: 200px; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.joined}</span>
                ${isSuperAdmin ? `
                  <button class="action-icon-btn rose remove-member-btn" data-email="${m.email}" data-name="${m.name}" title="Remove Member">
                    <i data-lucide="user-minus" style="width: 15px; height: 15px;"></i>
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Bind member remove (Only Super Admin can do this)
      if (isSuperAdmin) {
        document.querySelectorAll('.remove-member-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const email = btn.getAttribute('data-email');
            const name = btn.getAttribute('data-name');
            if (confirm(`Are you sure you want to delete member ${name} from the system?`)) {
              // Delete user from simulatedUsers list
              const currentUsers = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
              const updatedUsers = currentUsers.filter(u => u.email.toLowerCase() !== email.toLowerCase());
              localStorage.setItem("simulatedUsers", JSON.stringify(updatedUsers));
              
              // If the deleted user is currently logged in, force sign out / reset profile context
              const curProfile = getUserProfile();
              if (curProfile && curProfile.email.toLowerCase() === email.toLowerCase()) {
                saveUserProfile({
                  name: "Guest",
                  email: "guest@campus.edu",
                  role: "guest",
                  streak: 0,
                  badges: [],
                  certificates: [],
                  registrations: [],
                  joinedClubs: []
                });
              }
              
              triggerToast(`Member ${name} permanently deleted from the database.`);
              window.renderAdminDashboard();
            }
          });
        });
      }
      lucide.createIcons();
    } 
    
    else if (activeTab === 'settings') {
      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%; padding: 24px; gap: 24px;">
          <div>
            <h3 style="font-size: 14px; font-weight: bold; color: white; margin-bottom: 4px;">Console Configuration</h3>
            <p style="font-size: 11px; color: var(--color-gray-500);">Customize system preferences, authentication triggers, and global filters.</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <label style="font-size: 12px; font-weight: bold; color: white; display: block;">Gatekeeper Gatekeeping</label>
                <span style="font-size: 9px; color: var(--color-gray-500);">Enforce email domain requirements for simulations.</span>
              </div>
              <input type="checkbox" checked style="accent-color: white;" class="settings-checkbox" />
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px;">
              <div>
                <label style="font-size: 12px; font-weight: bold; color: white; display: block;">Notification Auto-Clear</label>
                <span style="font-size: 9px; color: var(--color-gray-500);">Flush live pulses and logs after 24 hours.</span>
              </div>
              <input type="checkbox" style="accent-color: white;" class="settings-checkbox" />
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px;">
              <div>
                <label style="font-size: 12px; font-weight: bold; color: white; display: block;">Developer Debug Mode</label>
                <span style="font-size: 9px; color: var(--color-gray-500);">Print diagnostics and simulation details in console.</span>
              </div>
              <input type="checkbox" style="accent-color: white;" class="settings-checkbox" />
            </div>

            <button id="save-settings-btn" class="btn-white rounded-lg font-display uppercase" style="padding: 12px; font-size: 11px; margin-top: 16px;">Save Preferences</button>
          </div>
        </div>
      `;

      // Bind settings save
      document.getElementById('save-settings-btn')?.addEventListener('click', () => {
        triggerToast("System settings successfully committed.");
      });
    }
    
    else if (activeTab === 'verify') {
      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%; padding: 24px; gap: 24px;">
          <div>
            <h3 style="font-size: 14px; font-weight: bold; color: white; margin-bottom: 4px;">Pass Verification Scanner</h3>
            <p style="font-size: 11px; color: var(--color-gray-500);">Validate student entry passes, check QR code signatures, and grant campus exhibition access.</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px; max-width: 480px;">
            <div style="display: flex; gap: 12px;">
              <input id="scanner-code-input" type="text" placeholder="Enter Registration ID (e.g. REG-6617-N)" class="glass-input" style="padding: 12px; border-radius: 8px; font-size: 12px; flex: 1;" />
              <button id="scanner-search-btn" class="btn-white rounded-lg font-display uppercase" style="padding: 12px 20px; font-size: 10px;">Search</button>
            </div>

            <!-- Match Result Display -->
            <div id="scanner-result-placeholder" class="glass-panel" style="display: none; padding: 20px; border-radius: 12px; flex-direction: column; gap: 16px; background: rgba(255,255,255,0.01);">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>
      `;

      // Bind search button
      const searchInput = document.getElementById('scanner-code-input');
      const searchBtn = document.getElementById('scanner-search-btn');
      const resultBox = document.getElementById('scanner-result-placeholder');

      const performSearch = () => {
        const val = searchInput.value.trim().toUpperCase();
        if (!val) return;

        const allUsers = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
        const events = getEvents();

        let matchedUser = null;
        let matchedReg = null;

        for (const u of allUsers) {
          if (u.registrations) {
            const reg = u.registrations.find(r => r.regId.toUpperCase() === val);
            if (reg) {
              matchedUser = u;
              matchedReg = reg;
              break;
            }
          }
        }

        if (matchedUser && matchedReg) {
          const ev = events.find(e => e.id === matchedReg.eventId) || { title: "Unknown Exhibition", venue: "Campus Grounds" };
          const isVerified = matchedReg.verified === true;

          resultBox.style.display = 'flex';
          resultBox.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
              <div class="flex-between">
                <span style="color: var(--color-gray-500);">Exhibition</span>
                <span style="color: white; font-weight: bold;">${ev.title}</span>
              </div>
              <div class="flex-between">
                <span style="color: var(--color-gray-500);">Attendee</span>
                <span style="color: white; font-weight: 600;">${matchedUser.name}</span>
              </div>
              <div class="flex-between">
                <span style="color: var(--color-gray-500);">College Email</span>
                <span style="color: white;">${matchedUser.email}</span>
              </div>
              <div class="flex-between" style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px; margin-top: 4px;">
                <span style="color: var(--color-gray-500);">Status</span>
                <span class="font-display font-bold uppercase" style="font-size: 10px; color: ${isVerified ? '#4ade80' : '#f59e0b'};">
                  ${isVerified ? '✓ SCANNED & ADMITTED' : '● PENDING ENTRY'}
                </span>
              </div>
            </div>

            ${!isVerified ? `
              <button id="admit-user-btn" class="btn-white rounded-lg font-display uppercase" style="padding: 10px; font-size: 10px; width: 100%; margin-top: 8px;">Admit & Verify Entrance</button>
            ` : ''}
          `;

          // Bind verification trigger
          document.getElementById('admit-user-btn')?.addEventListener('click', () => {
            matchedReg.verified = true;
            
            // save updated users list
            const updatedUsers = allUsers.map(u => {
              if (u.email === matchedUser.email) {
                return {
                  ...u,
                  registrations: u.registrations.map(r => r.regId === matchedReg.regId ? { ...r, verified: true } : r)
                };
              }
              return u;
            });
            localStorage.setItem("simulatedUsers", JSON.stringify(updatedUsers));
            
            // if we scanned the currently logged-in user profile, sync it too
            const curProfile = getUserProfile();
            if (curProfile.email === matchedUser.email) {
              curProfile.registrations = curProfile.registrations.map(r => r.regId === matchedReg.regId ? { ...r, verified: true } : r);
              saveUserProfile(curProfile);
            }

            triggerToast(`Entrance granted to ${matchedUser.name}!`);
            performSearch(); // reload result card
          });
        } else {
          resultBox.style.display = 'flex';
          resultBox.innerHTML = `
            <div style="font-size: 11px; color: #ef4444; font-weight: bold; text-align: center; text-transform: uppercase;">
              No valid pass registry found for code "${val}".
            </div>
          `;
        }
      };

      searchBtn?.addEventListener('click', performSearch);
      searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
      });
    }

    lucide.createIcons();
  };
})();
