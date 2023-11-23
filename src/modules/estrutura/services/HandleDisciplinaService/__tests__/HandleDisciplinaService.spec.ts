import { AppError } from "../../../../../shared/errors/AppError";
import { DisciplinasRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/DisciplinasRepositoryTestMock";
import { HandleDisciplinaService } from "../HandleDisciplinaService";

describe("Handle CRUD operations related to Disciplina", () => {
  let disciplinasRepositoryTest: DisciplinasRepositoryTestMock;
  let handleDisciplinaService: HandleDisciplinaService;

  beforeEach(() => {
    disciplinasRepositoryTest = new DisciplinasRepositoryTestMock();
    handleDisciplinaService = new HandleDisciplinaService(
      disciplinasRepositoryTest
    );
  });

  it("Should be able to create a disciplina", async () => {
    const disciplina = await handleDisciplinaService.create({
      codigo: "FACOM0001",
      nome: "Interação Humano-Computador",
      ch_teorica: 4,
      ch_pratica: 0,
      ch_total: 4,
      curso: "BCC",
      temfila: true,
      periodo: 2,
      cod_antigo: null,
    });

    expect(disciplina.codigo).toBe("FACOM0001");
    expect(disciplina.ch_teorica).toBe(4);
    expect(disciplina.curso).toBe("BCC");
  });

  it("Should not be able to create a disciplina with same codigo", async () => {
    await expect(async () => {
      await handleDisciplinaService.create({
        codigo: "FACOM0001",
        nome: "Interação Humano-Computador",
        ch_teorica: 4,
        ch_pratica: 0,
        ch_total: 4,
        curso: "BCC",
        temfila: true,
        periodo: 2,
        cod_antigo: null,
      });

      await handleDisciplinaService.create({
        codigo: "FACOM0001",
        nome: "Outra Disciplina",
        ch_teorica: 4,
        ch_pratica: 0,
        ch_total: 4,
        curso: "BCC",
        temfila: true,
        periodo: 2,
        cod_antigo: null,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all disciplina records", async () => {
    await handleDisciplinaService.create({
      codigo: "FACOM0001",
      nome: "Interação Humano-Computador",
      ch_teorica: 4,
      ch_pratica: 0,
      ch_total: 4,
      curso: "BCC",
      temfila: true,
      periodo: 2,
      cod_antigo: null,
    });

    await handleDisciplinaService.create({
      codigo: "FACOM0002",
      nome: "Interação Computador-Humano",
      ch_teorica: 4,
      ch_pratica: 0,
      ch_total: 4,
      curso: "BCC",
      temfila: true,
      periodo: 2,
      cod_antigo: null,
    });

    const disciplinas = await handleDisciplinaService.read();

    expect(disciplinas).toHaveLength(2);
  });

  it("Should be able to read only disciplina record", async () => {
    const disciplina = await handleDisciplinaService.create({
      codigo: "FACOM0001",
      nome: "Interação Humano-Computador",
      ch_teorica: 4,
      ch_pratica: 0,
      ch_total: 4,
      curso: "BCC",
      temfila: true,
      periodo: 2,
      cod_antigo: null,
    });

    await handleDisciplinaService.create({
      codigo: "FACOM0002",
      nome: "Interação Computador-Humano",
      ch_teorica: 4,
      ch_pratica: 0,
      ch_total: 4,
      curso: "BCC",
      temfila: true,
      periodo: 2,
      cod_antigo: null,
    });

    const response = await handleDisciplinaService.readByCodigo(
      disciplina.codigo
    );

    expect(response).toMatchObject(disciplina);
  });

  it("Should be able to update a disciplina record", async () => {
    await handleDisciplinaService.create({
      codigo: "FACOM0001",
      nome: "Estrutura de Dados",
      ch_teorica: 3,
      ch_pratica: 1,
      ch_total: 4,
      curso: "BSI",
      temfila: false,
      periodo: 2,
      cod_antigo: null,
    });

    const disciplina = await handleDisciplinaService.update({
      codigo: "FACOM0001",
      nome: "Interação Humano-Computador",
      ch_teorica: 4,
      ch_pratica: 0,
      ch_total: 4,
      curso: "BCC",
      temfila: true,
      periodo: 2,
    });

    expect(disciplina.codigo).toBe("FACOM0001");
    expect(disciplina.ch_teorica).toBe(4);
    expect(disciplina.curso).toBe("BCC");
  });

  it("Should not be able to update a nonexisting disciplina record", async () => {
    await expect(async () => {
      await handleDisciplinaService.update({
        codigo: "2613020762",
        nome: "Interação Humano-Computador",
        ch_teorica: 4,
        ch_pratica: 0,
        ch_total: 4,
        curso: "BCC",
        temfila: true,
        periodo: 2,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a disciplina record", async () => {
    await handleDisciplinaService.create({
      codigo: "FACOM0001",
      nome: "Interação Humano-Computador",
      ch_teorica: 4,
      ch_pratica: 0,
      ch_total: 4,
      curso: "BCC",
      temfila: true,
      periodo: 2,
      cod_antigo: null,
    });

    await handleDisciplinaService.delete("FACOM0001");

    const disciplinas = await handleDisciplinaService.read();

    expect(disciplinas).toHaveLength(0);
  });
});
