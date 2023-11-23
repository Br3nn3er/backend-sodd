import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Curso } from "../../../../estrutura/infra/typeorm/entities/Curso";
import { Disciplina } from "../../../../estrutura/infra/typeorm/entities/Disciplina";
import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";
import { Fila } from "../../../infra/typeorm/entities/Fila";
import { FilaTurma } from "../../../infra/typeorm/entities/FilaTurma";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to fila_turma", () => {
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
    turma1.codigo_disc = "BCC011";
    turma1.turma = "S";
    turma1.ano = 2018;
    turma1.semestre = 1;
    turma1.ch = 2;

    const turma2 = new Turma();
    turma2.codigo_disc = "BCC012";
    turma2.turma = "S";
    turma2.ano = 2018;
    turma2.semestre = 2;
    turma2.ch = 2;

    await connection.manager.save(turma1);
    await connection.manager.save(turma2);

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

    const fila = new Fila();
    fila.siape = "1024300";
    fila.codigo_disc = "BCC012";
    fila.pos = 15;
    fila.prioridade = 1;
    fila.qte_ministrada = 3;
    fila.qte_maximo = 5;
    fila.ano = 2021;
    fila.semestre = 1;
    fila.status = 1;
    fila.periodo_preferencial = false;

    await connection.manager.save(fila);

    const fila2 = new Fila();
    fila2.siape = "00100101";
    fila2.codigo_disc = "BCC011";
    fila2.pos = 15;
    fila2.prioridade = 1;
    fila2.qte_ministrada = 3;
    fila2.qte_maximo = 5;
    fila2.ano = 2021;
    fila2.semestre = 1;
    fila2.status = 1;
    fila2.periodo_preferencial = false;

    await connection.manager.save(fila2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new fila_turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/fila_turma")
      .send({
        id_turma: 1,
        id_fila: 1,
        prioridade: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as FilaTurma;

    expect(response.status).toBe(201);
    expect(responseResult.id_turma).toBe(1);
  });

  it("Should be able to read all fila_turma records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const fila = new FilaTurma();
    fila.id_turma = 1;
    fila.id = 2;
    fila.prioridade = 5;

    await connection.manager.save(fila);

    const response = await request(app)
      .get("/fila_turma")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as FilaTurma[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a fila_turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const fila = new FilaTurma();
    fila.id_turma = 2;
    fila.id = 1;
    fila.prioridade = 15;

    await connection.manager.save(fila);

    const response = await request(app)
      .patch("/fila_turma")
      .send({
        id_turma: 2,
        id_fila: 1,
        prioridade: 6,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as FilaTurma;

    expect(response.status).toBe(201);
    expect(responseResult.prioridade).toBe(6);
  });

  it("Should be able to delete a fila_turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const fila = new FilaTurma();
    fila.id_turma = 2;
    fila.id = 2;
    fila.prioridade = 15;

    await connection.manager.save(fila);

    const response = await request(app)
      .delete("/fila_turma")
      .send({
        id_turma: 2,
        id_fila: 2,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/fila_turma")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const filas = responseGet.body as FilaTurma[];

    const filaDeleted = filas.find(
      (fila) => fila.id_turma === 2 && fila.id === 2
    );

    expect(response.status).toBe(201);
    expect(filaDeleted).toBeUndefined();
  });
});
