export function rotas(servidor) {

  servidor.get("/", (req, res) => {
    res.send("API funcionando");
  });

}