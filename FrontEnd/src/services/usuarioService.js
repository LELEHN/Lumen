import { apiFetch } from "./api.js";

//Função que conecta com o endPoint do backend

export async function cadastrarUsuario(usuario) {
  return await apiFetch("/usuario/cadastro/cliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });
}

export async function loginUsuario(dados) {
  return await apiFetch("/usuario/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
}