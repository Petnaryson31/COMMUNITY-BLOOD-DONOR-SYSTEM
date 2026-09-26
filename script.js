/* =========================================================
   COMMUNITY BLOOD DONOR MANAGEMENT SYSTEM
   JAVASCRIPT
========================================================= */


/* =========================================================
   DATABASE USING LOCAL STORAGE
========================================================= */

let accounts = JSON.parse(
    localStorage.getItem("bloodDonorAccounts")
) || [];

let currentUser = JSON.parse(
    localStorage.getItem("currentBloodUser")
) || null;


/* =========================================================
   PAGE START
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeSystem();

    document
        .getElementById("loginForm")
        .addEventListener("submit", loginUser);

    document
        .getElementById("registerForm")
        .addEventListener("submit", registerUser);

    document
        .getElementById("registerRole")
        .addEventListener("change", showDonorFields);

});


/* =========================================================
   INITIALIZE
========================================================= */

function initializeSystem() {

    if (currentUser) {
        openApplication(currentUser);
    } else {
        showLogin();
    }

}


/* =========================================================
   LOGIN / REGISTER PAGE
========================================================= */

function showLogin() {

    document
        .getElementById("loginSection")
        .classList.remove("hidden");

    document
        .getElementById("registerSection")
        .classList.add("hidden");

}


function showRegister() {

    document
        .getElementById("loginSection")
        .classList.add("hidden");

    document
        .getElementById("registerSection")
        .classList.remove("hidden");

}


function showDonorFields() {

    const role =
        document.getElementById("registerRole").value;

    const fields =
        document.getElementById("donorRegisterFields");

    if (role === "donor") {

        fields.classList.remove("hidden");

    } else {

        fields.classList.add("hidden");

    }

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

function registerUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const role =
        document.getElementById("registerRole").value;


    if (!name || !email || !password || !role) {

        showRegisterMessage(
            "Please complete all required fields.",
            "error"
        );

        return;
    }


    /* CHECK EXISTING EMAIL */

    const existingAccount = accounts.find(
        account => account.email === email
    );

    if (existingAccount) {

        showRegisterMessage(
            "An account with this email already exists.",
            "error"
        );

        return;
    }


    /* CREATE ACCOUNT */

    const newAccount = {

        id:
            "USR-" +
            String(accounts.length + 1).padStart(3, "0"),

        name: name,

        email: email,

        password: password,

        role: role,

        status: "Active",

        availability: role === "donor"
            ? "Available"
            : "N/A",

        bloodType:
            role === "donor"
                ? document.getElementById("registerBlood").value
                : "N/A",

        phone:
            role === "donor"
                ? document.getElementById("registerPhone").value
                : "N/A",

        address:
            role === "donor"
                ? document.getElementById("registerAddress").value
                : "N/A",

        createdAt:
            new Date().toLocaleDateString()

    };


    accounts.push(newAccount);


    localStorage.setItem(
        "bloodDonorAccounts",
        JSON.stringify(accounts)
    );


    showRegisterMessage(
        "Account successfully created! You can now sign in.",
        "success"
    );


    document
        .getElementById("registerForm")
        .reset();

    document
        .getElementById("donorRegisterFields")
        .classList.add("hidden");

}


/* =========================================================
   LOGIN
========================================================= */

function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("loginPassword")
        .value;


    const account = accounts.find(
        user =>
            user.email === email &&
            user.password === password
    );


    if (!account) {

        showLoginMessage(
            "Incorrect email or password. Please create an account first or check your information.",
            "error"
        );

        return;
    }


    /* SAVE CURRENT USER */

    currentUser = account;

    localStorage.setItem(
        "currentBloodUser",
        JSON.stringify(account)
    );


    openApplication(account);

}


/* =========================================================
   OPEN APPLICATION
========================================================= */

