import { url } from "../config.js";
import { logout, isAuthenticated } from "../utils/auth.js";
import { showSuccess, showError, showInfo } from "../utils/toast.js";
import {
  initTicketDialog,
  openCreateDialog,
  openEditDialog,
} from "../utils/ticket-dialog.js";

// Ticket state
let tickets = [];

/**
 * Initialize tickets page
 */
async function init() {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = url("/auth/login");
    return;
  }

  // Initialize dialog
  initTicketDialog();

  // Setup event listeners
  setupEventListeners();

  // Check for URL parameters (e.g., ?create=true)
  checkUrlParams();

  // Load tickets
  await loadTickets();
}

/**
 * Check URL parameters and handle actions
 */
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("create") === "true") {
    // Open create dialog if ?create=true is in URL
    openCreateDialog(handleCreateTicket);

    // Remove the query parameter from URL without reloading
    const newUrl = window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Create ticket button
  const createBtn = document.getElementById("createTicketBtn");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      openCreateDialog(handleCreateTicket);
    });
  }

  // Delete dialog buttons
  const deleteDialogCancel = document.getElementById("deleteDialogCancel");
  const deleteDialogConfirm = document.getElementById("deleteDialogConfirm");
  const deleteDialog = document.getElementById("deleteDialog");

  if (deleteDialogCancel) {
    deleteDialogCancel.addEventListener("click", closeDeleteDialog);
  }

  if (deleteDialogConfirm) {
    deleteDialogConfirm.addEventListener("click", confirmDeleteTicket);
  }

  // Close delete dialog on backdrop click
  if (deleteDialog) {
    deleteDialog.addEventListener("click", (e) => {
      if (e.target === deleteDialog) {
        closeDeleteDialog();
      }
    });
  }

  // Close delete dialog on Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      deleteDialog &&
      !deleteDialog.classList.contains("hidden")
    ) {
      closeDeleteDialog();
    }
  });

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

/**
 * Load tickets from API
 */
async function loadTickets() {
  try {
    const response = await fetch(url("/api/tickets.php"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load tickets");
    }

    const data = await response.json();
    tickets = data.tickets || [];
    renderTickets();
  } catch (error) {
    console.error("Error loading tickets:", error);
    showError("Failed to load tickets");
  }
}

/**
 * Render tickets to the page
 */
function renderTickets() {
  const container = document.getElementById("ticketsContainer");
  if (!container) return;

  if (tickets.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-20">
        <i data-lucide="file-text" class="mx-auto h-12 w-12 text-gray-400 mb-4"></i>
        <p class="text-gray-600 mb-4">
          No tickets yet. Create your first ticket to get started!
        </p>
        <button
          id="emptyStateCreateBtn"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-[#2563eb] text-white hover:bg-[#1d4ed8] h-10 px-6 py-2 transition-colors"
        >
          <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
          Create Ticket
        </button>
      </div>
    `;

    // Initialize Lucide icons for the empty state
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // Add event listener to empty state create button
    const emptyCreateBtn = document.getElementById("emptyStateCreateBtn");
    if (emptyCreateBtn) {
      emptyCreateBtn.addEventListener("click", () => {
        openCreateDialog(handleCreateTicket);
      });
    }

    return;
  }

  container.innerHTML = tickets
    .map((ticket) => createTicketCard(ticket))
    .join("");

  // Initialize Lucide icons for ticket cards
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Attach event listeners to edit and delete buttons
  tickets.forEach((ticket) => {
    const editBtn = document.getElementById(`edit-${ticket.id}`);
    const deleteBtn = document.getElementById(`delete-${ticket.id}`);

    if (editBtn) {
      editBtn.addEventListener("click", () => handleEditTicket(ticket));
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => handleDeleteTicket(ticket.id));
    }
  });
}

function createTicketCard(ticket) {
  const statusColors = {
    open: "bg-[#22c55e] text-white",
    "in-progress": "bg-[#f59e0b] text-white",
    closed: "bg-[#9ca3af] text-white",
  };

  const getStatusLabel = (status) => {
    return status.replace("-", " ").toUpperCase();
  };

  return `
    <div class="bg-white border border-slate-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-slate-900">${escapeHtml(
          ticket.title
        )}</h3>
        <span class="px-3 py-1 min-w-20 text-center rounded-full text-xs font-medium line-clamp-1 ${
          statusColors[ticket.status] || "bg-gray-200 text-gray-800"
        }">
          ${getStatusLabel(ticket.status)}
        </span>
      </div>
      <p class="text-gray-600 mb-4 line-clamp-2">${escapeHtml(
        ticket.description
      )}</p>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-500">Created: ${formatDate(
          ticket.created_at
        )}</p>
        <div class="flex gap-2">
          <button id="edit-${
            ticket.id
          }" class="inline-flex items-center justify-center h-9 px-3 rounded-md border border-slate-300 bg-white text-slate-900 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-colors text-sm font-medium">
            <i data-lucide="pencil" class="w-4 h-4"></i>
          </button>
          <button id="delete-${
            ticket.id
          }" class="inline-flex items-center justify-center h-9 px-3 rounded-md border border-slate-300 bg-white text-slate-900 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors text-sm font-medium">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

async function handleCreateTicket(ticketData) {
  try {
    const response = await fetch(url("/api/tickets.php"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create ticket");
    }

    const data = await response.json();
    showSuccess("Ticket created successfully");
    await loadTickets();
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

function handleEditTicket(ticket) {
  openEditDialog(ticket, async (ticketId, ticketData) => {
    try {
      const response = await fetch(url(`/api/tickets.php?id=${ticketId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update ticket");
      }

      showSuccess("Ticket updated successfully");
      await loadTickets();
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  });
}

async function handleDeleteTicket(ticketId) {
  // Open delete confirmation dialog
  openDeleteDialog(ticketId);
}

function openDeleteDialog(ticketId) {
  const dialog = document.getElementById("deleteDialog");
  if (!dialog) return;

  // Store ticket ID for deletion
  dialog.dataset.ticketId = ticketId;

  // Show dialog
  dialog.classList.remove("hidden");
  dialog.setAttribute("data-state", "open");
}

/**
 * Close delete confirmation dialog
 */
function closeDeleteDialog() {
  const dialog = document.getElementById("deleteDialog");
  if (!dialog) return;

  dialog.setAttribute("data-state", "closed");
  setTimeout(() => {
    dialog.classList.add("hidden");
    delete dialog.dataset.ticketId;
  }, 200);
}

/**
 * Confirm delete ticket
 */
async function confirmDeleteTicket() {
  const dialog = document.getElementById("deleteDialog");
  const ticketId = dialog?.dataset.ticketId;

  if (!ticketId) return;

  try {
    const response = await fetch(url(`/api/tickets.php?id=${ticketId}`), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete ticket");
    }

    showSuccess("Ticket deleted successfully");
    closeDeleteDialog();
    await loadTickets();
  } catch (error) {
    console.error("Error deleting ticket:", error);
    showError(error.message || "Failed to delete ticket");
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  logout();
  showInfo("Logged out successfully");
  window.location.href = url("/");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
