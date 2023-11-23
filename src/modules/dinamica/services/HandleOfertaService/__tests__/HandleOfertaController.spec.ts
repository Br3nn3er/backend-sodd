import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Curso } from "../../../../estrutura/infra/typeorm/entities/Curso";
import { Disciplina } from "../../../../estrutura/infra/typeorm/entities/Disciplina";
import { Horario } from "../../../../estrutura/infra/typeorm/entities/Horario";
import { Semana } from "../../../../estrutura/infra/typeorm/entities/Semana";
import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";
import { Oferta } from "../../../infra/typeorm/entities/Oferta";

let connection: Connection;

describe("Handle CRUD routes related to oferta", () => {
  beforeAll(async () => {
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

    const disciplina = new Disciplina();
    disciplina.codigo = "GSI011";
    disciplina.nome = "Profissões";
    disciplina.ch_teorica = 4;
    disciplina.ch_pratica = 0;
    disciplina.ch_total = 4;
    disciplina.curso = "BSI";
    disciplina.temfila = true;
    disciplina.periodo = 2;

    const disciplina2 = new Disciplina();
    disciplina2.codigo = "BCC011";
    disciplina2.nome = "Profissões";
    disciplina2.ch_teorica = 4;
    disciplina2.ch_pratica = 0;
    disciplina2.ch_total = 4;
    disciplina2.curso = "BCC";
    disciplina2.temfila = true;
    disciplina2.periodo = 2;

    await connection.manager.save(disciplina);
    await connection.manager.save(disciplina2);

    const turma = new Turma();
    turma.codigo_disc = "BCC011";
    turma.turma = "Z";
    turma.ch = 4;
    turma.ano = 2021;
    turma.semestre = 2;

    await connection.manager.save(turma);

    const turma2 = new Turma();
    turma2.codigo_disc = "GSI011";
    turma2.turma = "Z";
    turma2.ch = 4;
    turma2.ano = 2021;
    turma2.semestre = 2;

    await connection.manager.save(turma);
    await connection.manager.save(turma2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new oferta record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/oferta")
      .send({
        dia: "1",
        letra: "a",
        id_turma: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Oferta;

    expect(response.status).toBe(201);
    expect(responseResult.letra).toBe("a");
    expect(responseResult.id_turma).toBe(1);
  });

  it("Should be able to read all oferta records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const oferta = new Oferta();
    oferta.dia = "2";
    oferta.letra = "b";
    oferta.id_turma = 1;

    await connection.manager.save(oferta);

    const response = await request(app)
      .get("/oferta")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Oferta[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to delete a oferta record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const oferta = new Oferta();
    oferta.dia = "2";
    oferta.letra = "a";
    oferta.id_turma = 2;

    await connection.manager.save(oferta);

    const response = await request(app)
      .delete("/oferta/3")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/oferta")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const ofertas = responseGet.body as Oferta[];

    const ofertaDeleted = ofertas.find((oferta) => oferta.id === "3");

    expect(response.status).toBe(201);
    expect(ofertaDeleted).toBeUndefined();
  });
});
