import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Horario } from "../../../../estrutura/infra/typeorm/entities/Horario";
import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Semana } from "../../../../estrutura/infra/typeorm/entities/Semana";
import { Restricoes } from "../../../infra/typeorm/entities/Restricoes";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to restricoes", () => {
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

    const semana = new Semana();
    semana.dia = "1";
    semana.descricao = "Segunda-feira";

    const semana2 = new Semana();
    semana2.dia = "2";
    semana2.descricao = "Terça-feira";

    await connection.manager.save(semana);
    await connection.manager.save(semana2);

    const horario = new Horario();
    horario.letra = "a";
    horario.hora_inicio = "08:50:00";
    horario.hora_fim = "10:40:00";
    horario.turno = "MANHÃ";

    const horario2 = new Horario();
    horario2.letra = "b";
    horario2.hora_inicio = "10:40:00";
    horario2.hora_fim = "12:20:00";
    horario2.turno = "MANHÃ";

    await connection.manager.save(horario);
    await connection.manager.save(horario2);

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

    const professor2 = new Professor();
    professor2.siape = "1024300";
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
    professor.status = "ativo";

    await connection.manager.save(professor);
    await connection.manager.save(professor2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new restricoes record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/restricoes")
      .send({
        siape: "1024301",
        dia: "1",
        letra: "a",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Restricoes;

    expect(response.status).toBe(201);
    expect(responseResult.siape).toBe("1024301");
  });

  it("Should be able to read all restricoes records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const restricoes = new Restricoes();
    restricoes.siape = "1024301";
    restricoes.dia = "2";
    restricoes.letra = "b";

    await connection.manager.save(restricoes);

    const response = await request(app)
      .get("/restricoes")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Restricoes[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to delete a restricoes record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const restricoes = new Restricoes();
    restricoes.siape = "1024301";
    restricoes.dia = "2";
    restricoes.letra = "a";

    await connection.manager.save(restricoes);

    const response = await request(app)
      .delete("/restricoes")
      .send({
        siape: "1024301",
        dia: "2",
        letra: "a",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/restricoes")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const listAtribuicoes = responseGet.body as Restricoes[];

    const atribuicaoDeleted = listAtribuicoes.find(
      (atribuicao) =>
        atribuicao.siape === "1024301" &&
        atribuicao.dia === "2" &&
        atribuicao.letra === "a"
    );

    expect(response.status).toBe(201);
    expect(atribuicaoDeleted).toBeUndefined();
  });
});
