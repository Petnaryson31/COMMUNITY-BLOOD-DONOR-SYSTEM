/* ============================================================
   COMMUNITY BLOOD DONOR MANAGEMENT SYSTEM
   JavaScript
   ============================================================ */


/* ============================================================
   SAMPLE DATA
   ============================================================ */

let donors = JSON.parse(localStorage.getItem("bloodDonors")) || [
    {
        id: "D-001",
        name: "Juan Dela Cruz",
        bloodType: "O+",
        location: "Barangay Labangal",
        contact: "09123456789",
        status: "Available"
    },
    {
        id: "D-002",
        name: "Maria Santos",
        bloodType: "A+",
        location: "Barangay Calumpang",
        contact: "09234567890",
        status: "Available"
    },
    {
        id: "D-003",
        name: "Mark Reyes",
        bloodType: "B+",
        location: "Barangay Lagao",
        contact: "09345678901",
        status: "Unavailable"
    }
];


let requests = JSON.parse(localStorage.getItem("bloodRequests")) || [
    {
        id: "REQ-001",
        patient: "Sample Patient",
        bloodType: "O+",
        hospital: "Community Health Center",
        units: 2,
        urgency: "Emergency",
        status: "Pending"
    }
];


let activities = JSON.parse(localStorage.getItem("activities")) || [];


/* ============================================================
   PAGE ELEMENTS
   ============================================================ */

const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const donorForm = document.getElementById("donorForm");
const requestForm = document.getElementById("requestForm");

const donorTableBody = document.getElementById("donorTableBody");
const requestTableBody = document.getElementById("requestTableBody");

const donorSearch = document.getElementById("donorSearch");

const notification = document.getElementById("notification");
const notificationMessage =
    document.getElementById("notificationMessage");


/* ============================================================
   LOGIN
   ============================================================ */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();


    /*
       Demo login:
       Username: admin
       Password: admin123
    */

    if (username === "admin" && password === "admin123") {

        sessionStorage.setItem("loggedIn", "true");

        loginPage.style.display = "none";

        app.classList.remove("app-hidden");

        initializeSystem();

        showNotification("Welcome back, Administrator.");

    } else {

        showNotification(
            "Invalid username or password. Use admin / admin123."
        );

    }

});


/* ============================================================
   LOGOUT
   ============================================================ */

logoutBtn.addEventListener("click", function () {

    sessionStorage.removeItem("loggedIn");

    app.classList.add("app-hidden");

    loginPage.style.display = "flex";

    document.getElementById("loginPassword").value = "";

    showNotification("You have been logged out.");

});


/* ============================================================
   CHECK LOGIN WHEN PAGE LOADS
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    if (sessionStorage.getItem("loggedIn") === "true") {

        loginPage.style.display = "none";

        app.classList.remove("app-hidden");

        initializeSystem();

    }

});


/* ============================================================
   INITIALIZE SYSTEM
   ============================================================ */

function initializeSystem() {

    updateDashboard();

    renderDonors();

    renderRequests();

    renderActivities();

    updateDate();

}


/* ============================================================
   SIDEBAR NAVIGATION
   ============================================================ */

document.querySelectorAll(".nav-item").forEach(function (item) {

    item.addEventListener("click", function () {

        const targetView = item.dataset.view;

        showView(targetView);

    });

});


/* ============================================================
   SHOW VIEW
   ============================================================ */

