import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Curso } from "../../../infra/typeorm/entities/Curso";
import { Disciplina } from "../../../infra/typeorm/entities/Disciplina";
import { Horario } from "../../../infra/typeorm/entities/Horario";
import { Ministra } from "../../../infra/typeorm/entities/Ministra";
import { Professor } from "../../../infra/typeorm/entities/Professor";
import { Turma } from "../../../infra/typeorm/entities/Turma";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to ministra", () => {
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

    const curso = new Curso();
    curso.codigo = "BCC";
    curso.nome = "Ciencia da Computacao";
    curso.unidade = "UFU";
    curso.campus = "udi";
    curso.permitir_choque_periodo = false;
    curso.permitir_choque_horario = false;

    await connection.manager.save(curso);

    const disciplina = new Disciplina();
    disciplina.codigo = "BCC011";
    disciplina.nome = "Introdução à Ciencia";
    disciplina.ch_teorica = 4;
    disciplina.ch_pratica = 0;
    disciplina.ch_total = 4;
    disciplina.curso = "BCC";
    disciplina.temfila = true;
    disciplina.periodo = 2;

    const disciplina2 = new Disciplina();
    disciplina2.codigo = "BCC012";
    disciplina2.nome = "Programacao Procedimental";
    disciplina2.ch_teorica = 4;
    disciplina2.ch_pratica = 0;
    disciplina2.ch_total = 4;
    disciplina2.curso = "BCC";
    disciplina2.temfila = true;
    disciplina2.periodo = 2;

    await connection.manager.save(disciplina);
    await connection.manager.save(disciplina2);

    const turma1 = new Turma();
    turma1.codigo_disc = "BCC012";
    turma1.turma = "S";
    turma1.ano = 2018;
    turma1.semestre = 1;
    turma1.ch = 2;

    const turma2 = new Turma();
    turma2.codigo_disc = "BCC011";
    turma2.turma = "S";
    turma2.ano = 2018;
    turma2.semestre = 2;
    turma2.ch = 2;

    await connection.manager.save(turma1);
    await connection.manager.save(turma2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new ministra relationship", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/ministra")
      .send({
        siape: "1024301",
        id_turma: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Ministra;

    expect(response.status).toBe(201);
    expect(responseResult.siape).toBe("1024301");
  });

  it("Should be able to read all ministra records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const ministra = new Ministra();
    ministra.siape = "1024300";
    ministra.id_turma = "1";

    await connection.manager.save(ministra);

    const response = await request(app)
      .get("/ministra")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Horario[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to delete a ministra record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const ministra = new Ministra();
    ministra.siape = "1024300";
    ministra.id_turma = "2";

    await connection.manager.save(ministra);

    const response = await request(app)
      .delete("/ministra")
      .send({
        siape: "1024300",
        id_turma: 2,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/ministra")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const ministraList = responseGet.body as Ministra[];

    const ministraDeleted = ministraList.find(
      (ministra) => ministra.siape === "1024300" && ministra.id_turma === "2"
    );

    expect(response.status).toBe(201);
    expect(ministraDeleted).toBeUndefined();
  });
});
