import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";

let connection: Connection;

describe("Handle CRUD operations related to user", () => {
  beforeAll(async () => {
    connection = await dataSource.initialize();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
      values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to send an forgot password mail", async () => {
    const response = await request(app).post("/password/forgot").send({
      email: "sodd_tcc@outlook.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Email enviado!");
  }, 500000000);

  it("Should not be able to send an forgot password mail to an unexisting password", async () => {
    const response = await request(app).post("/password/forgot").send({
      email: "arufapwe@sil.sh",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Usuario nao existe!");
  }, 500000000);
});
