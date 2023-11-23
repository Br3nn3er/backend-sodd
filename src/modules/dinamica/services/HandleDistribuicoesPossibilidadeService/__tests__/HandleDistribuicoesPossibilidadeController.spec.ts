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
import { DistribuicoesPossibilidade } from "../../../infra/typeorm/entities/DistribuicoesPossibilidade";
import { Possibilidades } from "../../../infra/typeorm/entities/Possibilidades";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to distribuicoes_possibilidade", () => {
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

    const possibilidades = new Possibilidades();
    possibilidades.num_cenario = 1;
    possibilidades.descricao = "description_001";

    await connection.manager.save(possibilidades);

    const possibilidades2 = new Possibilidades();
    possibilidades2.num_cenario = 2;
    possibilidades2.descricao = "description_002";

    await connection.manager.save(possibilidades2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new distribuicoes_possibilidade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/distribuicoes_possibilidade")
      .send({
        id_possibilidade: 1,
        siape: "00100101",
        id_turma: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as DistribuicoesPossibilidade;

    expect(response.status).toBe(201);
    expect(responseResult.siape).toBe("00100101");
  });

  it("Should be able to read all distribuicoes_possibilidade records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const dist = new DistribuicoesPossibilidade();
    dist.id_possibilidade = 1;
    dist.siape = "00100101";
    dist.id_turma = 2;

    await connection.manager.save(dist);

    const response = await request(app)
      .get("/distribuicoes_possibilidade")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as DistribuicoesPossibilidade[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to delete a distribuicoes_possibilidade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const dist = new DistribuicoesPossibilidade();
    dist.id_possibilidade = 2;
    dist.siape = "00100101";
    dist.id_turma = 2;

    await connection.manager.save(dist);

    const response = await request(app)
      .delete("/distribuicoes_possibilidade")
      .send({
        id_possibilidade: 2,
        siape: "00100101",
        id_turma: 2,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/distribuicoes_possibilidade")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const listDist = responseGet.body as DistribuicoesPossibilidade[];

    const distDeleted = listDist.find(
      (dist) =>
        dist.id_possibilidade === 2 &&
        dist.siape === "00100101" &&
        dist.id_turma === 2
    );

    expect(response.status).toBe(201);
    expect(distDeleted).toBeUndefined();
  });
});
