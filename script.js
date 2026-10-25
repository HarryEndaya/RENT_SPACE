// 1. DATA: 28 BARANGAYS OF IROSIN, SORSOGON[cite: 2]
const irosinBarangays = [
  "Bacolod", "Cogon", "Gabao", "Gulang-gulang", "Gumapia", "Macawayan", "Monbon", "Mapaso", "Patag", "Salvacion", "San Agustin", "San Isidro", "San Juan", 
  "San Julian", "San Pedro", "Santo Domingo", "Central"
];

// 2. DATA: PROPERTIES IN IROSIN (WITH LOCALSTORAGE PERSISTENCE)
let propertiesData = JSON.parse(localStorage.getItem("rentspace_properties")) || [
  {
    id: 1,
    title: "RedDoorz @ JL Lodging House",
    barangay: "San Pedro",
    type: "Transient",
    price: 1200,
    priceUnit: "night",
    address: "San Pedro, Irosin, Sorsogon[cite: 1, 2]",
    status: "Available",
    area: "18 sqm",
    occupants: "2 Guests",
    amenities: ["WiFi", "Aircon"],
    description: "Air-conditioned rooms near Irosin town proper.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80",
    thumbs: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80"],
    contact: "09171234567"
  },
  {
    id: 2,
    title: "GABZ'K Hotel & Resort",
    barangay: "San Pedro",
    type: "Room",
    price: 1800,
    priceUnit: "night",
    address: "San Pedro Highway, Irosin[cite: 1, 2]",
    status: "Available",
    area: "24 sqm",
    occupants: "2-4 Guests",
    amenities: ["WiFi", "Aircon", "Parking"],
    description: "Resort-style accommodation with swimming pool facilities.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    thumbs: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"],
    contact: "09189876543"
  },
  {
    id: 3,
    title: "Escaza Suites Apartment",
    barangay: "Central",
    type: "Apartment",
    price: 3500,
    priceUnit: "month",
    address: "Father Zamora St., Central Poblacion, Irosin[cite: 1, 2]",
    status: "Available",
    area: "22 sqm",
    occupants: "2 Occupants",
    amenities: ["WiFi", "Kitchenette"],
    description: "Quiet suite apartment situated in the heart of Irosin.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    thumbs: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"],
    contact: "09194443322"
  }
];

function saveProperties() {
  localStorage.setItem("rentspace_properties", JSON.stringify(propertiesData));
}

// USER & SESSION STATE MANAGEMENT
let registeredUsers = JSON.parse(localStorage.getItem("rentspace_users")) || [
  { fullName: "Mary Grace Lacsa", contact: "09171234567", username: "user", password: "user123", notes: "Looking for room in San Pedro" }
];
let currentUser = JSON.parse(localStorage.getItem("rentspace_current_user")) || null;
let isAdminLoggedIn = false;
let favorites = [];

document.addEventListener("DOMContentLoaded", () => {
  renderBarangayList();
  renderListings(propertiesData);
  updateAuthUI();
});

function saveUsers() {
  localStorage.setItem("rentspace_users", JSON.stringify(registeredUsers));
}

function updateAuthUI() {
  const container = document.getElementById("navAuthButtons");
  if (!container) return;

  if (currentUser) {
    container.innerHTML = `
      <button class="btn btn-primary" onclick="openFeatureForm('user_dashboard')">
        <i class="fa-solid fa-user"></i> ${currentUser.fullName}
      </button>
      <button class="btn btn-secondary btn-sm" onclick="handleUserLogout()">
        <i class="fa-solid fa-right-from-bracket"></i> User Logout
      </button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-primary" onclick="openAuthModal('user_login')">
        <i class="fa-solid fa-right-to-bracket"></i> User Login / Register
      </button>
      <button class="btn btn-secondary" onclick="openAuthModal('admin')">
        <i class="fa-solid fa-user-lock"></i> Admin Login
      </button>
    `;
  }
}

