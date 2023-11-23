import { app } from "./app";
import "reflect-metadata";
import "dotenv/config";
import { dataSource } from "../typeorm";

const PORT = process.env.PORT || 3333;

dataSource.initialize().then(() => {
  const server = app.listen(PORT, () => {
    return console.log(`Server is Running: ${PORT} ! 🏆`);
  });
});
