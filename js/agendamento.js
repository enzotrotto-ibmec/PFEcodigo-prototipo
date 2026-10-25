// Agendamento da aula experimental: a pessoa escolhe o dia e o horário, preenche o
// formulário e o pedido é enviado pelo WhatsApp da marca.
// BRAND (dados da marca desta página) vem de data.js. O menu, a janela de contato e o
// botão de voltar ao topo desta página são de main.js (carregado antes deste arquivo).

const SCHEDULE = BRAND.schedule;

function whatsappUrl(message) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

// CPF com dígitos verificadores válidos (rejeita sequências como 111.111.111-11).
function isValidCpf(digits) {
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false;
  for (let len = 9; len < 11; len++) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(digits[i]) * (len + 1 - i);
    if (((sum * 10) % 11) % 10 !== Number(digits[len])) return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  // Janela "Aula Experimental" (<dialog>) e os campos do formulário
  const bookingModal = document.getElementById("booking-modal");
  const bookingCloseBtn = document.getElementById("booking-close-modal");
  const bookingBadge = document.getElementById("booking-slot-badge");
  const bookingForm = document.getElementById("booking-form");
  const bookingError = document.getElementById("booking-error");
  const bookingConfirmation = document.getElementById("booking-confirmation");
  const bookingConfirmationText = document.getElementById("booking-confirmation-text");
  const bookingDoneBtn = document.getElementById("booking-done-btn");
  const bookingModalityInput = document.getElementById("booking-modality");
  const bookingNameInput = document.getElementById("booking-name");
  const bookingPhoneInput = document.getElementById("booking-phone");
  const bookingCpfInput = document.getElementById("booking-cpf");
  const bookingNotesInput = document.getElementById("booking-notes");
  const bookingConsentInput = document.getElementById("booking-consent");

  // as opções do campo "Modalidade" vêm de data.js
  BRAND.modalities.forEach((m) => bookingModalityInput.add(new Option(m, m)));

  let selectedSlot = null;

  function openBookingModal(day, time) {
    selectedSlot = { day, time };
    bookingBadge.textContent = `${day} · ${time}`;
    bookingForm.hidden = false;
    bookingConfirmation.hidden = true;
    bookingError.hidden = true;
    bookingModal.showModal(); // o select de modalidade tem autofocus
  }

  // Agenda: botões de dia + lista de horários, gerados a partir de SCHEDULE.
  const dayChips = document.getElementById("day-chips");
  const timeList = document.getElementById("time-list");
  const timeHeading = document.getElementById("time-heading");
  let selectedDay = null;

  function selectDay(day) {
    selectedDay = day;
    dayChips.querySelectorAll(".day-chip").forEach((chip) => {
      const on = chip.dataset.day === day.name;
      chip.setAttribute("aria-pressed", String(on));
      if (on) {
        // Centraliza o botão do dia na faixa que rola (celular) sem rolar a página.
        dayChips.scrollLeft = chip.offsetLeft - (dayChips.clientWidth - chip.offsetWidth) / 2;
      }
    });
    timeHeading.textContent = `Horários de ${day.name}`;
    timeList.replaceChildren(
      ...SCHEDULE.times.map((time) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "time-slot";
        btn.dataset.time = time;
        btn.textContent = time;
        btn.setAttribute("aria-label", `${day.name} às ${time}`);
        li.append(btn);
        return li;
      }),
    );
  }

  SCHEDULE.days.forEach((day) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "day-chip";
    chip.dataset.day = day.name;
    chip.textContent = day.short;
    chip.setAttribute("aria-label", day.name);
    chip.setAttribute("aria-pressed", "false");
    dayChips.append(chip);
  });
  dayChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".day-chip");
    if (!chip) return;
    selectDay(SCHEDULE.days.find((d) => d.name === chip.dataset.day));
  });
  timeList.addEventListener("click", (e) => {
    const slot = e.target.closest(".time-slot");
    if (slot) openBookingModal(selectedDay.name, slot.dataset.time);
  });
  // começa no dia de hoje (ou na segunda, se hoje não estiver na lista)
  const today = new Date().getDay();
  selectDay(SCHEDULE.days.find((d) => d.dow === today) || SCHEDULE.days[0]);

  // fechar a janela: botão ×, botão "Fechar" ou clique no fundo escuro
  const closeBooking = () => bookingModal.close();
  bookingCloseBtn.addEventListener("click", closeBooking);
  bookingDoneBtn.addEventListener("click", closeBooking);
  bookingModal.addEventListener("click", (e) => {
    if (e.target === bookingModal) closeBooking();
  });

  // máscara do CPF: 000.000.000-00
  bookingCpfInput.addEventListener("input", () => {
    let v = bookingCpfInput.value.replace(/\D/g, "").slice(0, 11);
    v = v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    bookingCpfInput.value = v;
  });

  // máscara do telefone: (21) 3333-4444 para fixo, (21) 99999-9999 para celular
  bookingPhoneInput.addEventListener("input", () => {
    const v = bookingPhoneInput.value.replace(/\D/g, "").slice(0, 11);
    let out = v;
    if (v.length > 6) {
      const split = v.length === 11 ? 7 : 6;
      out = `(${v.slice(0, 2)}) ${v.slice(2, split)}-${v.slice(split)}`;
    } else if (v.length > 2) {
      out = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    }
    bookingPhoneInput.value = out;
  });

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const modality = bookingModalityInput.value;
    const name = bookingNameInput.value.trim();
    const phone = bookingPhoneInput.value.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const cpf = bookingCpfInput.value.trim();
    const notes = bookingNotesInput.value.trim();

    // cada item: [está inválido?, campo, nome do campo na mensagem de erro]
    const problems = [
      [!modality, bookingModalityInput, "a modalidade"],
      [!name, bookingNameInput, "seu nome"],
      [phoneDigits.length < 10, bookingPhoneInput, "um telefone com DDD"],
      [!isValidCpf(cpf.replace(/\D/g, "")), bookingCpfInput, "um CPF válido"],
      [!bookingConsentInput.checked, bookingConsentInput, "a autorização de uso dos dados"],
    ].filter(([invalid]) => invalid);

    [bookingModalityInput, bookingNameInput, bookingPhoneInput, bookingCpfInput, bookingConsentInput]
      .forEach((el) => el.removeAttribute("aria-invalid"));

    if (problems.length) {
      problems.forEach(([, el]) => el.setAttribute("aria-invalid", "true"));
      bookingError.textContent = `Falta informar: ${problems.map(([, , label]) => label).join(", ")}.`;
      bookingError.hidden = false;
      problems[0][1].focus();
      return;
    }

    bookingError.hidden = true;

    const slotText = selectedSlot ? `${selectedSlot.day} às ${selectedSlot.time}` : "";
    const message = [
      `Olá, equipe ${BRAND.name}! Quero agendar uma aula experimental pelo site.`,
      `Horário: ${slotText}`,
      `Modalidade: ${modality}`,
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `CPF: ${cpf}`,
      notes && `Observação: ${notes}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");

    bookingConfirmationText.textContent = `Abrimos o WhatsApp com o seu pedido para ${slotText}. Envie a mensagem para a equipe confirmar o horário.`;
    bookingForm.hidden = true;
    bookingConfirmation.hidden = false;
    bookingDoneBtn.focus();
    bookingForm.reset();
  });
});