// INPUT ERROR PROTECTION & VALIDATION FUNCTIONS
function validateInputDigits(inputEl, fieldName) {
  const original = inputEl.value;
  const filtered = original.replace(/[^0-9]/g, '');
  if (original !== filtered) {
    alert(`Error! Invalid input. ${fieldName} must contain digits/numbers only!`);
    inputEl.value = filtered;
  }
}

function validateInputLetters(inputEl, fieldName) {
  const original = inputEl.value;
  const filtered = original.replace(/[^a-zA-Z\s]/g, '');
  if (original !== filtered) {
    alert(`Error! Invalid input. ${fieldName} must contain letters and spaces only!`);
    inputEl.value = filtered;
  }
}

// HAMBURGER MENU & OVERLAY TOGGLE
function toggleMobileMenu() {
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  
  navMenu.classList.toggle("active");
  navOverlay.classList.toggle("active");
  
  if (navMenu.classList.contains("active")) {
    hamburgerIcon.classList.remove("fa-bars");
    hamburgerIcon.classList.add("fa-xmark");
  } else {
    hamburgerIcon.classList.remove("fa-xmark");
    hamburgerIcon.classList.add("fa-bars");
  }
}

function closeMobileMenu() {
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  
  if (navMenu && navOverlay && hamburgerIcon) {
    navMenu.classList.remove("active");
    navOverlay.classList.remove("active");
    hamburgerIcon.classList.remove("fa-xmark");
    hamburgerIcon.classList.add("fa-bars");
  }
}

