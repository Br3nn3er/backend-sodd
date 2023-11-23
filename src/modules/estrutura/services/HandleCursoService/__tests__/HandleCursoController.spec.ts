import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Curso } from "../../../infra/typeorm/entities/Curso";

let connection: Connection;

describe("Handle CRUD routes related to cursos", () => {
  beforeAll(async () => {
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

  it("Should be able to create a new curso record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/cursos")
      .send({
        codigo: "AAA",
        nome: "Engenharia Aero",
        unidade: "UFU",
        campus: "udi",
        permitir_choque_periodo: true,
        permitir_choque_horario: false,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Curso;

    expect(response.status).toBe(201);
    expect(responseResult.codigo).toBe("AAA");
    expect(responseResult.permitir_choque_periodo).toBe(true);
  });

  it("Should be able to read all cursos records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const curso = new Curso();
    curso.codigo = "BCC";
    curso.nome = "Ciencia da Computacao";
    curso.unidade = "UFU";
    curso.campus = "udi";
    curso.permitir_choque_periodo = false;
    curso.permitir_choque_horario = false;

    await connection.manager.save(curso);

    const response = await request(app)
      .get("/cursos")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Curso[];

    expect(response.status).toBe(200);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to read only curso record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const bccCurso = new Curso();
    bccCurso.codigo = "BCC_2";
    bccCurso.nome = "Ciencia da Computacao";
    bccCurso.unidade = "UFU";
    bccCurso.campus = "udi";
    bccCurso.permitir_choque_periodo = false;
    bccCurso.permitir_choque_horario = false;

    const bsiCurso = new Curso();
    bsiCurso.codigo = "BSI_2";
    bsiCurso.nome = "Ciencia da Computacao";
    bsiCurso.unidade = "UFU";
    bsiCurso.campus = "udi";
    bsiCurso.permitir_choque_periodo = false;
    bsiCurso.permitir_choque_horario = false;

    const [courseInDataBase] = await connection.manager.save([
      bccCurso,
      bsiCurso,
    ]);

    const response = await request(app)
      .get(`/cursos/${bccCurso.codigo}`)
      .send()
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.codigo).toStrictEqual(courseInDataBase.codigo);
  });

  it("Should be able to update a curso record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const curso = new Curso();
    curso.codigo = "ODO";
    curso.nome = "Odontologia";
    curso.unidade = "UFU";
    curso.campus = "udi";
    curso.permitir_choque_periodo = true;
    curso.permitir_choque_horario = false;

    await connection.manager.save(curso);

    const response = await request(app)
      .patch("/cursos")
      .send({
        codigo: "ODO",
        nome: "Odontologia Umuarama",
        permitir_choque_horario: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Curso;

    expect(response.status).toBe(200);
    expect(responseResult.nome).toBe("Odontologia Umuarama");
    expect(responseResult.permitir_choque_horario).toBe(true);
  });

  it("Should be able to delete a curso record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const curso = new Curso();
    curso.codigo = "BSI";
    curso.nome = "Sistemas de Informação";
    curso.unidade = "UFU";
    curso.campus = "udi";
    curso.permitir_choque_periodo = false;
    curso.permitir_choque_horario = false;

    await connection.manager.save(curso);

    const response = await request(app)
      .delete("/cursos/BSI")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/cursos")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const cursos = responseGet.body as Curso[];

    const cursoDeleted = cursos.find((curso) => curso.codigo === "BSI");

    expect(response.status).toBe(200);
    expect(cursoDeleted).toBeUndefined();
  });
});
