import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { CargaDocente } from "../../../infra/typeorm/entities/CargaDocente";
import { Professor } from "../../../infra/typeorm/entities/Professor";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to carga docente", () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new carga docente record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

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

    const response = await request(app)
      .post("/cargas")
      .send({
        siape: "1024300",
        carga_atual: 16,
        ano: 2015,
        semestre: 2,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as CargaDocente;

    expect(response.status).toBe(201);
    expect(responseResult.siape).toBe("1024300");
  });

  it("Should not be able to create an existing carga docente record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/cargas")
      .send({
        siape: "1024300",
        carga_atual: 16,
        ano: 2015,
        semestre: 2,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Já existe uma carga para este siape!");
  });

  it("Should be able to read all carga docente records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/cargas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as CargaDocente[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(1);
  });

  it("Should be able to update a carga docente record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const professor = new Professor();
    professor.siape = "1024301";
    professor.nome = "Jay Andrews";
    professor.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor.data_nasc = dateProvider.processDateToUTC(new Date("1998-03-23"));
    professor.afastado = true;
    professor.regime = "de";
    professor.carga_atual = 8;
    professor.locacao = "udi";
    professor.cnome = "JAndrews";
    professor.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor.status = "ativo";

    await connection.manager.save(professor);

    const carga = new CargaDocente();
    carga.siape = "1024301";
    carga.carga_atual = 15;
    carga.ano = 2015;
    carga.semestre = 1;

    await connection.manager.save(carga);

    const response = await request(app)
      .patch("/cargas")
      .send({
        siape: "1024301",
        carga_atual: 16,
        ano: 2020,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as CargaDocente;

    expect(response.status).toBe(201);
    expect(responseResult.ano).toBe(2020);
  });

  it("Should be able to update an unexisting carga docente", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .patch("/cargas")
      .send({
        siape: "212889",
        carga_atual: 16,
        ano: 2020,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Não há uma carga para este siape!");
  });

  it("Should be able to delete a carga docente record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const professor = new Professor();
    professor.siape = "721246";
    professor.nome = "Tillie Lloyd";
    professor.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor.data_nasc = dateProvider.processDateToUTC(new Date("1998-03-23"));
    professor.afastado = true;
    professor.regime = "de";
    professor.carga_atual = 8;
    professor.locacao = "udi";
    professor.cnome = "TLloyd";
    professor.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor.status = "ativo";

    await connection.manager.save(professor);

    const carga = new CargaDocente();
    carga.siape = "721246";
    carga.carga_atual = 15;
    carga.ano = 2015;
    carga.semestre = 1;

    await connection.manager.save(carga);

    const response = await request(app)
      .delete("/cargas/721246")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/cargas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const cargas = responseGet.body as CargaDocente[];

    const cargaDeleted = cargas.find((carga) => carga.siape === "721246");

    expect(response.status).toBe(201);
    expect(cargaDeleted).toBeUndefined();
  });
});
