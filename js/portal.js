// Portal: o halter arrastável escolhe entre a PKZ (ponta esquerda) e a One To One (ponta direita).
// Soltar perto de uma ponta mostra o aviso "redirecionando..." e abre a página da marca.

const PKZ_URL = "pages/pkz.html";
const OTO_URL = "pages/one-to-one.html";
const EDGE = 10; // soltar com posição <= 10 (PKZ) ou >= 90 (One To One) redireciona
const REDIRECT_MS = 1500; // tempo do aviso antes de abrir a página (dá tempo de cancelar)

const handle = document.getElementById("handle");
const track = document.getElementById("track");
const pkzPanel = document.getElementById("pkz");
const pkzInner = pkzPanel.querySelector(".p-inner");
const otoInner = document.querySelector("#oto .p-inner");
const fillL = document.getElementById("fill-l");
const fillR = document.getElementById("fill-r");
const divLine = document.getElementById("div-line");
const arrL = document.getElementById("arr-l");
const arrR = document.getElementById("arr-r");
const redir = document.getElementById("redir");
const rName = document.getElementById("redir-name");
const redirCancel = document.getElementById("redir-cancel");
const dragHint = document.getElementById("drag-hint");
const hintPkzBox = document.getElementById("hint-pkz-box");
const btnPkzCta = document.getElementById("btn-pkz-cta");
const btnOtoCta = document.getElementById("btn-oto-cta");
const stageEl = document.getElementById("stage");

let dragging = false;
let redirected = false;
let hasDragged = false;
let redirTimer = null;
let pos = 50; // posição do halter, de 0 (ponta da PKZ) a 100 (ponta da One To One)

// converte a posição do mouse/dedo em porcentagem (0 a 100) ao longo do trilho
function toPercent(clientX) {
  const r = track.getBoundingClientRect();
  return Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
}

// Conteúdo do painel: 0 abaixo de 22% de largura, 1 acima de 38%, linear no meio
function fadeInner(el, width) {
  const o = Math.max(0, Math.min(1, (width - 22) / 16));
  el.style.opacity = o;
  el.style.visibility = o === 0 ? "hidden" : "visible";
}

// texto lido por leitores de tela
function textoDaPosicao(p) {
  if (p <= EDGE) return "PKZ. Pressione Enter para visitar";
  if (p >= 100 - EDGE) return "One To One. Pressione Enter para visitar";
  if (p < 45) return "Mais perto da PKZ";
  if (p > 55) return "Mais perto da One To One";
  return "Centro";
}

// coloca o halter na posição p e ajusta painéis, linha do meio e setas
function apply(p) {
  pos = p;
  handle.style.left = p + "%";
  handle.setAttribute("aria-valuenow", Math.round(p));
  handle.setAttribute("aria-valuetext", textoDaPosicao(p));

  const pkzWidth = 100 - p;
  pkzPanel.style.width = pkzWidth + "%";
  divLine.style.left = `calc(${pkzWidth}% - 1px)`;
  fillL.style.width = pkzWidth + "%";
  fillR.style.width = p + "%";
  fadeInner(pkzInner, pkzWidth);
  fadeInner(otoInner, p);
  hintPkzBox.style.width = pkzWidth + "%";

  // setas de "solte para entrar" nas pontas
  arrL.classList.toggle("on", p <= EDGE);
  arrR.classList.toggle("on", p >= 100 - EDGE);
}

// Só redireciona ao soltar (ou Enter/Espaço) perto de uma ponta
function commit() {
  if (pos <= EDGE) doRedirect("PKZ", "#07111e", PKZ_URL);
  else if (pos >= 100 - EDGE) doRedirect("ONE TO ONE", "#014c6f", OTO_URL);
}

function doRedirect(name, bg, url) {
  if (redirected) return;
  redirected = true;
  redir.style.background = bg;
  redir.style.color = "#ffffff";
  rName.textContent = name;
  redir.hidden = false;
  redir.classList.add("on");
  redirCancel.focus();
  redirTimer = setTimeout(() => {
    window.location.href = url;
  }, REDIRECT_MS);
}

function cancelRedirect() {
  clearTimeout(redirTimer);
  redirected = false;
  redir.classList.remove("on");
  redir.hidden = true;
  apply(50);
}

redirCancel.addEventListener("click", () => {
  cancelRedirect();
  handle.focus();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && redirected) redirCancel.click();
});

// Os botões "Quero conhecer" também mostram o aviso antes de abrir a página
function ligarBotao(botao, name, bg, url) {
  botao.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; // deixa abrir em nova aba
    e.preventDefault();
    doRedirect(name, bg, url);
  });
}
ligarBotao(btnPkzCta, "PKZ", "#07111e", PKZ_URL);
ligarBotao(btnOtoCta, "ONE TO ONE", "#014c6f", OTO_URL);

// A barra fica fixa no topo e os painéis abaixo da apresentação: ao mexer no halter,
// leva a página até os painéis para o arrasto nunca acontecer "às cegas".
function showStage() {
  const r = stageEl.getBoundingClientRect();
  if (r.top < innerHeight * 0.25 && r.bottom > innerHeight * 0.75) return; // já está à vista
  stageEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Primeiro uso: some a dica de texto e para o "empurrão" do halter
function firstUse() {
  showStage();
  if (hasDragged) return;
  hasDragged = true;
  dragHint.style.opacity = "0";
  handle.classList.add("used");
}

// Pointer Events cobrem mouse, toque e caneta; touch-action: none no CSS evita rolar a página
handle.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  dragging = true;
  firstUse();
  handle.setPointerCapture(e.pointerId);
  e.preventDefault();
});

handle.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  apply(toPercent(e.clientX));
});

handle.addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;
  commit();
});

handle.addEventListener("pointercancel", () => {
  dragging = false;
});

apply(50);

// Teclado: setas/Home/End só movem; Enter/Espaço entram se estiver numa ponta
handle.addEventListener("keydown", (e) => {
  const step = 5;
  let newPos = pos;

  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    newPos = Math.max(0, pos - step);
  } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    newPos = Math.min(100, pos + step);
  } else if (e.key === "Home") {
    newPos = 0;
  } else if (e.key === "End") {
    newPos = 100;
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    commit();
    return;
  } else {
    return;
  }

  e.preventDefault();
  if (newPos !== pos) {
    firstUse();
    apply(newPos);
  }
});

// Ao voltar pelo histórico (bfcache), limpa o aviso e recentraliza o halter
window.addEventListener("pageshow", (e) => {
  if (e.persisted) cancelRedirect();
});