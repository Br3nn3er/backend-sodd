import { AppError } from "../../../../../shared/errors/AppError";
import { SemestresRepositoryTestMock } from "../../../../estrutura/infra/typeorm/repositories/mocks/SemestresRepositoryTestMock";
import { HandleSemestreService } from "../../../../estrutura/services/HandleSemestreService/HandleSemestreService";
import { FilaTurmaNewRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/FilaTurmaNewRepositoryTestMock";
import { HandleFilaTurmaNewService } from "../HandleFilaTurmaNewService";

describe("Handle CRUD operations related to fila_turma_new", () => {
  let filaRepositoryTest: FilaTurmaNewRepositoryTestMock;
  let handleFilaTurmaNewService: HandleFilaTurmaNewService;
  let semestreRepositoryTest: SemestresRepositoryTestMock;
  let handleSemestreService: HandleSemestreService;
  beforeEach(() => {
    filaRepositoryTest = new FilaTurmaNewRepositoryTestMock();
    handleFilaTurmaNewService = new HandleFilaTurmaNewService(
      filaRepositoryTest,
      semestreRepositoryTest
    );
  });

  it("Should be able to create a new fila_turma_new record", async () => {
    const fila = await handleFilaTurmaNewService.create({
      id_turma: 1,
      id_fila: 1,
      prioridade: 1,
    });

    expect(fila.id_turma).toBe(1);
    expect(fila.id_turma).toBe(1);
  });

  it("Should not be able to create an existing fila_turma_new record", async () => {
    await expect(async () => {
      await handleFilaTurmaNewService.create({
        id_turma: 1,
        id_fila: 1,
        prioridade: 1,
      });

      await handleFilaTurmaNewService.create({
        id_turma: 1,
        id_fila: 1,
        prioridade: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all fila_turma_new records", async () => {
    await handleFilaTurmaNewService.create({
      id_turma: 1,
      id_fila: 1,
      prioridade: 1,
    });

    await handleFilaTurmaNewService.create({
      id_turma: 1,
      id_fila: 2,
      prioridade: 1,
    });

    const filas = await handleFilaTurmaNewService.read();

    expect(filas).toHaveLength(2);
  });

  it("Should be able to update an existing fila_turma_new record", async () => {
    await handleFilaTurmaNewService.create({
      id_turma: 1,
      id_fila: 1,
      prioridade: 1,
    });

    await handleFilaTurmaNewService.update({
      id_turma: 1,
      id_fila: 1,
      prioridade: 5,
    });

    const filaResult = await filaRepositoryTest.queryByTurmaEFila(1, 1);

    expect(filaResult.prioridade).toBe(5);
  });

  it("Should not be able to update an unexisting fila_turma_new record", async () => {
    await expect(async () => {
      await handleFilaTurmaNewService.update({
        id_turma: 1111,
        id_fila: 1111,
        prioridade: 5,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a fila_turma_new record", async () => {
    await handleFilaTurmaNewService.create({
      id_turma: 55,
      id_fila: 55,
      prioridade: 1,
    });

    await handleFilaTurmaNewService.delete(55, 55);

    const filas = await filaRepositoryTest.listFilas();

    expect(filas).toHaveLength(0);
  });
});
