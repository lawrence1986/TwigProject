import { getCurrentUser, logout, isAuthenticated } from "../utils/auth.js";
import { url } from "../config.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
});

function initNavbar() {
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  // Show/hide nav elements based on auth status
  if (authenticated) {
    showAuthenticatedNav(user);
  } else {
    hideAuthenticatedNav();
  }
  setupMobileMenu();

  setupLogout();
}

function showAuthenticatedNav(user) {
  const desktopMenu = document.getElementById("desktopMenu");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const userGreeting = document.getElementById("userGreeting");
  const userGreetingMobile = document.getElementById("userGreetingMobile");

  if (desktopMenu) {
    // Remove inline style and keep the responsive classes
    desktopMenu.style.display = "";
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.style.display = "";
  }

  if (userGreeting && user?.name) {
    const nameSpan = userGreeting.querySelector('span');
    if (nameSpan) {
      nameSpan.textContent = `Hi, ${user.name}`;
    } else {
      userGreeting.textContent = `Hi, ${user.name}`;
    }
  }

  if (userGreetingMobile && user?.name) {
    userGreetingMobile.textContent = `Hi, ${user.name}`;
  }
}

function hideAuthenticatedNav() {
  const desktopMenu = document.getElementById("desktopMenu");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");

  if (desktopMenu) {
    desktopMenu.style.display = "none";
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.style.display = "none";
  }
}

function setupMobileMenu() {
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");

  if (!menuToggleBtn || !mobileMenu) return;

  menuToggleBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("hidden");

    if (isOpen) {
      mobileMenu.classList.remove("hidden");
      menuIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
      menuToggleBtn.setAttribute("aria-expanded", "true");
    } else {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      menuToggleBtn.setAttribute("aria-expanded", "false");
    }
  });
  const mobileMenuLinks = mobileMenu.querySelectorAll("button, a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      menuToggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutBtnMobile = document.getElementById("logoutBtnMobile");

  const handleLogout = () => {
    window.location.href = url("");
    logout();
  };

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  if (logoutBtnMobile) {
    logoutBtnMobile.addEventListener("click", handleLogout);
  }
}

export function refreshNavbar() {
  initNavbar();
}
