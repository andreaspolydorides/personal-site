
const GOOGLE_FORM = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSdNW68QwuezY8xzlOcrqW5Huw3keuGsRbGqRbahcjROY77xCw/formResponse?",
  fields: { name: "entry.1817505469", email: "entry.559397126", message: "entry.290750087" }
};


/* ---------- Edit your projects here ----------
   image: path to a file in /images (16:10 works best). Leave "" for an automatic placeholder.
   link:  optional URL (repo, paper, write-up). */
const projects = [
  {
    title: "3D printed wheelchair cushions",
    description: "Software personalising, 3D printing instructions of wheelchair cushions based on an individual's pressure map with the aim of improving pressure distribution.",
    image: "images/cushion.png",
    tags: ["3D printing", "Python", "Materials Testing"],
    link: ""
  },
  {
    title: "Peltier Controller and Sensing Board",
    description: "A Raspberry Pi Pico PCB with Peltier cooler control circuitry, sensor inputs (e.g. thermistors), fan outputs and I2C expansion, designed in KiCad.",
    image: "",
    tags: ["Electronics", "KiCad", "Open Hardware"],
    link: ""
  },
  {
    title: "ESP32-based datalogger for smart weather stations",
    description: "A Zigbee and Matter-over-Thread compatible ESP32-C5 PCB with support for USB-PD, POE+ and bare wire power inputs, 24-bit ADC, I2C/UART/RS485 and pulse counter sensors and other quality of life features.",
    image: "",
    tags: ["Electronics", "Kicad", "Home Automation"],
    link: ""
  }
];

const grid = document.getElementById("project-grid");
 
function placeholder(title) {
  // Generated layered-print pattern so cards without a photo still look intentional
  const lines = Array.from({ length: 14 }, (_, i) =>
    `<path d="M0 ${16 + i * 11}H320" stroke="#7b93b3" stroke-opacity="${0.12 + (i % 4) * 0.05}" stroke-width="3"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">${lines}</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
 
projects.forEach((p) => {
  const card = document.createElement("article");
  card.className = "card reveal";
  const img = document.createElement("img");
  img.alt = p.image ? p.title : "";
  img.loading = "lazy";
  img.src = p.image || placeholder(p.title);
  img.onerror = () => { img.onerror = null; img.src = placeholder(p.title); };
  const box = document.createElement("div");
  box.className = "img";
  box.appendChild(img);
  const body = document.createElement("div");
  body.className = "body";
  body.innerHTML = `<h3></h3><p></p><div class="tags"></div>`;
  body.querySelector("h3").textContent = p.title;
  body.querySelector("p").textContent = p.description;
  p.tags.forEach((t) => { const s = document.createElement("span"); s.textContent = t; body.querySelector(".tags").appendChild(s); });
  if (p.link) {
    const a = document.createElement("a");
    a.className = "more"; a.href = p.link; a.textContent = "View project"; a.rel = "noopener";
    body.insertBefore(a, body.querySelector(".tags"));
  }
  card.append(box, body);
  grid.appendChild(card);
});
 
 
// Cards fade in as they enter view
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".card.reveal").forEach((c) => io.observe(c));
 
document.getElementById("year").textContent = new Date().getFullYear();
 
// Light/dark toggle (initial theme is set by the inline script in <head>; light by default)
const root = document.documentElement, toggle = document.getElementById("theme-toggle");
const sync = () => toggle.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
sync();
toggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  sync();
});

// Contact form
const form = document.getElementById("contact-form"), status = document.getElementById("form-status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  status.className = "status";
  if (data.get("website")) return;                       // honeypot: bots fill this hidden field
  let ok = true;
  ["name", "email", "message"].forEach((k) => {
    const el = form.elements[k], v = String(data.get(k)).trim();
    const bad = !v || (k === "email" && !/^\S+@\S+\.\S+$/.test(v));
    el.setAttribute("aria-invalid", bad); if (bad) ok = false;
  });
  if (!ok) { status.textContent = "Please fill in all fields with a valid email address."; status.classList.add("err"); return; }
 
  const btn = form.querySelector("button");
  btn.disabled = true; status.textContent = "Sending…";
  try {
    if (GOOGLE_FORM.action) {
      const body = new URLSearchParams();
      Object.entries(GOOGLE_FORM.fields).forEach(([k, id]) => body.append(id, String(data.get(k)).trim()));
      // Google Forms doesn't allow reading the reply from another site, so no-cors is used
      await fetch(GOOGLE_FORM.action, { method: "POST", mode: "no-cors", body });
    } else {
      console.info("Contact form is not connected yet; set GOOGLE_FORM in script.js.");
    }
    form.reset();
    status.textContent = "Thank you! Your message has been sent and I'll be in touch soon.";
    status.classList.add("ok");
  } catch (err) {
    status.textContent = "Something went wrong sending your message. Please try again in a moment.";
    status.classList.add("err");
  } finally { btn.disabled = false; }
});
 
