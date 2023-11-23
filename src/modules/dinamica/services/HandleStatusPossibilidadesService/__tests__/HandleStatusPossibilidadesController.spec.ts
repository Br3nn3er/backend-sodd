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
import { Cenario } from "../../../infra/typeorm/entities/Cenario";
import { Fila } from "../../../infra/typeorm/entities/Fila";
import { Possibilidades } from "../../../infra/typeorm/entities/Possibilidades";
import { StatusDistribuicao } from "../../../infra/typeorm/entities/StatusDistribuicao";
import { StatusPossibilidades } from "../../../infra/typeorm/entities/StatusPossibilidades";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to status_possibilidades", () => {
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

    // status_distribuicao
    const status = new StatusDistribuicao();
    status.id = 1;
    status.descricao = "description_002";

    const status2 = new StatusDistribuicao();
    status2.id = 2;
    status2.descricao = "description_003";

    await connection.manager.save(status);
    await connection.manager.save(status2);

    // semestres
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
    cenario.semestre = 1;

    const cenario2 = new Cenario();
    cenario2.descricao_cenario = "description_002";
    cenario2.ano = 2021;
    cenario2.semestre = 2;

    await connection.manager.save(cenario);
    await connection.manager.save(cenario2);

    // possibilidades
    const possibilidades = new Possibilidades();
    possibilidades.num_cenario = 1;
    possibilidades.descricao = "description_001";

    const possibilidades2 = new Possibilidades();
    possibilidades2.num_cenario = 2;
    possibilidades2.descricao = "description_002";

    await connection.manager.save(possibilidades);
    await connection.manager.save(possibilidades2);

    // professor
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

    await connection.manager.save(professor);
    await connection.manager.save(professor2);

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

    // fila
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

    const fila2 = new Fila();
    fila2.siape = "00100101";
    fila2.codigo_disc = "BCC012";
    fila2.pos = 30;
    fila2.prioridade = 2;
    fila2.qte_ministrada = 3;
    fila2.qte_maximo = 5;
    fila2.ano = 2021;
    fila2.semestre = 1;
    fila2.status = 1;
    fila2.periodo_preferencial = false;

    await connection.manager.save(fila);
    await connection.manager.save(fila2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new status_possibilidades record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/status_possibilidades")
      .send({
        id_fila: 1,
        id_possibilidade: 1,
        status: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as StatusPossibilidades;

    expect(response.status).toBe(201);
    expect(responseResult.status).toBe(1);
  });

  it("Should be able to read all status_possibilidades records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const statusPossibilidade = new StatusPossibilidades();
    statusPossibilidade.id_fila = 1;
    statusPossibilidade.id_possibilidade = 1;
    statusPossibilidade.status = 2;

    await connection.manager.save(statusPossibilidade);

    const response = await request(app)
      .get("/fila")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as StatusPossibilidades[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to delete a status_possibilidades record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const statusPossibilidade = new StatusPossibilidades();
    statusPossibilidade.id_fila = 2;
    statusPossibilidade.id_possibilidade = 2;
    statusPossibilidade.status = 2;

    await connection.manager.save(statusPossibilidade);

    const response = await request(app)
      .delete("/status_possibilidades")
      .send({
        id_fila: 2,
        id_possibilidade: 2,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/status_possibilidades")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const statusPossibilidades = responseGet.body as StatusPossibilidades[];

    const statusPossibilidadeDeleted = statusPossibilidades.find(
      (statusPossibilidade) =>
        statusPossibilidade.id_fila === 2 &&
        statusPossibilidade.id_possibilidade === 2
    );

    expect(response.status).toBe(201);
    expect(statusPossibilidadeDeleted).toBeUndefined();
  });
});