function showView(viewName) {

    document.querySelectorAll(".view").forEach(function (view) {

        view.classList.remove("active-view");

    });


    const selectedView =
        document.getElementById("view" + capitalize(viewName));


    if (selectedView) {

        selectedView.classList.add("active-view");

    }


    document.querySelectorAll(".nav-item").forEach(function (item) {

        item.classList.remove("active");

    });


    const activeNav =
        document.querySelector(
            `.nav-item[data-view="${viewName}"]`
        );


    if (activeNav) {

        activeNav.classList.add("active");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   QUICK ACTION NAVIGATION
   ============================================================ */

document.querySelectorAll("[data-view-target]").forEach(function (button) {

    button.addEventListener("click", function () {

        showView(button.dataset.viewTarget);

    });

});


/* ============================================================
   OPEN MODALS
   ============================================================ */

document.querySelectorAll("[data-open]").forEach(function (button) {

    button.addEventListener("click", function () {

        const modalId = button.dataset.open;

        openModal(modalId);

    });

});


/* ============================================================
   CLOSE MODALS
   ============================================================ */

document.querySelectorAll("[data-close]").forEach(function (button) {

    button.addEventListener("click", function () {

        const modalId = button.dataset.close;

        closeModal(modalId);

    });

});


/* ============================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ============================================================ */

document.querySelectorAll(".modal").forEach(function (modal) {

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {

            modal.classList.remove("show");

        }

    });

});


function openModal(id) {

    const modal = document.getElementById(id);

    if (modal) {

        modal.classList.add("show");

    }

}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {

        modal.classList.remove("show");

    }

}


/* ============================================================
   REGISTER DONOR
   ============================================================ */

donorForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const donor = {

        id: generateDonorId(),

        name:
            document.getElementById("donorName").value.trim(),

        bloodType:
            document.getElementById("donorBloodType").value,

        location:
            document.getElementById("donorLocation").value.trim(),

        contact:
            document.getElementById("donorContact").value.trim(),

        status:
            document.getElementById("donorStatus").value

    };


    donors.push(donor);


    saveData();

    renderDonors();

    updateDashboard();


    addActivity(
        `New donor registered: ${donor.name} (${donor.bloodType})`
    );


    donorForm.reset();

    closeModal("donorModal");


    showNotification(
        "Donor registered successfully."
    );

});


/* ============================================================
   GENERATE DONOR ID
   ============================================================ */

function generateDonorId() {

    return "D-" +
        String(donors.length + 1).padStart(3, "0");

}


/* ============================================================
   RENDER DONORS
   ============================================================ */

