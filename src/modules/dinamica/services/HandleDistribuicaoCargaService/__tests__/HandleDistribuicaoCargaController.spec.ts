import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Semestre } from "../../../../estrutura/infra/typeorm/entities/Semestre";
import { Cenario } from "../../../infra/typeorm/entities/Cenario";
import { DistribuicaoCarga } from "../../../infra/typeorm/entities/DistribuicaoCarga";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to distribuicao_carga", () => {
  beforeAll(async () => {
    dateProvider = new DayjsDateProvider();
    connection = await dataSource.initialize();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
      values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
    );

    const semestre1 = new Semestre();
    semestre1.ano = 2021;
    semestre1.semestre = 1;
    semestre1.status = false;

    const semestre2 = new Semestre();
    semestre2.ano = 2021;
    semestre2.semestre = 2;
    semestre2.status = true;

    await connection.manager.save(semestre1);
    await connection.manager.save(semestre2);

    const cenario = new Cenario();
    cenario.descricao_cenario = "description_001";
    cenario.ano = 2021;
    cenario.semestre = 1;

    await connection.manager.save(cenario);

    const cenario2 = new Cenario();
    cenario2.descricao_cenario = "description_002";
    cenario2.ano = 2021;
    cenario2.semestre = 2;

    await connection.manager.save(cenario2);

    const professor = new Professor();
    professor.siape = "1024300";
    professor.nome = "Oscar Shelton";
    professor.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor.data_nasc = dateProvider.processDateToUTC(new Date("1998-03-23"));
    professor.afastado = true;
    professor.regime = "de";
    professor.carga_atual = 8;
    professor.locacao = "udi";
    professor.cnome = "OShelton";
    professor.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor.status = "ativo";

    await connection.manager.save(professor);

    const professor2 = new Professor();
    professor2.siape = "00100101";
    professor2.nome = "Oscar Shelton";
    professor2.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor2.data_nasc = dateProvider.processDateToUTC(
      new Date("1998-03-23")
    );
    professor2.afastado = true;
    professor2.regime = "de";
    professor2.carga_atual = 8;
    professor2.locacao = "udi";
    professor2.cnome = "OShelton";
    professor2.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor2.status = "ativo";

    await connection.manager.save(professor2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new distribuicao_carga record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/distribuicao_carga")
      .send({
        cenario: 1,
        siape: "1024300",
        regra: "rule_001",
        carga: 40,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as DistribuicaoCarga;

    expect(response.status).toBe(201);
    expect(responseResult.siape).toBe("1024300");
  });

  it("Should be able to read all distribuicao_carga records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const dist = new DistribuicaoCarga();
    dist.cenario = 2;
    dist.siape = "1024300";
    dist.regra = "rule_002";
    dist.carga = 40;

    await connection.manager.save(dist);

    const response = await request(app)
      .get("/distribuicao_carga")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as DistribuicaoCarga[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a distribuicao_carga record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const dist = new DistribuicaoCarga();
    dist.cenario = 1;
    dist.siape = "00100101";
    dist.regra = "rule_003";
    dist.carga = 60;

    await connection.manager.save(dist);

    const response = await request(app)
      .patch("/distribuicao_carga")
      .send({
        cenario: 1,
        siape: "00100101",
        regra: "rule_003",
        carga: 40,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as DistribuicaoCarga;

    expect(response.status).toBe(201);
    expect(responseResult.carga).toBe(40);
  });

  it("Should be able to delete a distribuicao_carga record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const dist = new DistribuicaoCarga();
    dist.cenario = 2;
    dist.siape = "00100101";
    dist.regra = "rule_003";
    dist.carga = 60;

    await connection.manager.save(dist);

    const response = await request(app)
      .delete("/distribuicao_carga")
      .send({
        cenario: 2,
        siape: "00100101",
        regra: "rule_003",
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/distribuicao_carga")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const listDist = responseGet.body as DistribuicaoCarga[];

    const distDeleted = listDist.find(
      (dist) =>
        dist.cenario === 2 &&
        dist.siape === "00100101" &&
        dist.regra === "rule_003"
    );

    expect(response.status).toBe(201);
    expect(distDeleted).toBeUndefined();
  });
});