// VIEW SWITCHING
function showMainView() {
  document.getElementById("mainViewContainer").style.display = "block";
  document.getElementById("featureFormContainer").style.display = "none";
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openFeatureForm(featureType) {
  closeMobileMenu();
  
  if (featureType === 'admin') {
    if (!isAdminLoggedIn) {
      alert("Access Denied! Admin Dashboard is restricted to authorized administrators only. Please log in.");
      openAuthModal('admin');
      showMainView();
      return;
    }
  }

  document.getElementById("mainViewContainer").style.display = "none";
  const container = document.getElementById("featureFormContainer");
  const content = document.getElementById("dynamicFeatureContent");
  container.style.display = "block";

  if (featureType === 'search') {
    content.innerHTML = `
      <h2><i class="fa-solid fa-magnifying-glass-location"></i> Search & Filter Form</h2>
      <p style="color:var(--text-muted); margin-bottom:20px;">Use advanced search parameters to filter available rooms and apartments instantly.</p>
      <div style="background:#fff; padding: clamp(15px, 3vw, 25px); border-radius:12px; border:1px solid var(--border-color);">
        <label style="font-weight:700; font-size:0.85rem;">Search Keyword / Barangay</label>
        <input type="text" id="instantSearchInput" placeholder="e.g. San Pedro, Apartment..." class="form-control" style="width:100%; margin:10px 0 20px 0;" onkeyup="runInstantSearch()"/>
        <div id="instantSearchResults" class="listings-grid"></div>
      </div>
    `;
    runInstantSearch();
  } else if (featureType === 'listings') {
    content.innerHTML = `
      <h2><i class="fa-solid fa-building-user"></i> Property Listings Directory</h2>
      <p style="color:var(--text-muted); margin-bottom:20px;">Complete inventory of all listed rooms and apartments in Irosin.</p>
      <div class="listings-grid">
        ${propertiesData.map(p => `
          <div class="property-card">
            <img src="${p.image}" style="width:100%; height:160px; object-fit:cover;"/>
            <div style="padding:15px;">
              <h4 style="font-size:1.05rem; color:var(--secondary);">${p.title}</h4>
              <p style="color:var(--primary); font-weight:bold; margin-top:4px;">₱${p.price.toLocaleString()} / ${p.priceUnit}</p>
              <p style="font-size:0.85rem; color:#64748b; margin-top:2px;">${p.barangay}, Irosin</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (featureType === 'favorites') {
    content.innerHTML = `
      <h2><i class="fa-solid fa-heart"></i> Saved Favorites</h2>
      <p style="color:var(--text-muted); margin-bottom:20px;">Your saved properties and side-by-side comparison matrix.</p>
      <div style="background:#fff; padding: clamp(15px, 3vw, 25px); border-radius:12px; border:1px solid var(--border-color);">
        <p>Saved Favorites Count: <strong>${favorites.length} Properties</strong></p>
        <button class="btn btn-primary" onclick="openCompareModal()" style="margin-top:15px;">Open Comparison Table</button>
      </div>
    `;
  } else if (featureType === 'appointment') {
    content.innerHTML = `
      <h2><i class="fa-solid fa-calendar-days"></i> Viewing Appointment Booking Form</h2>
      <p style="color:var(--text-muted); margin-bottom:20px;">Schedule an on-site visit with property owners.</p>
      <div style="background:#fff; padding: clamp(15px, 3vw, 25px); border-radius:12px; border:1px solid var(--border-color); max-width:600px;">
        <form onsubmit="handleAppointmentSubmit(event)">
          <div class="form-group"><label>Full Name</label><input type="text" id="appointPageName" required class="form-control" placeholder="Juan Dela Cruz" oninput="validateInputLetters(this, 'Full Name')"/></div>
          <div class="form-group"><label>Contact Number (11 digits)</label><input type="text" id="appointPageContact" required class="form-control" placeholder="09171234567" maxlength="11" oninput="validateInputDigits(this, 'Contact Number')"/></div>
          <div class="form-group"><label>Preferred Date</label><input type="date" required class="form-control"/></div>
          <div class="form-group"><label>Preferred Time</label><input type="time" required class="form-control"/></div>
          <button type="submit" class="btn btn-primary btn-block">Submit Viewing Request</button>
        </form>
      </div>
    `;
  } else if (featureType === 'status') {
    content.innerHTML = `
      <h2><i class="fa-solid fa-toggle-on"></i> Availability & Status Tracking</h2>
      <p style="color:var(--text-muted); margin-bottom:20px;">Real-time tracking of available, reserved, or occupied rooms.</p>
      <div style="background:#fff; padding: clamp(15px, 3vw, 25px); border-radius:12px; border:1px solid var(--border-color);">
        <ul style="list-style:none; display:flex; flex-direction:column; gap:10px;">
          ${propertiesData.map(p => `
            <li style="padding:10px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <span><strong>${p.title}</strong> (${p.barangay})</span>
              <span class="badge-status-pill success" style="position:static;">${p.status}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  } else if (featureType === 'user_dashboard') {
    if (!currentUser) {
      openAuthModal('user_login');
      showMainView();
      return;
    }
    renderUserDashboard(content);
  } else if (featureType === 'admin') {
    renderAdminDashboard(content);
  } else if (featureType === 'about') {
    content.innerHTML = `
      <h2><i class="fa-solid fa-circle-info"></i> About Us - RentSpace Irosin</h2>
      <p style="color:var(--text-muted); margin-bottom:20px;">Discover the vision, mission, and comprehensive scope of our platform.</p>
      <div style="background:#fff; padding: clamp(15px, 3vw, 30px); border-radius:12px; border:1px solid var(--border-color); line-height:1.8; color:var(--text-main);">
        <p style="margin-bottom:16px;">RentSpace is a pioneering digital rental discovery platform crafted exclusively for the Municipality of Irosin, Sorsogon. Designed to bridge the gap between property seekers and local homeowners, our system eliminates the traditional difficulties of finding reliable housing by bringing verified rooms, apartments, boarding houses, and transient lodges directly to your screen.</p>
        <p style="margin-bottom:16px;">Spanning across the vibrant neighborhoods and communities of Irosin—ranging from the bustling Poblacion town center to surrounding barangays such as San Pedro, Monbon, Mapaso, and beyond—RentSpace ensures comprehensive geographical coverage.</p>
      </div>
    `;
  } else if (featureType === 'contact') {
    content.innerHTML = `
      <h2><i class="fa-solid fa-headset"></i> Contact Us & User Guide</h2>
      <p style="color:var(--text-muted); margin-bottom:20px;">Get in touch with our support team or learn how to navigate the platform effectively.</p>
      
      <div class="responsive-form-grid" style="margin-bottom:30px;">
        <div style="background:#fff; padding: clamp(15px, 3vw, 25px); border-radius:12px; border:1px solid var(--border-color);">
          <h3 style="color:var(--secondary); margin-bottom:15px; font-size:1.1rem;"><i class="fa-solid fa-book-open"></i> Quick User Guide</h3>
          <ul style="padding-left:20px; display:flex; flex-direction:column; gap:10px; font-size:0.9rem; color:var(--text-main);">
            <li><strong>Searching Stays:</strong> Use the hero search bar to filter by Barangay, Property Type, and Budget.</li>
            <li><strong>Viewing Details:</strong> Click "Details" on any property card to view comprehensive amenities.</li>
            <li><strong>Scheduling Visits:</strong> Click "Schedule" to book an on-site visit with local landlords.</li>
          </ul>
        </div>

        <div style="background:#fff; padding: clamp(15px, 3vw, 25px); border-radius:12px; border:1px solid var(--border-color);">
          <h3 style="color:var(--secondary); margin-bottom:15px; font-size:1.1rem;"><i class="fa-solid fa-address-book"></i> Official Contact Information</h3>
          <p style="margin-bottom:10px; font-size:0.9rem;"><i class="fa-solid fa-location-dot" style="color:var(--primary); margin-right:8px;"></i> Poblacion, Irosin, Sorsogon, 4701 Bicol Region, Philippines</p>
          <p style="margin-bottom:10px; font-size:0.9rem;"><i class="fa-solid fa-phone" style="color:var(--primary); margin-right:8px;"></i> 0917-123-4567 / (056) 555-0192</p>
          <p style="font-size:0.9rem;"><i class="fa-solid fa-envelope" style="color:var(--primary); margin-right:8px;"></i> support@rentspace-irosin.ph</p>
        </div>
      </div>

      <div style="background:#fff; padding: clamp(15px, 3vw, 25px); border-radius:12px; border:1px solid var(--border-color);">
        <h3><i class="fa-solid fa-paper-plane"></i> Send Us an Inquiry / Feedback</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">Have questions or feedback? Drop us a message below.</p>
        <form onsubmit="handleContactInquirySubmit(event)">
          <div class="responsive-form-grid">
            <div class="form-group"><label>Your Full Name</label><input type="text" id="contactInqName" required class="form-control" placeholder="Maria Santos" oninput="validateInputLetters(this, 'Full Name')"/></div>
            <div class="form-group"><label>Contact Number (11 digits)</label><input type="text" id="contactInqPhone" required maxlength="11" class="form-control" placeholder="09171234567" oninput="validateInputDigits(this, 'Contact Number')"/></div>
          </div>
          <div class="form-group"><label>Subject / Topic</label><input type="text" id="contactInqSubject" required class="form-control" placeholder="e.g. Property Listing Inquiry"/></div>
          <div class="form-group"><label>Message</label><textarea id="contactInqMessage" rows="4" required class="form-control" placeholder="Type your message here..."></textarea></div>
          <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
      </div>
    `;
  }
}

function handleContactInquirySubmit(e) {
  e.preventDefault();
  const phone = document.getElementById("contactInqPhone").value;
  if (phone.length !== 11) {
    alert("Error! Contact number must be exactly 11 digits.");
    return;
  }
  alert("Thank you! Your message and inquiry have been submitted.");
  e.target.reset();
}

function switchUserAuthTab(tab) {
  const loginForm = document.getElementById("userLoginForm");
  const regForm = document.getElementById("userRegisterForm");
  const loginBtn = document.getElementById("tabUserLoginBtn");
  const regBtn = document.getElementById("tabUserRegisterBtn");

  if (tab === 'login') {
    loginForm.style.display = "block";
    regForm.style.display = "none";
    loginBtn.className = "btn btn-primary btn-sm";
    regBtn.className = "btn btn-outline btn-sm";
  } else {
    loginForm.style.display = "none";
    regForm.style.display = "block";
    loginBtn.className = "btn btn-outline btn-sm";
    regBtn.className = "btn btn-primary btn-sm";
  }
}

function handleUserRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById("regFullName").value;
  const contact = document.getElementById("regContact").value;
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  if (contact.length !== 11) {
    alert("Error! Contact number must be 11 digits.");
    return;
  }

  const newUser = { fullName, contact, username, password, notes: "Newly registered tenant." };
  registeredUsers.push(newUser);
  saveUsers();

  currentUser = newUser;
  localStorage.setItem("rentspace_current_user", JSON.stringify(currentUser));
  updateAuthUI();
  closeModal('userAuthModal');

  alert("Registration Successful!");
  openFeatureForm('user_dashboard');
}

function handleUserLogin(e) {
  e.preventDefault();
  const u = document.getElementById("userLoginName").value;
  const p = document.getElementById("userLoginPass").value;

  const found = registeredUsers.find(usr => (usr.username === u || usr.fullName === u) && usr.password === p);

  if (found) {
    currentUser = found;
    localStorage.setItem("rentspace_current_user", JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('userAuthModal');
    openFeatureForm('user_dashboard');
  } else {
    alert("Error! Invalid login credentials.");
  }
}

function handleUserLogout() {
  currentUser = null;
  localStorage.removeItem("rentspace_current_user");
  updateAuthUI();
  alert("You have logged out.");
  showMainView();
}

function renderUserDashboard(contentEl) {
  contentEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
      <div>
        <h2><i class="fa-solid fa-user-gear"></i> User Profile & Dashboard</h2>
        <p style="color:var(--text-muted); margin-top: 4px;">Manage your account details and rental preferences.</p>
      </div>
      <button class="btn btn-secondary" onclick="handleUserLogout()"><i class="fa-solid fa-right-from-bracket"></i> User Logout</button>
    </div>

    <div class="responsive-form-grid" style="margin-bottom: 30px;">
      <div style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--border-color); text-align:center;">
        <div style="width:80px; height:80px; background:var(--primary); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 15px auto;">
          <i class="fa-solid fa-user"></i>
        </div>
        <h3 style="color:var(--secondary);">${currentUser.fullName}</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">@${currentUser.username}</p>
        <p style="font-size:0.85rem; color:var(--primary); font-weight:bold; margin-top:10px;"><i class="fa-solid fa-phone"></i> ${currentUser.contact}</p>
      </div>

      <div style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--border-color);">
        <h3 style="margin-bottom:15px; color:var(--secondary); font-size:1.1rem;"><i class="fa-solid fa-pen-to-square"></i> Update User Profile</h3>
        <form onsubmit="handleUserProfileUpdate(event)">
          <div class="responsive-form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="userDashName" value="${currentUser.fullName}" required class="form-control" oninput="validateInputLetters(this, 'Full Name')"/>
            </div>
            <div class="form-group">
              <label>Contact Number (11 digits)</label>
              <input type="text" id="userDashContact" value="${currentUser.contact}" required maxlength="11" class="form-control" oninput="validateInputDigits(this, 'Contact Number')"/>
            </div>
          </div>
          <div class="form-group" style="margin-top:10px;">
            <label>Rental Notes / Preferences</label>
            <input type="text" id="userDashNotes" value="${currentUser.notes || ''}" class="form-control" placeholder="e.g. Prefer apartment near Monbon or San Pedro"/>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top:10px;"><i class="fa-solid fa-floppy-disk"></i> Save Profile Updates</button>
        </form>
      </div>
    </div>
  `;
}

function handleUserProfileUpdate(e) {
  e.preventDefault();
  const name = document.getElementById("userDashName").value;
  const contact = document.getElementById("userDashContact").value;
  const notes = document.getElementById("userDashNotes").value;

  if (contact.length !== 11) {
    alert("Error! Contact number must be 11 digits.");
    return;
  }

  currentUser.fullName = name;
  currentUser.contact = contact;
  currentUser.notes = notes;

  registeredUsers = registeredUsers.map(u => u.username === currentUser.username ? currentUser : u);
  saveUsers();
  localStorage.setItem("rentspace_current_user", JSON.stringify(currentUser));
  updateAuthUI();

  alert("Profile updated!");
  renderUserDashboard(document.getElementById("dynamicFeatureContent"));
}

function renderBarangayList() {
  const listEl = document.getElementById("barangayList");
  if (!listEl) return;
  listEl.innerHTML = "";
  irosinBarangays.forEach(bgy => {
    const li = document.createElement("li");
    li.innerHTML = `<span><i class="fa-solid fa-location-dot" style="color:var(--primary); margin-right:6px;"></i> ${bgy}</span>`;
    li.onclick = () => {
      document.getElementById("filterBarangay").value = bgy;
      applySearchFilter();
      showMainView();
    };
    listEl.appendChild(li);
  });
}

function filterBarangayList() {
  const query = document.getElementById("barangaySearchInput").value.toLowerCase();
  document.querySelectorAll("#barangayList li").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? "flex" : "none";
  });
}

function renderListings(data) {
  const grid = document.getElementById("listingsGrid");
  const countSpan = document.getElementById("resultsCount");
  if (!grid) return;
  grid.innerHTML = "";
  if (countSpan) countSpan.textContent = `Showing ${data.length} Available Properties`;

  if (data.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px; border:1px solid var(--border-color); color:var(--text-muted);">No accommodations found matching your criteria.</div>`;
    return;
  }

  data.forEach(p => {
    const card = document.createElement("div");
    card.className = "property-card";
    card.innerHTML = `
      <div class="card-image-wrap">
        <img src="${p.image}" alt="${p.title}" />
        <span class="badge-type">${p.type}</span>
        <span class="badge-status-pill" style="background:${p.status === 'Available' ? 'var(--success)' : '#f59e0b'};">${p.status}</span>
      </div>
      <div class="card-body">
        <div class="card-price">₱${p.price.toLocaleString()} <span>/ ${p.priceUnit}</span></div>
        <h3 class="card-title">${p.title}</h3>
        <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${p.barangay}, Irosin[cite: 1, 2]</div>
        <div class="card-footer-btns">
          <button class="btn btn-outline btn-sm" onclick="openDetailsModal(${p.id})">Details</button>
          <button class="btn btn-primary btn-sm" onclick="openAppointmentModal(${p.id})">Schedule</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applySearchFilter() {
  const bgy = document.getElementById("filterBarangay").value;
  const type = document.getElementById("filterType").value;
  const price = document.getElementById("filterPrice").value;

  const filtered = propertiesData.filter(p => {
    if (bgy !== "all" && p.barangay !== bgy) return false;
    if (type !== "all" && p.type !== type) return false;
    if (price !== "all" && p.price > parseInt(price)) return false;
    return true;
  });

  renderListings(filtered);
  showMainView();
  document.getElementById("listings").scrollIntoView({ behavior: 'smooth' });
}

function resetFilters() {
  document.getElementById("filterBarangay").value = "all";
  document.getElementById("filterType").value = "all";
  document.getElementById("filterPrice").value = "all";
  renderListings(propertiesData);
}

function runInstantSearch() {
  const q = document.getElementById("instantSearchInput").value.toLowerCase();
  const resContainer = document.getElementById("instantSearchResults");
  const matches = propertiesData.filter(p => p.title.toLowerCase().includes(q) || p.barangay.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
  resContainer.innerHTML = matches.map(p => `
    <div class="property-card">
      <div style="padding:15px;">
        <h4 style="color:var(--secondary); font-size:1rem;">${p.title} (${p.barangay})</h4>
        <p style="color:var(--primary); font-weight:bold; margin-top:4px;">₱${p.price.toLocaleString()} / ${p.priceUnit}</p>
      </div>
    </div>
  `).join('');
}

function openAuthModal(mode) {
  closeMobileMenu();
  if (mode === 'user_login') {
    switchUserAuthTab('login');
    document.getElementById("userAuthModal").classList.add("active");
  } else if (mode === 'user_register') {
    switchUserAuthTab('register');
    document.getElementById("userAuthModal").classList.add("active");
  } else {
    document.getElementById("authModal").classList.add("active");
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const u = document.getElementById("adminUser").value;
  const p = document.getElementById("adminPass").value;

  if (u === "admin" && p === "admin2026") {
    isAdminLoggedIn = true;
    closeModal('authModal');
    openFeatureForm('admin');
  } else {
    alert("Error! Invalid admin credentials");
  }
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  alert("Admin logged out successfully.");
  showMainView();
}

function renderAdminDashboard(contentEl) {
  contentEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
      <div>
        <h2><i class="fa-solid fa-user-shield"></i> Admin Security & Management Dashboard</h2>
        <p style="color:var(--text-muted); margin-top: 4px;">Authorized Admin Access Only. Full Property Inventory CRUD Management.</p>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="openAdminPropertyModal()"><i class="fa-solid fa-plus"></i> Add Property</button>
        <button class="btn btn-secondary" onclick="handleAdminLogout()"><i class="fa-solid fa-right-from-bracket"></i> Admin Logout</button>
      </div>
    </div>

    <div style="background:#fff; padding: clamp(15px, 3vw, 20px); border-radius:12px; border:1px solid var(--border-color);" class="table-responsive">
      <h3 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--secondary);">Existing Properties Inventory (${propertiesData.length})</h3>
      <table class="db-table">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid var(--border-color);">
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Barangay</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th style="text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${propertiesData.map(p => `
            <tr>
              <td style="font-weight: 600;">#${p.id}</td>
              <td><img src="${p.image}" style="width: 45px; height: 35px; object-fit: cover; border-radius: 4px;" alt=""/></td>
              <td style="font-weight: 600; color: var(--secondary);">${p.title}</td>
              <td>${p.barangay}</td>
              <td><span style="background: #f1f5f9; padding: 3px 8px; border-radius: 4px; font-size: 0.78rem;">${p.type}</span></td>
              <td style="font-weight: 700; color: var(--primary);">₱${p.price.toLocaleString()} <span style="font-size:0.75rem; color:var(--text-muted);">/${p.priceUnit}</span></td>
              <td><span class="badge-status-pill" style="position: static; display: inline-block; background: ${p.status === 'Available' ? 'var(--success)' : '#f59e0b'};">${p.status}</span></td>
              <td style="text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <button class="btn-xs" title="Edit Property" onclick="openAdminPropertyModal(${p.id})"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn-xs" title="Delete Property" style="background:#fee2e2; color:#991b1b; border-color:#fca5a5;" onclick="adminDeleteProperty(${p.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function populateAdminBarangaySelect() {
  const select = document.getElementById("adminBarangay");
  if (!select) return;
  select.innerHTML = irosinBarangays.map(b => `<option value="${b}">${b}</option>`).join('');
}

function openAdminPropertyModal(id = null) {
  if (!isAdminLoggedIn) return;
  populateAdminBarangaySelect();
  const modal = document.getElementById("adminPropertyModal");
  const form = document.getElementById("adminPropertyForm");
  const modalTitle = document.getElementById("adminModalTitle");
  
  form.reset();
  
  if (id !== null) {
    const p = propertiesData.find(item => item.id === id);
    if (!p) return;
    modalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Property (#${p.id})`;
    document.getElementById("editPropertyId").value = p.id;
    document.getElementById("adminTitle").value = p.title;
    document.getElementById("adminBarangay").value = p.barangay;
    document.getElementById("adminType").value = p.type;
    document.getElementById("adminStatus").value = p.status;
    document.getElementById("adminPrice").value = p.price;
    document.getElementById("adminPriceUnit").value = p.priceUnit;
    document.getElementById("adminContact").value = p.contact || "09170000000";
    document.getElementById("adminImage").value = p.image;
    document.getElementById("adminDescription").value = p.description;
  } else {
    modalTitle.innerHTML = `<i class="fa-solid fa-building-circle-arrow-right"></i> Add New Property`;
    document.getElementById("editPropertyId").value = "";
    document.getElementById("adminImage").value = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";
  }
  
  modal.classList.add("active");
}

function handleAdminPropertySubmit(e) {
  e.preventDefault();
  const editId = document.getElementById("editPropertyId").value;
  const title = document.getElementById("adminTitle").value;
  const barangay = document.getElementById("adminBarangay").value;
  const type = document.getElementById("adminType").value;
  const status = document.getElementById("adminStatus").value;
  const price = parseFloat(document.getElementById("adminPrice").value);
  const priceUnit = document.getElementById("adminPriceUnit").value;
  const contact = document.getElementById("adminContact").value;
  const image = document.getElementById("adminImage").value;
  const description = document.getElementById("adminDescription").value;

  if (contact.length !== 11) {
    alert("Error! Contact number must be 11 digits.");
    return;
  }

  if (editId) {
    propertiesData = propertiesData.map(p => {
      if (p.id === parseInt(editId)) {
        return {
          ...p, title, barangay, type, status, price, priceUnit, address: `${barangay}, Irosin, Sorsogon[cite: 1, 2]`, contact, image, thumbs: [image], description
        };
      }
      return p;
    });
    alert("Property listing updated!");
  } else {
    const newId = propertiesData.length > 0 ? Math.max(...propertiesData.map(p => p.id)) + 1 : 1;
    propertiesData.push({
      id: newId, title, barangay, type, price, priceUnit, address: `${barangay}, Irosin, Sorsogon[cite: 1, 2]`, status, area: "20 sqm", occupants: "2-4 Guests", amenities: ["WiFi"], description, image, thumbs: [image], contact
    });
    alert("New property added!");
  }

  saveProperties();
  renderListings(propertiesData);
  closeModal('adminPropertyModal');
  openFeatureForm('admin');
}

function adminDeleteProperty(id) {
  if (!isAdminLoggedIn) return;
  if (confirm("Are you sure you want to delete this property listing?")) {
    propertiesData = propertiesData.filter(p => p.id !== id);
    saveProperties();
    renderListings(propertiesData);
    openFeatureForm('admin');
    alert("Property deleted.");
  }
}

function openDetailsModal(id) {
  const p = propertiesData.find(item => item.id === id);
  if (!p) return;
  document.getElementById("modalDetailsBody").innerHTML = `
    <h2>${p.title}</h2>
    <p style="color:var(--text-muted); margin-top:4px;"><i class="fa-solid fa-location-dot"></i> ${p.address}</p>
    <h3 style="color:var(--primary); margin:12px 0;">₱${p.price.toLocaleString()} / ${p.priceUnit}</h3>
    <p style="font-size:0.95rem; color:var(--text-main); line-height:1.6;">${p.description}</p>
  `;
  document.getElementById("detailsModal").classList.add("active");
}

function openAppointmentModal(id) {
  closeMobileMenu();
  const p = propertiesData.find(item => item.id === id);
  if (p) {
    document.getElementById("appointPropertyName").textContent = p.title;
  }
  document.getElementById("appointmentModal").classList.add("active");
}

function openCompareModal() {
  closeMobileMenu();
  const container = document.getElementById("compareTableContainer");
  
  if (propertiesData.length === 0) {
    container.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-muted);">No properties available to compare.</p>`;
  } else {
    container.innerHTML = `
      <table class="db-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Barangay</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${propertiesData.map(p => `
            <tr>
              <td><strong>${p.title}</strong></td>
              <td>${p.type}</td>
              <td>${p.barangay}</td>
              <td style="color: var(--primary); font-weight: bold;">₱${p.price.toLocaleString()} / ${p.priceUnit}</td>
              <td><span class="badge-status-pill success" style="position: static; display: inline-block;">${p.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  document.getElementById("compareModal").classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

function handleAppointmentSubmit(e) {
  e.preventDefault();
  const contact = document.getElementById("appointContact") ? document.getElementById("appointContact").value : "";
  if (contact && contact.length !== 11) {
    alert("Error! Contact number must be 11 digits.");
    return;
  }
  alert("Viewing appointment requested!");
  closeModal('appointmentModal');
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  const icon = btnEl.querySelector("i");
  if (!input || !icon) return;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}