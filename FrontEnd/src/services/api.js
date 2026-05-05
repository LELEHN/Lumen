const API_URL = "http://192.168.15.18:5010"; // seu IP

export async function apiFetch(endpoint, options) {
    
  const resp = await fetch(`${API_URL}${endpoint}`, options);

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.erro || "Erro na requisição");
  }

  return data;
}