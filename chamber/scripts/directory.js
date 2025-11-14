// MOBILE NAV
const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});

// FOOTER INFO
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = document.lastModified;

// DIRECTORY LOGIC
const directory = document.getElementById("directory");
const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");

async function loadMembers() {
    const response = await fetch("data/members.json");
    const members = await response.json();
    displayGrid(members);
}

function displayGrid(data) {
    directory.className = "grid";
    directory.innerHTML = data.map(member => `
        <div class="card">
            <img src="images/${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank">${member.website}</a>
        </div>
    `).join("");
}

function displayList(data) {
    directory.className = "list";
    directory.innerHTML = data.map(member => `
        <div class="list-item">
            <span>${member.name}</span>
            <span>${member.phone}</span>
            <span>${member.membership === 3 ? "Gold" : member.membership === 2 ? "Silver" : "Member"}</span>
        </div>
    `).join("");
}

gridBtn.addEventListener("click", loadMembers);
listBtn.addEventListener("click", async () => {
    const response = await fetch("data/members.json");
    const members = await response.json();
    displayList(members);
});

// Load default grid view
loadMembers();
