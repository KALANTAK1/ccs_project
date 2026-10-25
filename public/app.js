const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "☰";
  }));
}
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

const dateInput = document.querySelector("#date");
if (dateInput) {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localDate;
  dateInput.value = localDate;
}

async function submitJsonForm(form, endpoint, messageElement) {
  const button = form.querySelector('button[type="submit"]');
  messageElement.classList.remove("error");
  messageElement.textContent = "Sending…";
  button.disabled = true;
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Unable to submit the form.");
    messageElement.textContent = result.message + (result.reservationId ? ` Reference: ${result.reservationId}.` : "");
    form.reset();
    if (dateInput) {
      const now = new Date();
      dateInput.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = error.message || "Something went wrong. Please try again.";
  } finally {
    button.disabled = false;
  }
}

const reservationForm = document.querySelector("#reservation-form");
if (reservationForm) {
  reservationForm.addEventListener("submit", event => {
    event.preventDefault();
    submitJsonForm(reservationForm, "/api/reservations", document.querySelector("#reservation-message"));
  });
}
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    submitJsonForm(contactForm, "/api/contact", document.querySelector("#contact-message"));
  });
}