function renderDonors(searchTerm = "") {

    donorTableBody.innerHTML = "";


    const filteredDonors = donors.filter(function (donor) {

        const search =
            searchTerm.toLowerCase();

        return (
            donor.name.toLowerCase().includes(search) ||
            donor.bloodType.toLowerCase().includes(search) ||
            donor.location.toLowerCase().includes(search) ||
            donor.id.toLowerCase().includes(search)
        );

    });


    if (filteredDonors.length === 0) {

        donorTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-row">
                    No donors found.
                </td>
            </tr>
        `;

        return;

    }


    filteredDonors.forEach(function (donor) {

        const row = document.createElement("tr");


        const statusClass =
            donor.status === "Available"
                ? "active"
                : "inactive";


        row.innerHTML = `

            <td>${donor.id}</td>

            <td>
                <strong>${escapeHTML(donor.name)}</strong>
            </td>

            <td>
                <span class="blood-type-tag">
                    ${donor.bloodType}
                </span>
            </td>

            <td>
                ${escapeHTML(donor.location)}
            </td>

            <td>
                ${escapeHTML(donor.contact)}
            </td>

            <td>
                <span class="status-pill ${statusClass}">
                    ${donor.status}
                </span>
            </td>

            <td>

                <button
                    class="table-btn ${donor.status === "Available" ? "delete" : "match"}"
                    onclick="toggleDonorStatus('${donor.id}')"
                >
                    ${donor.status === "Available"
                        ? "Disable"
                        : "Activate"}
                </button>

            </td>

        `;


        donorTableBody.appendChild(row);

    });

}


/* ============================================================
   SEARCH DONORS
   ============================================================ */

donorSearch.addEventListener("input", function () {

    renderDonors(donorSearch.value);

});


/* ============================================================
   TOGGLE DONOR STATUS
   ============================================================ */

function toggleDonorStatus(id) {

    const donor = donors.find(function (item) {

        return item.id === id;

    });


    if (!donor) {
        return;
    }


    if (donor.status === "Available") {

        donor.status = "Unavailable";

    } else {

        donor.status = "Available";

    }


    saveData();

    renderDonors();

    updateDashboard();


    addActivity(
        `${donor.name} is now ${donor.status}.`
    );


    showNotification(
        `Donor status updated to ${donor.status}.`
    );

}


/* ============================================================
   CREATE BLOOD REQUEST
   ============================================================ */

requestForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const request = {

        id: generateRequestId(),

        patient:
            document.getElementById("patientName").value.trim(),

        bloodType:
            document.getElementById("requestBloodType").value,

        hospital:
            document.getElementById("hospitalName").value.trim(),

        units:
            Number(
                document.getElementById("requestUnits").value
            ),

        urgency:
            document.getElementById("requestUrgency").value,

        status: "Pending"

    };


    requests.push(request);


    saveData();

    renderRequests();

    updateDashboard();


    addActivity(
        `Blood request created for ${request.patient} (${request.bloodType}).`
    );


    requestForm.reset();

    closeModal("requestModal");


    showNotification(
        "Blood request created successfully."
    );

});


/* ============================================================
   GENERATE REQUEST ID
   ============================================================ */

function generateRequestId() {

    return "REQ-" +
        String(requests.length + 1).padStart(3, "0");

}


/* ============================================================
   RENDER REQUESTS
   ============================================================ */

function renderRequests() {

    requestTableBody.innerHTML = "";


    if (requests.length === 0) {

        requestTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-row">
                    No blood requests recorded.
                </td>
            </tr>
        `;

        return;

    }


    requests.forEach(function (request) {

        const row = document.createElement("tr");


        let urgencyClass = "pending";


        if (request.urgency === "Emergency") {

            urgencyClass = "emergency";

        }


        row.innerHTML = `

            <td>${request.id}</td>

            <td>
                <strong>
                    ${escapeHTML(request.patient)}
                </strong>
            </td>

            <td>
                <span class="blood-type-tag">
                    ${request.bloodType}
                </span>
            </td>

            <td>
                ${escapeHTML(request.hospital)}
            </td>

            <td>
                ${request.units}
            </td>

            <td>
                <span class="status-pill ${urgencyClass}">
                    ${request.urgency}
                </span>
            </td>

            <td>
                <span class="status-pill pending">
                    ${request.status}
                </span>
            </td>

            <td>

                <button
                    class="table-btn match"
                    onclick="matchRequest('${request.id}')"
                >
                    Find Donors
                </button>

            </td>

        `;


        requestTableBody.appendChild(row);

    });

}


/* ============================================================
   MATCH REQUEST
   ============================================================ */

function matchRequest(requestId) {

    const request = requests.find(function (item) {

        return item.id === requestId;

    });


    if (!request) {
        return;
    }


    showView("matching");


    document.getElementById(
        "matchingBloodType"
    ).value = request.bloodType;


    findMatchingDonors();


    addActivity(
        `Matching search performed for request ${request.id}.`
    );

}


/* ============================================================
   DONOR MATCHING ALGORITHM
   ============================================================ */

document.getElementById("findMatchesBtn")
    .addEventListener("click", findMatchingDonors);


