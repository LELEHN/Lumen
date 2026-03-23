import "dotenv/config.js";
import express from "express";
import cors from "cors";

import { rotas } from "./routes.js";

const servidor = express();

servidor.use(cors());
servidor.use(express.json());


rotas(servidor);

let PORT = process.env.PORT;

servidor.listen(PORT, () => {
  console.log(`A porta ${PORT} está aberta`);
});