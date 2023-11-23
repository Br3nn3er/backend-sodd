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
import { Semestre } from "../../../../estrutura/infra/typeorm/entities/Semestre";
import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";
import { Cenario } from "../../../infra/typeorm/entities/Cenario";
import { CenarioFilaTurma } from "../../../infra/typeorm/entities/CenarioFilaTurma";
import { Fila } from "../../../infra/typeorm/entities/Fila";
import { FilaTurmaNew } from "../../../infra/typeorm/entities/FilaTurmaNew";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to cenario_fila_turma", () => {
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

    // semestre
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

    // cenario
    const cenario = new Cenario();
    cenario.descricao_cenario = "description_001";
    cenario.ano = 2021;
    cenario.semestre = 2;

    const cenario2 = new Cenario();
    cenario2.descricao_cenario = "description_002";
    cenario2.ano = 2021;
    cenario2.semestre = 2;

    await connection.manager.save(cenario);
    await connection.manager.save(cenario2);

    // curso
    const curso = new Curso();
    curso.codigo = "BCC";
    curso.nome = "Ciencia da Computacao";
    curso.unidade = "UFU";
    curso.campus = "udi";
    curso.permitir_choque_periodo = false;
    curso.permitir_choque_horario = false;

    const curso2 = new Curso();
    curso2.codigo = "BSI";
    curso2.nome = "Sistemas de Informacao";
    curso2.unidade = "UFU";
    curso2.campus = "udi";
    curso2.permitir_choque_periodo = false;
    curso2.permitir_choque_horario = false;

    await connection.manager.save(curso);
    await connection.manager.save(curso2);

    // disciplina
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
    disciplina2.codigo = "GSI011";
    disciplina2.nome = "Programacao Procedimental";
    disciplina2.ch_teorica = 4;
    disciplina2.ch_pratica = 0;
    disciplina2.ch_total = 4;
    disciplina2.curso = "BSI";
    disciplina2.temfila = true;
    disciplina2.periodo = 2;

    await connection.manager.save(disciplina);
    await connection.manager.save(disciplina2);

    // turma
    const turma1 = new Turma();
    turma1.codigo_disc = "BCC011";
    turma1.turma = "S";
    turma1.ano = 2021;
    turma1.semestre = 1;
    turma1.ch = 2;

    const turma2 = new Turma();
    turma2.codigo_disc = "GSI011";
    turma2.turma = "S";
    turma2.ano = 2021;
    turma2.semestre = 2;
    turma2.ch = 2;

    await connection.manager.save(turma1);
    await connection.manager.save(turma2);

    // professor
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
    professor2.siape = "10243110";
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

    await connection.manager.save(professor);
    await connection.manager.save(professor2);

    // fila
    const fila = new Fila();
    fila.siape = "10243110";
    fila.codigo_disc = "GSI011";
    fila.pos = 15;
    fila.prioridade = 1;
    fila.qte_ministrada = 3;
    fila.qte_maximo = 5;
    fila.ano = 2021;
    fila.semestre = 1;
    fila.status = 1;
    fila.periodo_preferencial = false;

    const fila2 = new Fila();
    fila2.siape = "1024301";
    fila2.codigo_disc = "BCC011";
    fila2.pos = 15;
    fila2.prioridade = 1;
    fila2.qte_ministrada = 3;
    fila2.qte_maximo = 5;
    fila2.ano = 2021;
    fila2.semestre = 1;
    fila2.status = 1;
    fila2.periodo_preferencial = false;

    await connection.manager.save(fila);
    await connection.manager.save(fila2);

    const filaTurma = new FilaTurmaNew();
    filaTurma.id_turma = 1;
    filaTurma.id_fila = 1;
    filaTurma.prioridade = 5;

    const filaTurma2 = new FilaTurmaNew();
    filaTurma2.id_turma = 1;
    filaTurma2.id_fila = 2;
    filaTurma2.prioridade = 5;

    await connection.manager.save(filaTurma);
    await connection.manager.save(filaTurma2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new cenario_fila_turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/cenario_fila_turma")
      .send({
        num_cenario: 1,
        id_turma: 1,
        id_fila: 1,
        status: 1,
        prioridade: 1,
        posicao: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as CenarioFilaTurma;

    expect(response.status).toBe(201);
    expect(responseResult.prioridade).toBe(1);
    expect(responseResult.status).toBe(1);
  });

  it("Should be able to read all cenario_fila_turma records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const cenarioFila = new CenarioFilaTurma();
    cenarioFila.num_cenario = 1;
    cenarioFila.id_turma = 1;
    cenarioFila.id_fila = 2;
    cenarioFila.status = 1;
    cenarioFila.prioridade = 1;
    cenarioFila.posicao = 1;

    await connection.manager.save(cenarioFila);

    const response = await request(app)
      .get("/cenario_fila_turma")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as CenarioFilaTurma[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a fila_turma_new record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const cenarioFila = new CenarioFilaTurma();
    cenarioFila.num_cenario = 2;
    cenarioFila.id_turma = 1;
    cenarioFila.id_fila = 2;
    cenarioFila.status = 1;
    cenarioFila.prioridade = 1;
    cenarioFila.posicao = 1;

    await connection.manager.save(cenarioFila);

    const response = await request(app)
      .patch("/cenario_fila_turma")
      .send({
        num_cenario: 2,
        id_turma: 1,
        id_fila: 2,
        prioridade: 15,
        posicao: 15,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as CenarioFilaTurma;

    expect(response.status).toBe(201);
    expect(responseResult.prioridade).toBe(15);
    expect(responseResult.posicao).toBe(15);
  });

  it("Should be able to delete a cenario_fila_turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const cenarioFila = new CenarioFilaTurma();
    cenarioFila.num_cenario = 2;
    cenarioFila.id_turma = 1;
    cenarioFila.id_fila = 1;
    cenarioFila.status = 15;
    cenarioFila.prioridade = 11;
    cenarioFila.posicao = 21;

    await connection.manager.save(cenarioFila);

    const response = await request(app)
      .delete("/cenario_fila_turma")
      .send({
        num_cenario: 2,
        id_turma: 1,
        id_fila: 1,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/cenario_fila_turma")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const cenarioFilas = responseGet.body as CenarioFilaTurma[];

    const filaDeleted = cenarioFilas.find(
      (cenarioFila) =>
        cenarioFila.num_cenario === 2 &&
        cenarioFila.id_turma === 1 &&
        cenarioFila.id_fila === 1
    );

    expect(response.status).toBe(201);
    expect(filaDeleted).toBeUndefined();
  });
});
