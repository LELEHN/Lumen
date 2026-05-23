import connection from "./connection.js";

export async function salvarCliente(usuario) {
  try {
    const comando = `INSERT INTO usuario(nome, email, senha, cargo) 
      VALUES(?, ?, MD5(?), 'cliente')`;
    let [info] = await connection.query(comando, [
      usuario.nome,
      usuario.email,
      usuario.senha,
    ]);
    return info.insertId;
  } catch (err) {
    console.error("Deu erro no banco de dados. ", err);
  }
}

export async function verificarUsuario(usuario) {
  const comando = `SELECT * FROM usuario WHERE email = ? AND senha = MD5(?)`;
  let [info] = await connection.query(comando, [usuario.email, usuario.senha]);
  return info;
}

export async function buscarUsuarioPorId(id) {
  const [rows] = await connection.query(
    `SELECT id, nome, email, telefone, endereco, cargo, foto FROM usuario WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function atualizarFotoUsuario(id, foto) {
  await connection.query(`UPDATE usuario SET foto = ? WHERE id = ?`, [foto, id]);
}

// ✅ NOVO: atualiza nome, telefone e endereço
export async function atualizarInfoUsuario(id, nome, telefone, endereco) {
  await connection.query(
    `UPDATE usuario SET nome = ?, telefone = ?, endereco = ? WHERE id = ?`,
    [nome, telefone, endereco, id]
  );
}