function findMatchingDonors() {

    const bloodType =
        document.getElementById(
            "matchingBloodType"
        ).value;


    const location =
        document.getElementById(
            "matchingLocation"
        ).value.trim().toLowerCase();


    const results =
        document.getElementById("matchingResults");


    if (!bloodType) {

        results.innerHTML = `
            <div class="empty-state">
                <span>!</span>
                <p>
                    Please select a required blood type.
                </p>
            </div>
        `;

        return;

    }


    /*
       BASIC MATCHING ALGORITHM

       1. Blood type must match.
       2. Donor must be available.
       3. If location is provided,
          location is also checked.
    */

    let matches = donors.filter(function (donor) {

        const bloodMatch =
            donor.bloodType === bloodType;

        const available =
            donor.status === "Available";

        const locationMatch =
            !location ||
            donor.location.toLowerCase()
                .includes(location);


        return (
            bloodMatch &&
            available &&
            locationMatch
        );

    });


    /*
       If no location-specific match is found,
       show available blood-type matches.
    */

    if (matches.length === 0 && location) {

        matches = donors.filter(function (donor) {

            return (
                donor.bloodType === bloodType &&
                donor.status === "Available"
            );

        });

    }


    if (matches.length === 0) {

        results.innerHTML = `
            <div class="empty-state">
                <span>○</span>
                <p>
                    No available donors match
                    blood type ${bloodType}.
                </p>
            </div>
        `;

        return;

    }


    results.innerHTML = `

        <div class="notice-box">

            <strong>
                ${matches.length}
                matching donor(s) found
            </strong>

            <span>
                Required blood type:
                ${bloodType}
            </span>

        </div>

        <div class="matching-list">

            ${matches.map(function (donor) {

                return `

                    <div class="matching-card">

                        <div class="matching-main">

                            <span class="matching-blood">
                                ${donor.bloodType}
                            </span>

                            <div>

                                <strong>
                                    ${escapeHTML(donor.name)}
                                </strong>

                                <small>
                                    ${escapeHTML(donor.location)}
                                    ·
                                    ${escapeHTML(donor.contact)}
                                </small>

                            </div>

                        </div>

                        <span class="status-pill active">
                            Available
                        </span>

                    </div>

                `;

            }).join("")}

        </div>

    `;

}


/* ============================================================
   UPDATE DASHBOARD
   ============================================================ */

function updateDashboard() {

    const total =
        donors.length;


    const available =
        donors.filter(function (donor) {

            return donor.status === "Available";

        }).length;


    const pending =
        requests.filter(function (request) {

            return request.status === "Pending";

        }).length;


    const totalRequests =
        requests.length;


    document.getElementById("totalDonors")
        .textContent = total;

    document.getElementById("availableDonors")
        .textContent = available;

    document.getElementById("pendingRequests")
        .textContent = pending;

    document.getElementById("totalRequests")
        .textContent = totalRequests;


    document.getElementById("reportDonors")
        .textContent = total;

    document.getElementById("reportAvailable")
        .textContent = available;

    document.getElementById("reportRequests")
        .textContent = totalRequests;

    document.getElementById("reportPending")
        .textContent = pending;

}


/* ============================================================
   ACTIVITY
   ============================================================ */

function addActivity(message) {

    activities.unshift({

        message: message,

        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })

    });


    /*
       Keep only the latest 8 activities.
    */

    activities =
        activities.slice(0, 8);


    localStorage.setItem(
        "activities",
        JSON.stringify(activities)
    );


    renderActivities();

}


function renderActivities() {

    const container =
        document.getElementById("recentActivity");


    if (activities.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <span>○</span>
                <p>No recent activity.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        activities.map(function (activity) {

            return `

                <div class="activity-item">

                    <div class="activity-icon">
                        ✓
                    </div>

                    <div class="activity-text">
                        ${escapeHTML(activity.message)}
                    </div>

                    <div class="activity-time">
                        ${activity.time}
                    </div>

                </div>

            `;

        }).join("");

}


/* ============================================================
   DATE
   ============================================================ */

function updateDate() {

    const date =
        new Date();


    document.getElementById(
        "currentDate"
    ).textContent =
        date.toLocaleDateString(
            "en-PH",
            {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

}


/* ============================================================
   SAVE DATA
   ============================================================ */

function saveData() {

    localStorage.setItem(
        "bloodDonors",
        JSON.stringify(donors)
    );


    localStorage.setItem(
        "bloodRequests",
        JSON.stringify(requests)
    );

}


/* ============================================================
   NOTIFICATION
   ============================================================ */

function showNotification(message) {

    notificationMessage.textContent =
        message;


    notification.classList.add("show");


    setTimeout(function () {

        notification.classList.remove("show");

    }, 3000);

}


/* ============================================================
   CAPITALIZE
   ============================================================ */

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


/* ============================================================
   SECURITY HELPER
   ============================================================ */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ============================================================
   KEYBOARD: ESC CLOSE MODAL
   ============================================================ */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        document.querySelectorAll(".modal").forEach(function (modal) {

            modal.classList.remove("show");

        });

    }

});