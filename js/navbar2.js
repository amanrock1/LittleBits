// Event Bindings and Authentication Controllers for Dynamic Navbar
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    initNavbarEvents();
  });

  // Export event initializer for dynamic loads
  window.initNavbarEvents = function() {
    const user = getUserProfile();
    const authModal = document.getElementById('auth-modal');
    const unauthModal = document.getElementById('unauthorized-modal');
    const authErrorMsg = document.getElementById('auth-error-msg');
    const tabLogin = document.getElementById('tab-login-btn');
    const tabSignup = document.getElementById('tab-signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Clean URL parameters helper
    const cleanUrlParams = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('unauthorized');
      url.searchParams.delete('unauthorized_student');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    };

    // Authority Panel Navigation Guard
    const adminLink = document.getElementById('nav-admin');
    adminLink?.addEventListener('click', (e) => {
      const currentUser = getUserProfile();
      if (!currentUser || currentUser.role !== 'admin') {
        e.preventDefault();
        unauthModal?.classList.add('active');
      }
    });

    // Dashboard Navigation Guard
    const dashboardLink = document.getElementById('nav-dashboard');
    dashboardLink?.addEventListener('click', (e) => {
      const currentUser = getUserProfile();
      if (!currentUser || currentUser.role === 'guest') {
        e.preventDefault();
        const modalTitle = document.getElementById('unauth-modal-title');
        const modalDesc = document.getElementById('unauth-modal-desc');
        if (modalTitle) modalTitle.innerText = "Access Denied: Authentication Required";
        if (modalDesc) modalDesc.innerText = "You must log in or sign up to access the Student Dashboard.";
        unauthModal?.classList.add('active');
      }
    });

    // Check URL parameters for unauthorized redirects
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('unauthorized') === 'true') {
      unauthModal?.classList.add('active');
    } else if (urlParams.get('unauthorized_student') === 'true') {
      const modalTitle = document.getElementById('unauth-modal-title');
      const modalDesc = document.getElementById('unauth-modal-desc');
      if (modalTitle) modalTitle.innerText = "Access Denied: Authentication Required";
      if (modalDesc) modalDesc.innerText = "You must log in or sign up to access the Student Dashboard.";
      unauthModal?.classList.add('active');
    }

    // Close Warning modal
    const closeUnauthModal = () => {
      unauthModal?.classList.remove('active');
      cleanUrlParams();
    };
    document.getElementById('unauth-close-btn')?.addEventListener('click', closeUnauthModal);
    document.getElementById('unauth-close-action-btn')?.addEventListener('click', closeUnauthModal);
    document.getElementById('unauth-login-trigger-btn')?.addEventListener('click', () => {
      closeUnauthModal();
      openAuthModal('login');
    });

    // Bind Quick Switch/Demo Login buttons
    document.querySelectorAll('.demo-login-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emailVal = btn.getAttribute('data-email');
        const activeUsersList = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
        const matchedUser = activeUsersList.find(u => u.email.toLowerCase() === emailVal.toLowerCase());
        if (matchedUser) {
          saveUserProfile(matchedUser);
          authModal?.classList.remove('active');
          unauthModal?.classList.remove('active');
          cleanUrlParams();
          triggerToast(`Demo login successful: ${matchedUser.name}`);
          sessionStorage.setItem('skipIntroNext', 'true');
          setTimeout(() => {
            if (matchedUser.role === 'admin' && window.location.pathname.includes('dashboard.html')) {
              window.location.href = 'admin.html';
            } else if (matchedUser.role === 'student' && window.location.pathname.includes('admin.html')) {
              window.location.href = 'dashboard.html';
            } else {
              window.location.reload();
            }
          }, 800);
        }
      });
    });

    // Toggle Dropdowns
    const inboxBtn = document.getElementById('inbox-btn');
    const inboxDropdown = document.getElementById('inbox-dropdown');
    const userSwitcherBtn = document.getElementById('user-switcher-btn');
    const userDropdown = document.getElementById('user-dropdown');

    inboxBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (inboxDropdown) inboxDropdown.style.display = inboxDropdown.style.display === 'none' ? 'block' : 'none';
      if (userDropdown) userDropdown.style.display = 'none';
    });

    userSwitcherBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (userDropdown) userDropdown.style.display = userDropdown.style.display === 'none' ? 'flex' : 'none';
      if (inboxDropdown) inboxDropdown.style.display = 'none';
    });

    document.getElementById('nav-login-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openAuthModal('login');
    });
    document.getElementById('nav-signup-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openAuthModal('signup');
    });

    // Log Out Action
    document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
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
      triggerToast("Logged out from profile context.");
      sessionStorage.setItem('skipIntroNext', 'true');
      if (window.location.pathname.includes('admin.html') || window.location.pathname.includes('dashboard.html')) {
        setTimeout(() => window.location.href = 'index.html', 800);
      } else {
        setTimeout(() => window.location.reload(), 800);
      }
    });

    // Close on click outside
    document.addEventListener('click', () => {
      if (inboxDropdown) inboxDropdown.style.display = 'none';
      if (userDropdown) userDropdown.style.display = 'none';
    });

    // Roster log clear
    document.getElementById('clear-notifs-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      localStorage.setItem("notifications", "[]");
      sessionStorage.setItem('skipIntroNext', 'true');
      window.location.reload();
    });

    // Switch tab inside Auth Modal
    const switchTab = (tab) => {
      if (tab === 'login') {
        tabLogin?.classList.add('active');
        tabSignup?.classList.remove('active');
        if (loginForm) loginForm.style.display = 'flex';
        if (signupForm) signupForm.style.display = 'none';
      } else {
        tabSignup?.classList.add('active');
        tabLogin?.classList.remove('active');
        if (signupForm) signupForm.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
      }
    };

    window.openAuthModal = (tab = 'login') => {
      if (authErrorMsg) authErrorMsg.style.display = 'none';
      authModal?.classList.add('active');
      switchTab(tab);
    };

    tabLogin?.addEventListener('click', () => switchTab('login'));
    tabSignup?.addEventListener('click', () => switchTab('signup'));
    document.getElementById('auth-close-btn')?.addEventListener('click', () => authModal?.classList.remove('active'));

    // Role Select visibility inside Signup
    const roleSelect = document.getElementById('signup-role-select');
    const clubContainer = document.getElementById('signup-club-container');
    const customClubContainer = document.getElementById('signup-custom-club-container');
    const customClubCategoryContainer = document.getElementById('signup-custom-club-category-container');
    const customClubInput = document.getElementById('signup-custom-club-input');
    const clubSelect = document.getElementById('signup-club-select');
    const adminTypeContainer = document.getElementById('signup-admin-type-container');
    const adminTypeSelect = document.getElementById('signup-admin-type-select');

    const updateClubVisibility = () => {
      if (!roleSelect) return;
      if (roleSelect.value === 'admin') {
        if (adminTypeContainer) adminTypeContainer.style.display = 'flex';
        if (adminTypeSelect?.value === 'club') {
          if (clubContainer) clubContainer.style.display = 'flex';
          if (clubSelect?.value === 'new-custom-club') {
            if (customClubContainer) customClubContainer.style.display = 'flex';
            if (customClubCategoryContainer) customClubCategoryContainer.style.display = 'flex';
            customClubInput?.setAttribute('required', 'true');
          } else {
            if (customClubContainer) customClubContainer.style.display = 'none';
            if (customClubCategoryContainer) customClubCategoryContainer.style.display = 'none';
            customClubInput?.removeAttribute('required');
          }
        } else {
          if (clubContainer) clubContainer.style.display = 'none';
          if (customClubContainer) customClubContainer.style.display = 'none';
          if (customClubCategoryContainer) customClubCategoryContainer.style.display = 'none';
          customClubInput?.removeAttribute('required');
        }
      } else {
        if (adminTypeContainer) adminTypeContainer.style.display = 'none';
        if (clubContainer) clubContainer.style.display = 'flex';
        if (clubSelect?.value === 'new-custom-club') {
          if (customClubContainer) customClubContainer.style.display = 'flex';
          if (customClubCategoryContainer) customClubCategoryContainer.style.display = 'flex';
          customClubInput?.setAttribute('required', 'true');
        } else {
          if (customClubContainer) customClubContainer.style.display = 'none';
          if (customClubCategoryContainer) customClubCategoryContainer.style.display = 'none';
          customClubInput?.removeAttribute('required');
        }
      }
    };

    roleSelect?.addEventListener('change', updateClubVisibility);
    clubSelect?.addEventListener('change', updateClubVisibility);
    adminTypeSelect?.addEventListener('change', updateClubVisibility);

    // Profile switch selection handler
    document.querySelectorAll('.sim-user-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = btn.getAttribute('data-idx');
        const activeUsersList = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");

        // Pin Super Admin to matching navbar list
        const superAdminIdx = activeUsersList.findIndex(u => u.role === 'admin' && !u.adminForClubId);
        if (superAdminIdx > -1) {
          const superAdminObj = activeUsersList.splice(superAdminIdx, 1)[0];
          activeUsersList.unshift(superAdminObj);
        }

        const selected = activeUsersList[Number(idx)];
        const user = getUserProfile();

        if (user && user.role !== 'guest' && user.role !== selected.role) {
          if (selected.role === 'admin') {
            const modalTitle = document.getElementById('unauth-modal-title');
            const modalDesc = document.getElementById('unauth-modal-desc');
            if (modalTitle) modalTitle.innerText = "Authority Portal Access Required";
            if (modalDesc) modalDesc.innerText = "Access to the Authority Control Panel is restricted. Please sign in with an authorized administrator account.";
          } else if (selected.role === 'student') {
            const modalTitle = document.getElementById('unauth-modal-title');
            const modalDesc = document.getElementById('unauth-modal-desc');
            if (modalTitle) modalTitle.innerText = "Student Portal Access Required";
            if (modalDesc) modalDesc.innerText = "Access to the Student Dashboard is restricted. Please sign in with a student account.";
          }
          unauthModal?.classList.add('active');
          return;
        }

        saveUserProfile(selected);
        triggerToast(`Switched user context to: ${selected.name}`);
        sessionStorage.setItem('skipIntroNext', 'true');
        setTimeout(() => {
          if (selected.role === 'admin' && window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'admin.html';
          } else if (selected.role === 'student' && window.location.pathname.includes('admin.html')) {
            window.location.href = 'dashboard.html';
          } else {
            window.location.reload();
          }
        }, 800);
      });
    });

    // Handle Login Form Submit
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = document.getElementById('login-email-input').value.trim().toLowerCase();
      const activeUsersList = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");
      const matchedUser = activeUsersList.find(u => u.email.toLowerCase() === emailVal);

      if (matchedUser) {
        saveUserProfile(matchedUser);
        authModal?.classList.remove('active');
        triggerToast(`Logged in successfully: ${matchedUser.name}`);
        sessionStorage.setItem('skipIntroNext', 'true');
        setTimeout(() => window.location.reload(), 800);
      } else {
        if (authErrorMsg) {
          authErrorMsg.innerText = "Account not found. Please Sign Up to create a new profile.";
          authErrorMsg.style.display = 'block';
        }
      }
    });

    // Handle Signup Form Submit
    signupForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('signup-name-input').value.trim();
      const emailVal = document.getElementById('signup-email-input').value.trim().toLowerCase();
      const roleVal = document.getElementById('signup-role-select').value;
      const adminTypeVal = adminTypeSelect?.value;
      const clubVal = clubSelect?.value;
      const activeUsersList = JSON.parse(localStorage.getItem("simulatedUsers") || "[]");

      if (activeUsersList.some(u => u.email.toLowerCase() === emailVal)) {
        if (authErrorMsg) {
          authErrorMsg.innerText = "Email already registered. Try logging in.";
          authErrorMsg.style.display = 'block';
        }
        return;
      }

      let finalClubId = null;
      if (roleVal === 'student' || (roleVal === 'admin' && adminTypeVal === 'club')) {
        if (clubVal === 'new-custom-club') {
          const customClubName = customClubInput.value.trim();
          const customClubCategory = document.getElementById('signup-custom-club-category-select').value;
          finalClubId = `club-${Date.now()}`;
          const newClubObj = {
            id: finalClubId,
            name: customClubName,
            category: customClubCategory,
            logo: "🚀",
            banner: getCategoryBanner(customClubCategory),
            description: `Student community for ${customClubName}.`,
            shortDescription: `Student community for ${customClubName}.`,
            memberCount: 1,
            featured: false,
            adminUsername: roleVal === 'admin' ? nameVal : "System Director",
            achievements: [{ date: "Today", title: "Chapter Chartered", desc: "Successfully formed the club community." }],
            activities: [],
            members: [{ name: nameVal, role: roleVal === 'admin' ? "President / Founder" : "Member / Founder", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${nameVal}` }]
          };
          const currentClubs = getClubs();
          saveClubs([...currentClubs, newClubObj]);
        } else {
          finalClubId = clubVal;
        }
      }

      const newUser = {
        name: nameVal,
        email: emailVal,
        role: roleVal,
        adminForClubId: roleVal === 'admin' ? finalClubId : null,
        streak: 0,
        badges: [],
        certificates: [],
        registrations: [],
        joinedClubs: finalClubId ? [finalClubId] : [],
        notifications: []
      };

      activeUsersList.push(newUser);
      localStorage.setItem("simulatedUsers", JSON.stringify(activeUsersList));
      saveUserProfile(newUser);

      authModal?.classList.remove('active');
      triggerToast(`Account created: Switched context to ${nameVal}`);
      sessionStorage.setItem('skipIntroNext', 'true');
      setTimeout(() => window.location.reload(), 800);
    });
  };
})();
