<<<<<<< HEAD
const API_URL = "http://192.168.15.5:5010"; // seu IP
=======
const API_URL = "http://192.168.0.183:5010"; // seu IP
>>>>>>> 14ec8342166a1988034d35168ca1478847275e77

export async function apiFetch(endpoint, options) {
    
  const resp = await fetch(`${API_URL}${endpoint}`, options);

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.erro || "Erro na requisição");
  }

  return data;
}