import { Router } from "express";
import autenticar from "../middleware/autenticar.js";

import {
    getCarrinho,
    postCarrinho,
    updateQtd,
    deleteItem
} from "../repository/carrinhoRepository.js";

let endPoints = Router();


//GET → buscar carrinho do usuário

endPoints.get('/carrinho/get', autenticar, async (req, resp) => {
    try {

        const idUsuario = req.usuario.id;

        const carrinho = await getCarrinho(idUsuario);

        resp.send(carrinho);

    } catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao buscar carrinho" });
    }
});


//POST → adicionar item no carrinho

endPoints.post('/carrinho/add', autenticar, async (req, resp) => {
    try {

        const idUsuario = req.usuario.id;
        const { id_produto, qtd } = req.body;

        const resultado = await postCarrinho(idUsuario, id_produto, qtd);

        resp.send(resultado);

    } catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao adicionar item no carrinho" });
    }
});


//PUT → atualizar quantidade (qtd++ / qtd--)

endPoints.put('/carrinho/update', autenticar, async (req, resp) => {
    try {

        const idUsuario = req.usuario.id;
        const { id_produto, delta } = req.body;

        await updateQtd(idUsuario, id_produto, delta);

        resp.send({ mensagem: "Quantidade atualizada com sucesso" });

    } catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao atualizar quantidade" });
    }
});


//DELETE → remover item do carrinho

endPoints.delete('/carrinho/delete/:id_produto', autenticar, async (req, resp) => {
    try {

        const idUsuario = req.usuario.id;
        const { id_produto } = req.params;

        await deleteItem(idUsuario, id_produto);

        resp.send({ mensagem: "Item removido com sucesso" });

    } catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao remover item" });
    }
});

export default endPoints;