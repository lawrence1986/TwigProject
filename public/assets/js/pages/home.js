import { isAuthenticated } from "../utils/auth.js";
import { showWarning } from "../utils/toast.js";
import { url } from "../config.js";

document.addEventListener("DOMContentLoaded", () => {
  const getStartedBtn = document.getElementById("getStartedBtn");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      if (isAuthenticated()) {
        window.location.href = url("dashboard");
      } else {
        showWarning("Please sign up or log in to get started!");

        // Redirect to signup after showing toast
        setTimeout(() => {
          window.location.href = url("auth/signup");
        }, 1500);
      }
    });
  }
});
