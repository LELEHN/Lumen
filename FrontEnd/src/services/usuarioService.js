import { apiFetch } from "./api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function cadastrarUsuario(usuario) {
  return await apiFetch("/usuario/cadastro/cliente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
}

export async function loginUsuario(dados) {
  return await apiFetch("/usuario/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

export async function getMeuPerfil() {
  const token = await AsyncStorage.getItem("token");
  return await apiFetch("/usuario/perfil", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function uploadFotoPerfil(fotoBase64) {
  const token = await AsyncStorage.getItem("token");
  return await apiFetch("/usuario/foto", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ foto: fotoBase64 }),
  });
}

// ✅ NOVO: atualiza nome, telefone e endereço
export async function atualizarInfoPerfil(nome, telefone, endereco) {
  const token = await AsyncStorage.getItem("token");
  return await apiFetch("/usuario/info", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome, telefone, endereco }),
  });
}

export async function buscarMinhasVendas() {
  const token = await AsyncStorage.getItem("token");
  return await apiFetch("/cliente/minhas-vendas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}