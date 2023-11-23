import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Professor } from "../../../infra/typeorm/entities/Professor";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to professor", () => {
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

  it("Should be able to create a new professor record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/professores")
      .send({
        siape: "1024300",
        nome: "Oscar Shelton",
        data_ingresso: dateProvider.processDateToUTC(new Date("2021-01-25")),
        data_nasc: dateProvider.processDateToUTC(new Date("1998-03-23")),
        afastado: true,
        regime: "de",
        carga_atual: 8,
        locacao: "udi",
        cnome: "OShelton",
        data_aposentadoria: dateProvider.processDateToUTC(
          new Date("2021-02-05")
        ),
        status: "ativo",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Professor;

    expect(response.status).toBe(201);
    expect(responseResult.nome).toBe("Oscar Shelton");
    expect(responseResult.afastado).toBe(true);
  });

  it("Should be able to read all professores records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/professores")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Professor[];

    expect(response.status).toBe(200);
    expect(responseResult).toHaveLength(1);
  });

  it("Should be able to read only professor record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const professor1 = new Professor();
    professor1.siape = "1024301";
    professor1.nome = "Professor 1";
    professor1.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor1.data_nasc = dateProvider.processDateToUTC(
      new Date("1998-03-23")
    );
    professor1.afastado = true;
    professor1.regime = "de";
    professor1.carga_atual = 8;
    professor1.locacao = "udi";
    professor1.cnome = "P1";
    professor1.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor1.status = "ativo";

    const professor2 = new Professor();
    professor2.siape = "1024302";
    professor2.nome = "Professor 2";
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
    professor2.cnome = "P2";
    professor2.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor2.status = "ativo";

    const [professor1InDataBase] = await connection.manager.save([
      professor1,
      professor2,
    ]);

    const response = await request(app)
      .get(`/professores/${professor1InDataBase.siape}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Professor;

    expect(response.status).toBe(200);
    expect(responseResult.siape).toStrictEqual(professor1InDataBase.siape);
  });

  it("Should be able to update a professor record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const professor = new Professor();
    professor.siape = "41787358";
    professor.nome = "Sam Dean";
    professor.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-03-23")
    );
    professor.data_nasc = dateProvider.processDateToUTC(new Date("1995-05-13"));
    professor.afastado = true;
    professor.regime = "de";
    professor.carga_atual = 8;
    professor.locacao = "udi";
    professor.cnome = "SDeans";
    professor.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor.status = "ativo";

    await connection.manager.save(professor);

    const response = await request(app)
      .patch("/professores")
      .send({
        siape: "41787358",
        nome: "Tony Stark",
        status: "suspenso",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Professor;

    expect(response.status).toBe(200);
    expect(responseResult.siape).toBe("41787358");
    expect(responseResult.nome).toBe("Tony Stark");
    expect(responseResult.status).toBe("suspenso");
  });

  it("Should be able to delete a professor record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const professor = new Professor();
    professor.siape = "33856050";
    professor.nome = "Steve Perez";
    professor.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor.data_nasc = dateProvider.processDateToUTC(new Date("1998-03-23"));
    professor.afastado = true;
    professor.regime = "de";
    professor.carga_atual = 8;
    professor.locacao = "mc";
    professor.cnome = "SPerez";
    professor.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor.status = "ativo";

    await connection.manager.save(professor);

    const response = await request(app)
      .delete("/professores/33856050")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/professores")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const professores = responseGet.body as Professor[];

    const professorDeleted = professores.find(
      (professor) => professor.siape === "33856050"
    );

    expect(response.status).toBe(200);
    expect(professorDeleted).toBeUndefined();
  });
});
