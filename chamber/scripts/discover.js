// scripts/discover.js
import { places } from '../data/places.mjs';

const grid = document.getElementById('cards-grid');
const visitText = document.getElementById('visit-text');
const visitMsg = document.getElementById('visit-message');
const closeBtn = document.getElementById('close-msg');

if (!grid) throw new Error('Cards grid not found');

// --- build cards from JSON data ---
places.forEach((p, idx) => {
  const card = document.createElement('article');
  card.className = 'card';
  // Assign grid area name dynamically: card1..card8
  const areaName = `card${idx + 1}`;
  card.style.gridArea = areaName;
  card.setAttribute('aria-labelledby', `title-${p.id}`);

  // accessible figure with img (lazy)
  card.innerHTML = `
    <h2 id="title-${p.id}">${p.title}</h2>
    <figure>
      <img src="${p.image}" alt="${p.title} photo" width="300" height="200" loading="lazy">
      <figcaption class="visually-hidden">${p.title} image</figcaption>
    </figure>
    <address>${p.address}</address>
    <p>${p.description}</p>
    <button class="learn-btn" aria-label="Learn more about ${p.title}">Learn more</button>
  `;

  grid.appendChild(card);
});

// --- Named grid area CSS fallback (in case CSS needs)
grid.classList.add('has-cards');

// --- localStorage last visit message ---
function showVisitMessage() {
  const KEY = 'chamber-last-visit';
  const now = Date.now();
  const last = Number(localStorage.getItem(KEY)) || null;

  if (!last) {
    // first visit
    visitText.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.floor((now - last) / msPerDay);

    if (days < 1) {
      visitText.textContent = "Back so soon! Awesome!";
    } else if (days === 1) {
      visitText.textContent = "You last visited 1 day ago.";
    } else {
      visitText.textContent = `You last visited ${days} days ago.`;
    }
  }

  // update stored time
  localStorage.setItem(KEY, String(now));
}

// close button for message
closeBtn.addEventListener('click', () => {
  visitMsg.style.display = 'none';
});

// show the message
showVisitMessage();


/* Footer info (year and last-modified with valid datetime) */
document.getElementById('year').textContent = new Date().getFullYear();
(function setLastModified(){
  const lastModEl = document.getElementById('last-modified');
  const d = new Date(document.lastModified || Date.now());
  lastModEl.textContent = d.toLocaleString();
  lastModEl.setAttribute('datetime', d.toISOString());
})();