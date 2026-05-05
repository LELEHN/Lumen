import { apiFetch } from "./api";

export async function listarProdutos() {
  const data = await apiFetch("/produto");
  return data.produtos;
}
