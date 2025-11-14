// FOOTER INFO
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = document.lastModified;

// scripts/directory.js (ES module)
const menuBtn = document.getElementById('menu-btn');
const navList = document.getElementById('nav-list');

menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  navList.style.display = expanded ? 'none' : 'block';
});

/* footer info */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified || 'Unknown';

/* view buttons */
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');
const directoryEl = document.getElementById('directory');

async function fetchMembers() {
  try {
    const res = await fetch('data/members.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to fetch members.json');
    return await res.json();
  } catch (err) {
    console.error(err);
    directoryEl.innerHTML = '<p>Error loading members.</p>';
    return [];
  }
}

function renderGrid(members) {
  directoryEl.className = 'directory grid';
  directoryEl.innerHTML = members.map(m => `
    <article class="card" aria-label="${m.name}">
      <img src="images/${m.image}" alt="${m.name} logo" loading="lazy">
      <h3>${m.name}</h3>
      <p>${m.address}</p>
      <p>${m.phone}</p>
      <p><a href="${m.website}" target="_blank" rel="noopener noreferrer">${m.website}</a></p>
    </article>
  `).join('');
}

function renderList(members) {
  directoryEl.className = 'directory list';
  directoryEl.innerHTML = members.map(m => `
    <div class="list-item" role="listitem">
      <div>
        <strong>${m.name}</strong><br>
        <span>${m.address}</span>
      </div>
      <div class="meta">
        <div>${m.phone}</div>
        <div>${m.membership === 3 ? 'Gold' : m.membership === 2 ? 'Silver' : 'Member'}</div>
      </div>
    </div>
  `).join('');
}

/* Wire buttons */
gridBtn.addEventListener('click', async () => {
  gridBtn.setAttribute('aria-pressed', 'true');
  listBtn.setAttribute('aria-pressed', 'false');
  const mem = await fetchMembers();
  renderGrid(mem);
});

listBtn.addEventListener('click', async () => {
  listBtn.setAttribute('aria-pressed', 'true');
  gridBtn.setAttribute('aria-pressed', 'false');
  const mem = await fetchMembers();
  renderList(mem);
});

/* Initial load */
(async () => {
  const mem = await fetchMembers();
  renderGrid(mem);
})();
