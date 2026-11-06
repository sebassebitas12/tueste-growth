const API = "/api";
export async function fetchJson(path, options) {
  const response = await fetch(API + path, options);
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "No pudimos completar la solicitud.");
  return data;
}
