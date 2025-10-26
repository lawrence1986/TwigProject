/**
 * Toast utility wrapper for Toastify with custom types
 */

const defaultConfig = {
  duration: 3000,
  gravity: "bottom",
  position: "right",
  stopOnFocus: true,
  close: true,
};

export function showSuccess(message, options = {}) {
  if (typeof Toastify === "undefined") return;

  Toastify({
    ...defaultConfig,
    text: message,
    className: "success",
    ...options,
  }).showToast();
}

/**
 * Show an error toast
 * @param {string} message - Toast message
 * @param {object} options - Additional Toastify options
 */
export function showError(message, options = {}) {
  if (typeof Toastify === "undefined") return;

  Toastify({
    ...defaultConfig,
    text: message,
    className: "error",
    ...options,
  }).showToast();
}

export function showInfo(message, options = {}) {
  if (typeof Toastify === "undefined") return;

  Toastify({
    ...defaultConfig,
    text: message,
    className: "info",
    ...options,
  }).showToast();
}

export function showWarning(message, options = {}) {
  if (typeof Toastify === "undefined") return;

  Toastify({
    ...defaultConfig,
    text: message,
    className: "warning",
    ...options,
  }).showToast();
}

export function showCustom(message, type = "custom", options = {}) {
  if (typeof Toastify === "undefined") return;

  Toastify({
    ...defaultConfig,
    text: message,
    className: type,
    ...options,
  }).showToast();
}

export function showToast(message, options = {}) {
  if (typeof Toastify === "undefined") return;

  Toastify({
    ...defaultConfig,
    text: message,
    ...options,
  }).showToast();
}
