// Comportamentos comuns das páginas das marcas (PKZ e One To One):
// menu hambúrguer, janela de contato, links de WhatsApp e botão de voltar ao topo.
// BRAND (os dados da marca desta página) vem de data.js.

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Menu hambúrguer ----------
  // Abrir e fechar = adicionar e remover a classe "nav-open"; o CSS faz o resto.
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("primary-navigation");

  function fecharMenu() {
    menu.classList.remove("nav-open");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", () => {
    const aberto = menu.classList.toggle("nav-open"); // true se acabou de abrir
    menuBtn.classList.toggle("active", aberto); // o ícone vira "X"
    menuBtn.setAttribute("aria-expanded", aberto);
  });

  // fecha ao clicar em um link do menu ou ao apertar Esc
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fecharMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharMenu();
  });

  // ---------- Janela de contato (<dialog>) ----------
  const contato = document.getElementById("contact");
  const nomeInput = document.getElementById("name");

  document.getElementById("open-contact-modal").addEventListener("click", (e) => {
    e.preventDefault(); // não deixa o link pular para #contact
    contato.showModal();
  });
  document.getElementById("close-modal").addEventListener("click", () => contato.close());
  contato.addEventListener("click", (e) => {
    if (e.target === contato) contato.close(); // clique no fundo escuro
  });

  // botão "Enviar para WhatsApp": abre o WhatsApp com a mensagem pronta
  document.getElementById("whatsapp-cta").addEventListener("click", () => {
    const nome = nomeInput.value.trim() || BRAND.contactFallbackName;
    const url = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(BRAND.contactMessage(nome))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  // ---------- Links de WhatsApp ----------
  // O HTML não guarda o número: os links com data-whatsapp recebem o de data.js.
  document.querySelectorAll("a[data-whatsapp]").forEach((link) => {
    link.href = `https://wa.me/${BRAND.whatsapp}`;
  });

  // ---------- Botão de voltar ao topo ----------
  const topo = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    topo.classList.toggle("show", window.scrollY > 300); // aparece depois de 300px de rolagem
  });
  topo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});