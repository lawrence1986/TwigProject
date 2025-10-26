import { url } from "../config.js";
import { logout, isAuthenticated } from "../utils/auth.js";
import { showInfo } from "../utils/toast.js";

// Ticket state
let tickets = [];

/**
 * Initialize dashboard page
 */
async function init() {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = url("/auth/login");
    return;
  }

  // Setup event listeners
  setupEventListeners();

  // Load tickets
  await loadTickets();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Create ticket button
  const createBtn = document.getElementById("createTicketBtn");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      window.location.href = url("/dashboard/tickets?create=true");
    });
  }

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

    // Update stats
    updateStats();

    // Render recent tickets
    renderRecentTickets();
  } catch (error) {
    console.error("Error loading tickets:", error);
  }
}

/**
 * Update statistics cards
 */
function updateStats() {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "in-progress"
  ).length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;

  // Update DOM
  document.getElementById("totalTickets").textContent = totalTickets;
  document.getElementById("openTickets").textContent = openTickets;
  document.getElementById("inProgressTickets").textContent = inProgressTickets;
  document.getElementById("closedTickets").textContent = closedTickets;
}

/**
 * Render recent tickets (first 4)
 */
function renderRecentTickets() {
  const container = document.getElementById("recentTicketsContainer");
  if (!container) return;

  const recentTickets = tickets.slice(0, 4);

  if (recentTickets.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i data-lucide="file-text" class="mx-auto h-12 w-12 text-gray-400 mb-4"></i>
        <p class="text-gray-600 mb-4">
          No tickets yet. Create your first ticket to get started!
        </p>
      </div>
    `;

    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    return;
  }

  container.innerHTML = recentTickets
    .map((ticket) => createRecentTicketCard(ticket))
    .join("");

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function createRecentTicketCard(ticket) {
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-[#22c55e] text-white";
      case "in-progress":
        return "bg-[#f59e0b] text-white";
      case "closed":
        return "bg-[#9ca3af] text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    return status.replace("-", " ").toUpperCase();
  };

  return `
    <div class="bg-white border border-slate-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='${url(
      "/dashboard/tickets"
    )}'">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-slate-900">${escapeHtml(
          ticket.title
        )}</h3>
        <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
          ticket.status
        )}">
          ${getStatusLabel(ticket.status)}
        </span>
      </div>
      <p class="text-gray-600 mb-4">${escapeHtml(ticket.description)}</p>
      <p class="text-sm text-gray-500">
        ${formatDate(ticket.created_at)}
      </p>
    </div>
  `;
}

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
