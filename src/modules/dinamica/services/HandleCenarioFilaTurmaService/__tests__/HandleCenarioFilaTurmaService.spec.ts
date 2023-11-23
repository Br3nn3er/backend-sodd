import { AppError } from "../../../../../shared/errors/AppError";
import { CenarioFilaTurmaRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/CenarioFilaTurmaRepositoryTestMock";
import { HandleCenarioFilaTurmaService } from "../HandleCenarioFilaTurmaService";

describe("Handle CRUD operations related to cenario_fila_turma", () => {
  let cenarioFilaRepositoryTest: CenarioFilaTurmaRepositoryTestMock;
  let handleCenarioFilaTurmaService: HandleCenarioFilaTurmaService;

  beforeEach(() => {
    cenarioFilaRepositoryTest = new CenarioFilaTurmaRepositoryTestMock();
    handleCenarioFilaTurmaService = new HandleCenarioFilaTurmaService(
      cenarioFilaRepositoryTest
    );
  });

  it("Should be able to create a new cenario_fila_turma record", async () => {
    const cenarioFila = await handleCenarioFilaTurmaService.create({
      num_cenario: 1,
      id_turma: 570,
      id_fila: 7000,
      status: 1,
      prioridade: 1,
      posicao: 1,
    });

    expect(cenarioFila.id_fila).toBe(7000);
    expect(cenarioFila.status).toBe(1);
  });

  it("Should not be able to create an existing cenario_fila_turma record", async () => {
    await expect(async () => {
      await handleCenarioFilaTurmaService.create({
        num_cenario: 1,
        id_turma: 570,
        id_fila: 7000,
        status: 1,
        prioridade: 1,
        posicao: 1,
      });

      await handleCenarioFilaTurmaService.create({
        num_cenario: 1,
        id_turma: 570,
        id_fila: 7000,
        status: 1,
        prioridade: 1,
        posicao: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all cenario_fila_turma records", async () => {
    await handleCenarioFilaTurmaService.create({
      num_cenario: 1,
      id_turma: 570,
      id_fila: 7000,
      status: 1,
      prioridade: 1,
      posicao: 1,
    });

    await handleCenarioFilaTurmaService.create({
      num_cenario: 2,
      id_turma: 300,
      id_fila: 7001,
      status: 1,
      prioridade: 1,
      posicao: 1,
    });

    const cenarioFilas = await handleCenarioFilaTurmaService.read();

    expect(cenarioFilas).toHaveLength(2);
  });

  it("Should be able to update an existing cenario_fila_turma record", async () => {
    await handleCenarioFilaTurmaService.create({
      num_cenario: 1,
      id_turma: 570,
      id_fila: 7000,
      status: 1,
      prioridade: 1,
      posicao: 1,
    });

    await handleCenarioFilaTurmaService.update({
      num_cenario: 1,
      id_turma: 570,
      id_fila: 7000,
      status: 15,
      posicao: 11,
    });

    const cenarioFilaResult =
      await cenarioFilaRepositoryTest.queryByCenarioETurmaEFila(1, 570, 7000);

    expect(cenarioFilaResult.status).toBe(15);
    expect(cenarioFilaResult.posicao).toBe(11);
  });

  it("Should not be able to update an unexisting cenario_fila_turma record", async () => {
    await expect(async () => {
      await handleCenarioFilaTurmaService.update({
        num_cenario: 1111,
        id_turma: 570,
        id_fila: 7000,
        status: 15,
        posicao: 11,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a cenario_fila_turma record", async () => {
    await handleCenarioFilaTurmaService.create({
      num_cenario: 11,
      id_turma: 571,
      id_fila: 7001,
      status: 1,
      prioridade: 1,
      posicao: 1,
    });

    await handleCenarioFilaTurmaService.delete(11, 571, 7001);

    const cenarioFilas = await cenarioFilaRepositoryTest.listCenarios();

    expect(cenarioFilas).toHaveLength(0);
  });
});
