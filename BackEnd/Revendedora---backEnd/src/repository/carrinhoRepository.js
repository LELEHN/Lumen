import connection from "./connection.js";


//--------------------> READ <-------------------
export async function getOrCreateCarrinho(id_usuario) {
    try {

        let comando = `
            SELECT * FROM carrinho
            WHERE id_usuario = ?
        `;

        let [rows] = await connection.query(comando, [id_usuario]);

        if (rows.length > 0) {
            return rows[0];
        }

        // se não existir, cria
        comando = `
            INSERT INTO carrinho (id_usuario)
            VALUES (?)
        `;

        let [insert] = await connection.query(comando, [id_usuario]);

        return { id: insert.insertId, id_usuario };

    } catch (err) {
        console.error("Erro ao buscar/criar carrinho:", err);
    }
}

//------------------> CREATE <---------------------

export async function postCarrinho(id_usuario, id_produto, qtd) {
    try {

        const carrinho = await getOrCreateCarrinho(id_usuario);

        // verifica se já existe o produto no carrinho
        let comando = `
            SELECT * FROM carrinho_item
            WHERE id_carrinho = ? AND id_produto = ?
        `;

        let [rows] = await connection.query(comando, [carrinho.id, id_produto]);

        // se já existe → só soma
        if (rows.length > 0) {
            comando = `
                UPDATE carrinho_item
                SET qtd = qtd + ?
                WHERE id_carrinho = ? AND id_produto = ?
            `;

            await connection.query(comando, [qtd, carrinho.id, id_produto]);

        } else {
            // se não existe → insere
            comando = `
                INSERT INTO carrinho_item (id_carrinho, id_produto, qtd)
                VALUES (?, ?, ?)
            `;

            await connection.query(comando, [carrinho.id, id_produto, qtd]);
        }

        // retorna carrinho atualizado
        comando = `
            SELECT produto.nome, produto.marca, carrinho_item.qtd
            FROM carrinho_item
            INNER JOIN produto ON produto.id = carrinho_item.id_produto
            WHERE carrinho_item.id_carrinho = ?
        `;

        let [select] = await connection.query(comando, [carrinho.id]);

        return select;

    } catch (err) {
        console.error("Erro no postCarrinho:", err);
    }
}

//----------------------> READ <-------------------------

export async function getCarrinho(id_usuario) {
    try {

        let comando = `
            SELECT produto.nome, produto.marca, carrinho_item.qtd
            FROM carrinho_item
            INNER JOIN carrinho ON carrinho.id = carrinho_item.id_carrinho
            INNER JOIN produto ON produto.id = carrinho_item.id_produto
            WHERE carrinho.id_usuario = ?
        `;

        let [rows] = await connection.query(comando, [id_usuario]);

        return rows;

    } catch (err) {
        console.error("Erro no getCarrinho:", err);
    }
}

//-------------------------> PUT <-----------------------

export async function updateQtd(id_usuario, id_produto, delta) {
    try {

        const carrinho = await getOrCreateCarrinho(id_usuario);

        let comando = `
            UPDATE carrinho_item
            SET qtd = qtd + ?
            WHERE id_carrinho = ? AND id_produto = ?
        `;

        await connection.query(comando, [delta, carrinho.id, id_produto]);

        // remove se ficar <= 0
        comando = `
            DELETE FROM carrinho_item
            WHERE id_carrinho = ? AND id_produto = ? AND qtd <= 0
        `;

        await connection.query(comando, [carrinho.id, id_produto]);

    } catch (err) {
        console.error("Erro no updateQtd:", err);
    }
}

//--------------------->DELETE<----------------

export async function deleteItem(id_usuario, id_produto) {
    try {

        const carrinho = await getOrCreateCarrinho(id_usuario);

        let comando = `
            DELETE FROM carrinho_item
            WHERE id_carrinho = ? AND id_produto = ?
        `;

        await connection.query(comando, [carrinho.id, id_produto]);

    } catch (err) {
        console.error("Erro no delete:", err);
    }
}


//Put




//Delete

