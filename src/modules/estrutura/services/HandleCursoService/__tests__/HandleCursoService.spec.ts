import { AppError } from "../../../../../shared/errors/AppError";
import { CursosRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/CursosRepositoryTestMock";
import { HandleCursoService } from "../HandleCursoService";

let cursosRepositoryTest: CursosRepositoryTestMock;
let handleCursosService: HandleCursoService;

describe("Handle CRUD operations related to a curso", () => {
  beforeEach(() => {
    cursosRepositoryTest = new CursosRepositoryTestMock();
    handleCursosService = new HandleCursoService(cursosRepositoryTest);
  });

  it("Should be able to create a new curso", async () => {
    const curso = await handleCursosService.create({
      codigo: "AAA",
      nome: "Engenharia Aerea",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    expect(curso.codigo).toBe("AAA");
    expect(curso.nome).toBe("Engenharia Aerea");
    expect(curso.permitir_choque_periodo).toBe(false);
  });

  it("Should not be able to create two cursos with same codigo", async () => {
    await expect(async () => {
      await handleCursosService.create({
        codigo: "AAA",
        nome: "Engenharia Aerea",
        unidade: "UFU",
        campus: "udi",
        permitir_choque_periodo: false,
        permitir_choque_horario: false,
      });

      await handleCursosService.create({
        codigo: "AAA",
        nome: "Engenharia Aerea Acrobatica",
        unidade: "UFU",
        campus: "udi",
        permitir_choque_periodo: false,
        permitir_choque_horario: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all cursos records", async () => {
    await handleCursosService.create({
      codigo: "AAA",
      nome: "Engenharia Aerea",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    await handleCursosService.create({
      codigo: "EAAA",
      nome: "Engenharia Aerea Acrobatica",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    const cursos = await handleCursosService.read();

    expect(cursos).toHaveLength(2);
  });

  it("Should be able to read only curso record", async () => {
    const course = await handleCursosService.create({
      codigo: "AAA",
      nome: "Engenharia Aerea",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    await handleCursosService.create({
      codigo: "EAAA",
      nome: "Engenharia Aerea Acrobatica",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    const response = await handleCursosService.readByCodigo(course.codigo);

    expect(response).toMatchObject(course);
  });

  it("Should be able to update an existing curso", async () => {
    await handleCursosService.create({
      codigo: "AAA",
      nome: "Engenharia Aerea",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    const curso = await handleCursosService.update({
      codigo: "AAA",
      nome: "Nova Engenharia",
      unidade: "UFU",
      campus: "umuarama",
      permitir_choque_periodo: true,
      permitir_choque_horario: true,
    });

    expect(curso.codigo).toBe("AAA");
    expect(curso.nome).toBe("Nova Engenharia");
    expect(curso.permitir_choque_periodo).toBe(true);
  });

  it("Should not be able to update an unexisting curso", async () => {
    await expect(async () => {
      await handleCursosService.update({
        codigo: "GSI000",
        nome: "Estrutura de Dados",
        unidade: "UFU",
        campus: "udi",
        permitir_choque_periodo: false,
        permitir_choque_horario: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete an existing curso", async () => {
    await handleCursosService.create({
      codigo: "AAA",
      nome: "Engenharia Aerea",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    await handleCursosService.create({
      codigo: "AAAAAA",
      nome: "Engenharia Nova",
      unidade: "UFU",
      campus: "udi",
      permitir_choque_periodo: false,
      permitir_choque_horario: false,
    });

    await handleCursosService.delete("AAA");

    const cursos = await handleCursosService.read();

    expect(cursos).toHaveLength(1);
  });
});
