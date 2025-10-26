// Get base path from the current script's path
const scriptPath = document.currentScript?.src || "";
const publicIndex = scriptPath.indexOf("/public/");
export const BASE_PATH =
  publicIndex !== -1
    ? scriptPath.substring(0, publicIndex + 7)
    : "/hng-stage-2-twig/public";

export function url(path) {
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${BASE_PATH}/${cleanPath}`;
}
