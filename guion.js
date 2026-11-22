"use strict";
// Mismos pesos que gen_doors() en game.gd, del piso 3 en adelante.
const PUERTAS = [
  [6, "Monstruo", "Combate. Oro y botín."],
  [3, "Cofre", "¿Tesoro o trampa?"],
  [2, "Santuario", "Reza o paga por suerte."],
  [2, "Tienda", "Gasta tu oro."],
  [2, "Hoguera", "Descansa o mejora."],
  [2, "Casino", "Apuesta sin límite de giros."],
  [2, "Élite", "Difícil. Reliquia segura."],
];
const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
const espera = ms => new Promise(r => setTimeout(r, quieto ? 0 : ms));
const $ = id => document.getElementById(id);
const bestias = [...document.querySelectorAll(".bestia")];

function sortear() {
  let r = Math.random() * PUERTAS.reduce((s, p) => s + p[0], 0);
  return PUERTAS.find(p => (r -= p[0]) < 0) || PUERTAS[0];
}

const puertas = [...document.querySelectorAll(".puerta")];
puertas.forEach(p => p.addEventListener("click", async () => {
  puertas.forEach(o => { o.disabled = true; if (o !== p) o.classList.add("apagada"); });
  p.classList.add("abriendo");
  await espera(280);
  p.classList.replace("abriendo", "abierta");
  await espera(220);
  const [, nombre, pista] = sortear();
  let titulo = nombre;
  if (nombre === "Monstruo") {
    const b = bestias[Math.floor(Math.random() * bestias.length)];
    const img = new Image();
    img.src = `img/${b.dataset.s}_0.png`; img.alt = ""; img.className = "px";
    p.append(img);
    titulo = b.dataset.n;
  }
  $("que").textContent = titulo;
  $("pista").textContent = pista;
  $("otra").hidden = false;
}));
$("otra").addEventListener("click", () => {
  puertas.forEach(p => { p.disabled = false; p.className = "puerta"; p.replaceChildren(); });
  $("que").textContent = "Elige una puerta.";
  $("pista").textContent = "El castillo se ha barajado.";
  $("otra").hidden = true;
  puertas[0].focus({ preventScroll: true });
});

bestias.forEach(b => b.addEventListener("click", async () => {
  bestias.forEach(o => o.setAttribute("aria-pressed", String(o === b)));
  $("ficha").textContent = `${b.dataset.n}. ${b.dataset.t}`;
  if (quieto || b.dataset.activa) return;
  b.dataset.activa = "1";
  const img = b.querySelector("img");
  const marcos = [1, 2, 3, 4, 5].map(i => Object.assign(new Image(), { src: `img/${b.dataset.s}_${i}.png` }));
  await Promise.all(marcos.map(m => m.decode().catch(() => {})));
  for (const m of marcos) { img.src = m.src; await espera(110); }
  img.src = `img/${b.dataset.s}_0.png`;
  delete b.dataset.activa;
}));
