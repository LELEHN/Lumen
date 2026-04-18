import { Router } from "express";
import autenticar from "../middleware/autenticar.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { 
    inserirProduto, 
    listarProdutos, 
    buscarProdutoPorId, 
    atualizarProduto, 
    deletarProduto 
} from "../repository/produtoRepository.js";
import { verificarAdm } from "../services/cargo.js";

let endPoints = Router();
/*
let uploadImage = multer({
    dest: path.resolve('storage', 'imagemProduto'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = /jpeg|jpg|png|webp|gif/;
        const extValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());

        // Aceita octet-stream pois React Native pode enviar assim
        const mimeValido = tiposPermitidos.test(file.mimetype) ||
                           file.mimetype === "application/octet-stream";

        if (extValida && mimeValido) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas'));
        }
    }
});*/

let uploadImage = multer({
    dest: path.resolve('storage', 'imagemProduto'),
    limits: { fileSize: 5 * 1024 * 1024 },
});
// ========================================
// CREATE - Criar Produto
// ========================================
endPoints.post('/adm/produto', autenticar, uploadImage.single('imagem'), async(req, resp) => {
    try {
        const produto = req.body;
        const imagemProduto = req.file;
        const usuario = req.usuario;

        if (!verificarAdm(usuario.cargo)) {
            return resp.status(403).send({ erro: "Usuario sem permissão" })
        }

        if (!produto.nome || !produto.marca || !produto.preco || !produto.descricao || !imagemProduto || !produto.estoque) {
            return resp.status(400).send({ erro: "Todos os campos são obrigatórios" });
        }

        if (isNaN(produto.preco) || parseFloat(produto.preco) <= 0) {
            return resp.status(400).send({ erro: "Preço inválido" });
        }

        let saida = await inserirProduto(produto, imagemProduto.filename);

        resp.status(201).send({
            mensagem: "Produto criado com sucesso",
            produto: saida
        });

    } catch (err) {
        console.error("Erro ao criar produto:", err);
        resp.status(500).send({ erro: "Erro ao criar produto" });
    }
});

// ========================================
// READ - Listar Todos os Produtos
// ========================================
endPoints.get('/produto', async(req, resp) => {
    try {
        let produtos = await listarProdutos();

        resp.status(200).send({
            total: produtos.length,
            produtos: produtos
        });

    } catch (err) {
        console.error("Erro ao listar produtos:", err);
        resp.status(500).send({ erro: "Erro ao listar produtos" });
    }
});

// ========================================
// READ - Buscar Produto por ID
// ========================================
endPoints.get('/produto/:id', async(req, resp) => {
    try {
        const { id } = req.params;

        let produto = await buscarProdutoPorId(id);

        if (!produto) {
            return resp.status(404).send({ erro: "Produto não encontrado" });
        }

        resp.status(200).send({
            produto: produto
        });

    } catch (err) {
        console.error("Erro ao buscar produto:", err);
        resp.status(500).send({ erro: "Erro ao buscar produto" });
    }
});

// ========================================
// UPDATE - Atualizar Produto
// ========================================
endPoints.put('/adm/produto/:id', autenticar, uploadImage.single('imagem'), async(req, resp) => {
    try {
        const { id } = req.params;
        const produto = req.body;
        const novaImagem = req.file;
        const usuario = req.usuario;

        if (!verificarAdm(usuario.cargo)) {
            return resp.status(403).send({ erro: "Usuario sem permissão" })
        }

        let produtoExistente = await buscarProdutoPorId(id);
        if (!produtoExistente) {
            return resp.status(404).send({ erro: "Produto não encontrado" });
        }

        if (produto.preco && (isNaN(produto.preco) || parseFloat(produto.preco) <= 0)) {
            return resp.status(400).send({ erro: "Preço inválido" });
        }

        if (novaImagem && produtoExistente.imagem) {
            const caminhoImagemAntiga = path.resolve('storage', 'imagemProduto', produtoExistente.imagem);
            try {
                await fs.unlink(caminhoImagemAntiga);
            } catch (error) {
                console.log("Imagem antiga não encontrada:", error.message);
            }
        }

        const nomeImagem = novaImagem ? novaImagem.filename : produtoExistente.imagem;
        let produtoAtualizado = await atualizarProduto(id, produto, nomeImagem);

        resp.status(200).send({
            mensagem: "Produto atualizado com sucesso",
            produto: produtoAtualizado
        });

    } catch (err) {
        console.error("Erro ao atualizar produto:", err);
        resp.status(500).send({ erro: "Erro ao atualizar produto" });
    }
});

// ========================================
// DELETE - Deletar Produto
// ========================================
endPoints.delete('/adm/produto/:id', autenticar, async(req, resp) => {
    try {
        const { id } = req.params;
        const usuario = req.usuario;

        if (!verificarAdm(usuario.cargo)) {
            return resp.status(403).send({ erro: "Usuario sem permissão" })
        }

        let produto = await buscarProdutoPorId(id);
        if (!produto) {
            return resp.status(404).send({ erro: "Produto não encontrado" });
        }

        if (produto.imagem) {
            const caminhoImagem = path.resolve('storage', 'imagemProduto', produto.imagem);
            try {
                await fs.unlink(caminhoImagem);
            } catch (error) {
                console.log("Erro ao deletar imagem:", error.message);
            }
        }

        await deletarProduto(id);

        resp.status(200).send({
            mensagem: "Produto deletado com sucesso"
        });

    } catch (err) {
        console.error("Erro ao deletar produto:", err);
        resp.status(500).send({ erro: "Erro ao deletar produto" });
    }
});

export default endPoints;