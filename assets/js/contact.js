// Contact form (PLAN 8.4). Without JavaScript the form posts to Formspree as
// usual, with the browser's own checks. With it, each field shows its
// problem inline (when the visitor leaves it, and on Send), and the message
// goes to Formspree in the background with `Accept: application/json`; the
// page then says whether it worked and offers the email address if not.

const form = document.querySelector("[data-contact-form]");

if (form) {
  form.noValidate = true;
  const status = form.querySelector("[data-form-status]");
  const subject = form.querySelector("[name='_subject']");
  const fields = [...form.querySelectorAll(".field:not([hidden]) input, .field:not([hidden]) textarea")];
  const email = form.dataset.email;
  const missing = {
    "contact-name": "Please enter your name.",
    "contact-email": "Please enter your email address, so I can reply.",
    "contact-message": "Please write a message.",
  };
  let sending = false;

  const problem = (field) => {
    const value = field.value.trim();
    if (!value) return missing[field.id] ?? "Please fill in this field.";
    if (field.validity.typeMismatch) return "Please enter a valid email address, like name@example.com.";
    if (field.minLength > 0 && value.length < field.minLength) return `Please write at least ${field.minLength} characters.`;
    return "";
  };
  const check = (field) => {
    const message = problem(field);
    const error = document.getElementById(`${field.id}-error`);
    error.textContent = message;
    error.hidden = !message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  };
  fields.forEach((field) => {
    field.addEventListener("blur", () => { if (field.value || field.hasAttribute("aria-invalid")) check(field); });
    field.addEventListener("input", () => { if (field.hasAttribute("aria-invalid")) check(field); });
  });

  const say = (state, text, offerEmail = false) => {
    status.dataset.state = state;
    status.replaceChildren(text);
    if (offerEmail && email) {
      const link = document.createElement("a");
      link.href = `mailto:${email}`;
      link.textContent = email;
      status.append(" You can also email me at ", link, ".");
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    const invalid = fields.filter((field) => !check(field));
    if (invalid.length) {
      status.replaceChildren();
      delete status.dataset.state;
      invalid[0].focus();
      return;
    }
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (subject && name) data.set("_subject", `Message from ${name} (mehdizd97.github.io)`);
    sending = true;
    say("sending", "Sending your message…");
    try {
      const response = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (response.ok) {
        form.reset();
        say("success", "Thank you! Your message was sent, and I’ll get back to you as soon as I can.");
      } else {
        const body = await response.json().catch(() => ({}));
        const reason = Array.isArray(body.errors) ? body.errors.map((item) => item.message).filter(Boolean).join(" ") : "";
        say("error", `Sorry, your message could not be sent.${reason ? ` ${reason}` : ""}`, true);
      }
    } catch (error) {
      say("error", "Sorry, your message could not be sent because the connection failed.", true);
    } finally {
      sending = false;
    }
  });
}
