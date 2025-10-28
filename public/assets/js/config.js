// Determine base path
// 1) Prefer server-provided base path (set in base.twig)
// 2) Fallback to deriving from current script path
// 3) Normalize '/' to '' for root hosting (e.g., http://localhost:8000/)
const scriptPath = document.currentScript?.src || "";
const publicIndex = scriptPath.indexOf("/public/");
let detectedBase = window.__BASE_PATH__ ?? (publicIndex !== -1
  ? scriptPath.substring(0, publicIndex + 7)
  : "");

// Normalize
if (detectedBase === "/") {
  detectedBase = "";
}

export const BASE_PATH = detectedBase;

export function url(path) {
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${BASE_PATH}/${cleanPath}`.replace(/\/+/, "/");
}
