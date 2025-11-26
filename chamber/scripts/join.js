// Auto-fill timestamp
const lastModifiedEl = document.getElementById("last-modified");
const modifiedDate = new Date(document.lastModified);
lastModifiedEl.setAttribute("datetime", modifiedDate.toISOString());
lastModifiedEl.textContent = modifiedDate.toLocaleString();
document.getElementById("timestamp").value = new Date().toISOString();

// Modal logic
const modals = document.querySelectorAll(".modal");
const openButtons = document.querySelectorAll(".benefits-btn");
const closeButtons = document.querySelectorAll(".close");

openButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = document.getElementById(btn.dataset.modal);
        modal.style.display = "block";
    });
});

closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.parentElement.parentElement.style.display = "none";
    });
});

window.onclick = event => {
    modals.forEach(modal => {
        if (event.target === modal) modal.style.display = "none";
    });
};
