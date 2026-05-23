import { Router } from "express";
import {
  salvarCliente,
  verificarUsuario,
  buscarUsuarioPorId,
  atualizarFotoUsuario,
  atualizarInfoUsuario,
} from "../repository/usuarioRepository.js";
import { gerarToken, verificarToken } from "../services/jwt.js";

const endPoints = Router();

endPoints.post("/usuario/cadastro/cliente", async (req, resp) => {
  try {
    let usuario = req.body;
    let saida = await salvarCliente(usuario);
    if (!saida) return resp.status(500).send({ erro: "Erro ao inserir o usuario" });
    resp.send({ mensagem: "Usuario salvo com sucesso", novoId: saida });
  } catch (err) {
    console.error("Erro no endPoint", err);
    resp.status(400).send({ erro: err.message });
  }
});

endPoints.post("/usuario/login", async (req, resp) => {
  try {
    const usuario = req.body;
    if (!usuario.email || !usuario.senha)
      return resp.status(400).send({ erro: "Campos obrigatórios" });

    const verificaUsuario = await verificarUsuario(usuario);
    if (verificaUsuario.length === 0)
      return resp.status(400).send({ erro: "Email ou senha incorretos" });

    let token = gerarToken(verificaUsuario[0]);
    resp.send({
      mensagem: "Login feito com sucesso",
      token: token,
      usuarioId: verificaUsuario[0].id,
      usuarioEmail: verificaUsuario[0].email,
    });
  } catch (err) {
    console.error("Não foi possível fazer o login", err);
    resp.status(500).send({ erro: "Erro interno ao fazer login." });
  }
});

endPoints.get("/usuario/perfil", async (req, resp) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return resp.status(401).send({ erro: "Token não enviado" });
    const token = authHeader.split(" ")[1];
    const decoded = verificarToken(token);
    const usuario = await buscarUsuarioPorId(decoded.id);
    if (!usuario) return resp.status(404).send({ erro: "Usuário não encontrado" });
    resp.send(usuario);
  } catch (err) {
    console.error("Erro ao buscar perfil:", err.message);
    resp.status(500).send({ erro: err.message });
  }
});

endPoints.put("/usuario/foto", async (req, resp) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return resp.status(401).send({ erro: "Token não enviado" });
    const token = authHeader.split(" ")[1];
    const decoded = verificarToken(token);
    const { foto } = req.body;
    if (!foto) return resp.status(400).send({ erro: "Foto não enviada" });
    await atualizarFotoUsuario(decoded.id, foto);
    resp.send({ mensagem: "Foto atualizada com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar foto", err);
    resp.status(500).send({ erro: err.message });
  }
});

// ✅ NOVO: atualiza nome, telefone e endereço
endPoints.put("/usuario/info", async (req, resp) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return resp.status(401).send({ erro: "Token não enviado" });
    const token = authHeader.split(" ")[1];
    const decoded = verificarToken(token);
    const { nome, telefone, endereco } = req.body;
    if (!nome) return resp.status(400).send({ erro: "Nome é obrigatório" });
    await atualizarInfoUsuario(decoded.id, nome, telefone, endereco);
    resp.send({ mensagem: "Informações atualizadas com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar info", err);
    resp.status(500).send({ erro: err.message });
  }
});

export default endPoints;