const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, "");

export function apiUrl(path) {
  return `${normalizedApiBaseUrl}${path}`;
}
