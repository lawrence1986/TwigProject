import { showSuccess, showError } from "./toast.js";

/**
 * Ticket Dialog Manager
 * Handles opening, closing, and submitting the ticket dialog
 */

let onSubmitCallback = null;

/**
 * Initialize the ticket dialog
 */
export function initTicketDialog() {
  const dialog = document.getElementById("ticketDialog");
  const cancelBtn = document.getElementById("cancelBtn");
  const ticketForm = document.getElementById("ticketForm");

  if (!dialog || !cancelBtn || !ticketForm) return;

  // Close dialog on cancel
  cancelBtn.addEventListener("click", () => {
    closeTicketDialog();
  });

  // Close dialog on backdrop click
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      closeTicketDialog();
    }
  });

  // Handle form submission
  ticketForm.addEventListener("submit", handleFormSubmit);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dialog.classList.contains("hidden")) {
      closeTicketDialog();
    }
  });
}

/**
 * Open dialog in create mode
 * @param {Function} onSubmit - Callback function when form is submitted
 */
export function openCreateDialog(onSubmit) {
  const dialog = document.getElementById("ticketDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogDescription = document.getElementById("dialogDescription");
  const dialogMode = document.getElementById("dialogMode");
  const submitBtnText = document.getElementById("submitBtnText");
  const ticketStatus = document.getElementById("ticketStatus");

  if (!dialog) return;

  // Set mode
  dialogMode.value = "create";
  onSubmitCallback = onSubmit;

  // Update UI
  dialogTitle.textContent = "Create New Ticket";
  dialogDescription.textContent = "Fill in the details to create a new ticket.";
  submitBtnText.textContent = "Create Ticket";

  // Reset form
  clearForm();
  ticketStatus.value = "open";

  // Show dialog
  dialog.classList.remove("hidden");
  dialog.setAttribute("data-state", "open");
}

export function openEditDialog(ticket, onSubmit) {
  const dialog = document.getElementById("ticketDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogDescription = document.getElementById("dialogDescription");
  const dialogMode = document.getElementById("dialogMode");
  const submitBtnText = document.getElementById("submitBtnText");
  const ticketId = document.getElementById("ticketId");
  const ticketTitle = document.getElementById("ticketTitle");
  const ticketDescription = document.getElementById("ticketDescription");
  const ticketStatus = document.getElementById("ticketStatus");

  if (!dialog) return;

  // Set mode
  dialogMode.value = "edit";
  onSubmitCallback = onSubmit;

  // Update UI
  dialogTitle.textContent = "Edit Ticket";
  dialogDescription.textContent = "Update the ticket information below.";
  submitBtnText.textContent = "Update Ticket";

  // Populate form with ticket data
  ticketId.value = ticket.id;
  ticketTitle.value = ticket.title;
  ticketDescription.value = ticket.description;
  ticketStatus.value = ticket.status;

  clearErrors();

  // Show dialog
  dialog.classList.remove("hidden");
  dialog.setAttribute("data-state", "open");
}

export function closeTicketDialog() {
  const dialog = document.getElementById("ticketDialog");
  if (!dialog) return;

  dialog.setAttribute("data-state", "closed");
  setTimeout(() => {
    dialog.classList.add("hidden");
    clearForm();
    clearErrors();
  }, 200);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const mode = document.getElementById("dialogMode").value;
  const ticketId = document.getElementById("ticketId").value;
  const title = document.getElementById("ticketTitle").value.trim();
  const description = document.getElementById("ticketDescription").value.trim();
  const status = document.getElementById("ticketStatus").value;

  if (!validateForm(title, description)) {
    return;
  }

  const ticketData = { title, description, status };

  if (onSubmitCallback) {
    try {
      if (mode === "edit") {
        await onSubmitCallback(ticketId, ticketData);
      } else {
        await onSubmitCallback(ticketData);
      }
      closeTicketDialog();
    } catch (error) {
      showError(error.message || "Failed to save ticket");
    }
  }
}

function validateForm(title, description) {
  clearErrors();
  let isValid = true;

  if (!title) {
    showFieldError("title", "Title is required");
    isValid = false;
  }

  if (!description) {
    showFieldError("description", "Description is required");
    isValid = false;
  }

  return isValid;
}

function showFieldError(field, message) {
  const errorEl = document.getElementById(`${field}Error`);
  const inputEl = document.getElementById(
    `ticket${field.charAt(0).toUpperCase() + field.slice(1)}`
  );

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  if (inputEl) {
    inputEl.classList.add("border-red-500");
  }
}

function clearErrors() {
  const titleError = document.getElementById("titleError");
  const descriptionError = document.getElementById("descriptionError");
  const ticketTitle = document.getElementById("ticketTitle");
  const ticketDescription = document.getElementById("ticketDescription");

  if (titleError) {
    titleError.textContent = "";
    titleError.classList.add("hidden");
  }

  if (descriptionError) {
    descriptionError.textContent = "";
    descriptionError.classList.add("hidden");
  }

  if (ticketTitle) {
    ticketTitle.classList.remove("border-red-500");
  }

  if (ticketDescription) {
    ticketDescription.classList.remove("border-red-500");
  }
}

function clearForm() {
  document.getElementById("ticketId").value = "";
  document.getElementById("ticketTitle").value = "";
  document.getElementById("ticketDescription").value = "";
  document.getElementById("ticketStatus").value = "open";
  clearErrors();
}
