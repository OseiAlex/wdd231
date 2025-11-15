// scripts/home.js (ES module)
const OPENWEATHER_API_KEY = "c501dfa6e95e6d3cd23249b2b574c9bf"; // <-- PUT YOUR OpenWeatherMap API KEY HERE
const CITY = "Accra,GH";
const UNITS = "metric"; // metric for Celsius

const menuBtn = document.getElementById('menu-btn');
const navList = document.getElementById('nav-list');
menuBtn?.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  navList.style.display = expanded ? 'none' : 'block';
});

/* Footer info (year and last-modified with valid datetime) */
document.getElementById('year').textContent = new Date().getFullYear();

(function setLastModified(){
  const lastModEl = document.getElementById('last-modified');
  const d = new Date(document.lastModified || Date.now());
  lastModEl.textContent = d.toLocaleString();
  lastModEl.setAttribute('datetime', d.toISOString());
})();

/* Weather: fetch current + forecast */
async function fetchWeather(){
  const card = document.getElementById('weather-card');
  if (!OPENWEATHER_API_KEY) {
    card.innerHTML = `<p class="error">Weather API key missing. Add your OpenWeatherMap API key to scripts/home.js.</p>`;
    return;
  }
  try {
    // fetch 5-day / 3-hour forecast (includes current forecast)
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(CITY)}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();

    // Current conditions: take first item or city data
    const now = data.list && data.list.length ? data.list[0] : null;
    const currentTemp = now ? Math.round(now.main.temp) : null;
    const currentDesc = now ? now.weather[0].description : 'No data';

    // Build a 3-day forecast: group items by date and pick one per day (midday preferred)
    const forecastMap = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().slice(0,10); // YYYY-MM-DD
      if (!forecastMap[day]) forecastMap[day] = [];
      forecastMap[day].push(item);
    });

    // Get next 3 calendar days (excluding today if time earlier/later)
    const today = new Date().toISOString().slice(0,10);
    const days = Object.keys(forecastMap).filter(d => d >= today).slice(0,4); // includes today
    // pick up to 3 future days including today if present
    const forecastDays = [];
    for (let d of days) {
      // pick an item near midday if possible
      const items = forecastMap[d];
      let pick = items.find(it => it.dt_txt && it.dt_txt.includes("12:00:00"));
      if (!pick) pick = items[Math.floor(items.length/2)];
      forecastDays.push({
        date: d,
        temp: Math.round(pick.main.temp),
        desc: pick.weather[0].description,
        icon: pick.weather[0].icon
      });
      if (forecastDays.length === 3) break;
    }

    // Render
    card.innerHTML = `
      <div class="weather-row">
        <div>
          <div class="weather-temp">${currentTemp !== null ? currentTemp + '°C' : 'N/A'}</div>
          <div class="weather-desc">${capitalize(currentDesc)}</div>
        </div>
        <div aria-hidden="true">
          <img src="https://openweathermap.org/img/wn/${now.weather[0].icon}@2x.png" alt="" width="64" height="64">
        </div>
      </div>
      <hr>
      <div class="forecast" aria-label="3 day forecast">
        ${forecastDays.map(fd => `
          <div class="forecast-day">
            <strong>${formatDateLabel(fd.date)}</strong>
            <div>${fd.temp}°C — ${capitalize(fd.desc)}</div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById('weather-card').innerHTML = `<p class="error">Unable to load weather data.</p>`;
  }
}

function capitalize(s){ return s && s.length ? s[0].toUpperCase() + s.slice(1) : s; }
function formatDateLabel(iso){ 
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });
}

/* Spotlight: load members.json, filter silver/gold, randomly pick 2-3 */
async function loadSpotlights(){
  const spotEl = document.getElementById('spotlight-list');
  spotEl.innerHTML = `<p class="loading">Loading spotlights…</p>`;
  try {
    const res = await fetch('data/members.json', {cache:'no-cache'});
    if (!res.ok) throw new Error('members.json fetch failed');
    const members = await res.json();
    // filter silver(2) or gold(3)
    const good = members.filter(m => m.membership === 2 || m.membership === 3);
    if (!good.length) {
      spotEl.innerHTML = `<p>No bronze/silver members found.</p>`;
      return;
    }
    // shuffle and pick 2 or 3 randomly
    shuffleArray(good);
    const count = Math.min(good.length, (Math.random() < 0.5 ? 2 : 3));
    const chosen = good.slice(0, count);
    spotEl.innerHTML = chosen.map(m => `
      <article class="spotlight" aria-label="${escapeHtml(m.name)}">
        <img src="images/${m.image}" alt="${escapeHtml(m.name)} logo" loading="lazy">
        <div>
          <h3>${escapeHtml(m.name)}</h3>
          <p>${escapeHtml(m.address)}</p>
          <p>${escapeHtml(m.phone)}</p>
          <p><a href="${escapeHtml(m.website)}" target="_blank" rel="noopener noreferrer">Visit website</a></p>
          <p><strong>${m.membership === 3 ? 'Gold' : 'Silver'} member</strong></p>
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.error(err);
    spotEl.innerHTML = `<p class="error">Unable to load spotlights.</p>`;
  }
}

function shuffleArray(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* escape simple HTML for safety in template */
function escapeHtml(str){
  if (!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/* init */
(async function init(){
  await loadSpotlights();
  await fetchWeather();
})();