function openApplication(user) {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("appPage")
        .classList.remove("hidden");


    document
        .getElementById("headerUserName")
        .textContent = user.name;


    document
        .getElementById("headerUserRole")
        .textContent =
            user.role === "admin"
                ? "City Health Worker / Admin"
                : "Blood Donor / Volunteer";


    /* HIDE BOTH MENUS FIRST */

    document
        .getElementById("adminMenu")
        .classList.add("hidden");

    document
        .getElementById("donorMenu")
        .classList.add("hidden");


    /* ADMIN */

    if (user.role === "admin") {

        document
            .getElementById("adminMenu")
            .classList.remove("hidden");

        showView(
            "adminDashboard",
            document.querySelector(
                "#adminMenu li"
            )
        );

        updateAdminDashboard();

    }


    /* DONOR */

    else if (user.role === "donor") {

        document
            .getElementById("donorMenu")
            .classList.remove("hidden");

        showView(
            "donorDashboard",
            document.querySelector(
                "#donorMenu li"
            )
        );

        updateDonorDashboard();

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem("currentBloodUser");

    currentUser = null;

    document
        .getElementById("appPage")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("loginForm")
        .reset();

    showLogin();

}


/* =========================================================
   DASHBOARD NAVIGATION
========================================================= */

function showView(viewId, clickedItem) {

    /* SECURITY CHECK */

    const adminViews = [
        "adminDashboard",
        "donorManagement",
        "bloodRequests",
        "emergencyMatching",
        "reports",
        "userAccounts"
    ];

    const donorViews = [
        "donorDashboard",
        "myProfile",
        "availability",
        "donorRequests",
        "notifications"
    ];


    if (!currentUser) {
        return;
    }


    /* PREVENT DONOR FROM ACCESSING ADMIN */

    if (
        currentUser.role === "donor" &&
        adminViews.includes(viewId)
    ) {

        alert(
            "Access denied. This information is confidential and only available to City Health Workers."
        );

        return;
    }


    /* PREVENT ADMIN FROM ACCESSING DONOR MENU */

    if (
        currentUser.role === "admin" &&
        donorViews.includes(viewId)
    ) {

        alert(
            "This page is intended for blood donor accounts."
        );

        return;
    }


    /* HIDE ALL VIEWS */

    document
        .querySelectorAll(".view")
        .forEach(view => {
            view.classList.add("hidden");
        });


    /* SHOW SELECTED VIEW */

    const selectedView =
        document.getElementById(viewId);

    if (selectedView) {
        selectedView.classList.remove("hidden");
    }


    /* UPDATE ACTIVE MENU */

    document
        .querySelectorAll(".sidebar-nav li")
        .forEach(item => {
            item.classList.remove("active");
        });


    if (clickedItem) {
        clickedItem.classList.add("active");
    }


    /* LOAD DATA */

    if (viewId === "donorManagement") {
        loadDonorTable();
    }

    if (viewId === "userAccounts") {
        loadAccountTable();
    }

    if (viewId === "myProfile") {
        updateProfile();
    }

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function updateAdminDashboard() {

    const donors =
        accounts.filter(
            account => account.role === "donor"
        );


    const available =
        donors.filter(
            donor => donor.availability === "Available"
        );


    document
        .getElementById("totalDonors")
        .textContent = donors.length;


    document
        .getElementById("availableDonors")
        .textContent = available.length;

}


/* =========================================================
   DONOR TABLE
   CONFIDENTIAL ADMIN INFORMATION
========================================================= */

function loadDonorTable() {

    if (!currentUser || currentUser.role !== "admin") {
        return;
    }


    const donors =
        accounts.filter(
            account => account.role === "donor"
        );


    const table =
        document.getElementById("donorTableBody");


    table.innerHTML = "";


    if (donors.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No blood donors have registered yet.
                </td>
            </tr>
        `;

        return;
    }


    donors.forEach(donor => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${donor.id}
            </td>

            <td>
                ${escapeHTML(donor.name)}
            </td>

            <td>
                <span class="blood-type-tag">
                    ${donor.bloodType || "—"}
                </span>
            </td>

            <td>
                ${escapeHTML(donor.phone || "—")}
            </td>

            <td>
                ${donor.availability || "—"}
            </td>

            <td>
                <span class="status-pill verified">
                    ${donor.status}
                </span>
            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================================
   ACCOUNT TABLE
========================================================= */

function loadAccountTable() {

    if (!currentUser || currentUser.role !== "admin") {
        return;
    }


    const table =
        document.getElementById("accountTableBody");


    table.innerHTML = "";


    accounts.forEach(account => {

        const row =
            document.createElement("tr");


        const roleName =
            account.role === "admin"
                ? "City Health Worker / Admin"
                : "Blood Donor / Volunteer";


        row.innerHTML = `

            <td>
                ${account.id}
            </td>

            <td>
                ${escapeHTML(account.name)}
            </td>

            <td>
                ${escapeHTML(account.email)}
            </td>

            <td>
                ${roleName}
            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================================
   DONOR DASHBOARD
========================================================= */

function updateDonorDashboard() {

    if (!currentUser) {
        return;
    }


    document
        .getElementById("donorWelcomeName")
        .textContent = currentUser.name;


    document
        .getElementById("donorBloodDisplay")
        .textContent =
            currentUser.bloodType || "—";


    document
        .getElementById("donorAvailabilityDisplay")
        .textContent =
            currentUser.availability || "Available";


    updateProfile();

    updateAvailabilityUI();

}


/* =========================================================
   PROFILE
========================================================= */

function updateProfile() {

    if (!currentUser) {
        return;
    }


    document
        .getElementById("profileName")
        .textContent = currentUser.name;


    document
        .getElementById("profileEmail")
        .textContent = currentUser.email;


    document
        .getElementById("profileBlood")
        .textContent =
            currentUser.bloodType || "—";


    document
        .getElementById("profilePhone")
        .textContent =
            currentUser.phone || "—";


    document
        .getElementById("profileAddress")
        .textContent =
            currentUser.address || "—";

}


/* =========================================================
   DONOR AVAILABILITY
========================================================= */

function toggleAvailability() {

    if (!currentUser || currentUser.role !== "donor") {
        return;
    }


    const newStatus =
        currentUser.availability === "Available"
            ? "Unavailable"
            : "Available";


    currentUser.availability = newStatus;


    /* UPDATE ACCOUNT DATABASE */

    accounts =
        accounts.map(account => {

            if (account.id === currentUser.id) {
                return currentUser;
            }

            return account;

        });


    localStorage.setItem(
        "bloodDonorAccounts",
        JSON.stringify(accounts)
    );


    localStorage.setItem(
        "currentBloodUser",
        JSON.stringify(currentUser)
    );


    updateAvailabilityUI();

    updateDonorDashboard();

}


function updateAvailabilityUI() {

    if (!currentUser) {
        return;
    }


    const statusText =
        document.getElementById(
            "availabilityStatusText"
        );

    const button =
        document.getElementById(
            "availabilityButton"
        );


    if (currentUser.availability === "Available") {

        statusText.textContent = "Available";

        button.textContent = "Set Unavailable";

        button.className = "btn-toggle-on";

    } else {

        statusText.textContent = "Unavailable";

        button.textContent = "Set Available";

        button.className = "btn-toggle-off";

    }

}


/* =========================================================
   EMERGENCY MATCHING ALGORITHM
========================================================= */

function runMatching() {

    if (!currentUser || currentUser.role !== "admin") {

        alert(
            "Only City Health Workers can use the emergency matching function."
        );

        return;
    }


    const requiredBlood =
        document.getElementById("matchBlood").value;


    const location =
        document.getElementById("matchLocation").value
        .trim()
        .toLowerCase();


    const donors =
        accounts.filter(
            donor =>
                donor.role === "donor" &&
                donor.availability === "Available"
        );


    /*
       BASIC MATCHING ALGORITHM

       1. Donor must be registered.
       2. Donor must be available.
       3. Blood type should match.
       4. Location can be considered when available.
    */


    const matches =
        donors.filter(
            donor =>
                donor.bloodType === requiredBlood
        );


    const results =
        document.getElementById(
            "matchingResults"
        );


    results.innerHTML = "";


    if (matches.length === 0) {

        results.innerHTML = `
            <div class="notice notice-warning">

                <span>!</span>

                <div>
                    <strong>
                        No matching donor found.
                    </strong>

                    <small>
                        No currently available donor
                        matches blood type ${requiredBlood}.
                    </small>
                </div>

            </div>
        `;

        return;
    }


    matches.forEach((donor, index) => {

        const result =
            document.createElement("div");


        result.className = "match-result";


        result.innerHTML = `

            <div>

                <h4>
                    ${escapeHTML(donor.name)}
                </h4>

                <p>
                    Blood Type:
                    <strong>
                        ${donor.bloodType}
                    </strong>
                    |
                    Location:
                    ${escapeHTML(donor.address || "Not provided")}
                </p>

            </div>

            <div class="match-score">
                MATCH #${index + 1}
            </div>

        `;


        results.appendChild(result);

    });

}


/* =========================================================
   REPORTS
========================================================= */

function generateDonorReport() {

    if (!isAdmin()) return;


    const donors =
        accounts.filter(
            account => account.role === "donor"
        );


    const available =
        donors.filter(
            donor =>
                donor.availability === "Available"
        );


    document
        .getElementById("reportOutput")
        .innerHTML = `

            <h4>Donor Report</h4>

            <p>
                Total registered donors:
                <strong>${donors.length}</strong>
            </p>

            <p>
                Currently available:
                <strong>${available.length}</strong>
            </p>

        `;

}


function generateBloodReport() {

    if (!isAdmin()) return;


    const donors =
        accounts.filter(
            account => account.role === "donor"
        );


    const bloodTypes = {};


    donors.forEach(donor => {

        const type =
            donor.bloodType || "Unknown";

        bloodTypes[type] =
            (bloodTypes[type] || 0) + 1;

    });


    let output = "";

    Object.keys(bloodTypes).forEach(type => {

        output += `
            <p>
                <strong>${type}</strong>:
                ${bloodTypes[type]} donor(s)
            </p>
        `;

    });


    document
        .getElementById("reportOutput")
        .innerHTML = `

            <h4>Blood Type Report</h4>

            ${
                output ||
                "<p>No donor data available.</p>"
            }

        `;

}


function generateAvailabilityReport() {

    if (!isAdmin()) return;


    const donors =
        accounts.filter(
            account => account.role === "donor"
        );


    const available =
        donors.filter(
            donor =>
                donor.availability === "Available"
        ).length;


    const unavailable =
        donors.length - available;


    document
        .getElementById("reportOutput")
        .innerHTML = `

            <h4>Availability Report</h4>

            <p>
                Available:
                <strong>${available}</strong>
            </p>

            <p>
                Unavailable:
                <strong>${unavailable}</strong>
            </p>

        `;

}


/* =========================================================
   CREATE REQUEST
========================================================= */

function createRequest() {

    if (!isAdmin()) return;


    alert(
        "New Blood Request function is ready for database integration."
    );

}


/* =========================================================
   SECURITY HELPER
========================================================= */

function isAdmin() {

    if (!currentUser || currentUser.role !== "admin") {

        alert(
            "Access denied. Only City Health Workers can access this section."
        );

        return false;
    }

    return true;
}


/* =========================================================
   MESSAGE FUNCTIONS
========================================================= */

function showLoginMessage(message, type) {

    const box =
        document.getElementById("loginMessage");


    box.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;

}


function showRegisterMessage(message, type) {

    const box =
        document.getElementById("registerMessage");


    box.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHTML(value) {

    if (!value) {
        return "";
    }


    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}