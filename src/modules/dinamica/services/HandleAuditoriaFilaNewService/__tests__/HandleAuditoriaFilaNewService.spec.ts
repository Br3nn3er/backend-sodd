import { AppError } from "../../../../../shared/errors/AppError";
import { AuditoriaFilaNewRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/AuditoriaFilaNewRepositoryTestMock";
import { HandleAuditoriaFilaNewService } from "../HandleAuditoriaFilaNewService";

describe("Handle CRUD operations related to auditoria_fila_turma_new", () => {
  let auditoriaFilaNewRepositoryTest: AuditoriaFilaNewRepositoryTestMock;
  let handleAuditoriaFilaNewService: HandleAuditoriaFilaNewService;

  beforeEach(() => {
    auditoriaFilaNewRepositoryTest = new AuditoriaFilaNewRepositoryTestMock();
    handleAuditoriaFilaNewService = new HandleAuditoriaFilaNewService(
      auditoriaFilaNewRepositoryTest
    );
  });

  it("Should be able to create a new auditoria_fila_turma_new record", async () => {
    const auditoriaNew = await handleAuditoriaFilaNewService.create({
      id_turma: 1,
      id_fila: 52,
      prioridade_old: 2,
      prioridade_new: 3,
      stamp: new Date(),
    });

    expect(auditoriaNew.id_turma).toBe(1);
    expect(auditoriaNew.prioridade_new).toBe(3);
  });

  it("Should be able to read all auditoria_fila_turma_new records", async () => {
    await handleAuditoriaFilaNewService.create({
      id_turma: 1,
      id_fila: 52,
      prioridade_old: 2,
      prioridade_new: 3,
      stamp: new Date(),
    });

    await handleAuditoriaFilaNewService.create({
      id_turma: 2,
      id_fila: 55,
      prioridade_old: 1,
      prioridade_new: 2,
      stamp: new Date(),
    });

    await handleAuditoriaFilaNewService.create({
      id_turma: 3,
      id_fila: 53,
      prioridade_old: 6,
      prioridade_new: 3,
      stamp: new Date(),
    });

    const auditorias = await handleAuditoriaFilaNewService.read();

    expect(auditorias).toHaveLength(3);
  });

  it("Should be able to update an existing auditoria_fila_turma_new record", async () => {
    await handleAuditoriaFilaNewService.create({
      id_turma: 1,
      id_fila: 52,
      prioridade_old: 2,
      prioridade_new: 3,
      stamp: new Date(),
    });

    const auditoriaToUpdate =
      await auditoriaFilaNewRepositoryTest.queryByIdTurmaIdFila(1, 52);

    await handleAuditoriaFilaNewService.update({
      id: auditoriaToUpdate.id,
      id_fila: 55,
      prioridade_new: 1,
    });

    const auditoriaResult = await auditoriaFilaNewRepositoryTest.queryById(
      auditoriaToUpdate.id
    );

    expect(auditoriaResult.id_fila).toBe(55);
    expect(auditoriaResult.prioridade_new).toBe(1);
  });

  it("Should not be able to update an unexisting auditoria_fila_turma_new record", async () => {
    await expect(async () => {
      await handleAuditoriaFilaNewService.update({
        id: "39",
        id_fila: 55,
        prioridade_new: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a auditoria_fila_turma_new record", async () => {
    await handleAuditoriaFilaNewService.create({
      id_turma: 1,
      id_fila: 52,
      prioridade_old: 2,
      prioridade_new: 3,
      stamp: new Date(),
    });

    const auditoriaToDelete =
      await auditoriaFilaNewRepositoryTest.queryByIdTurmaIdFila(1, 52);

    await handleAuditoriaFilaNewService.delete(auditoriaToDelete.id);

    const auditoriaResult = await auditoriaFilaNewRepositoryTest.queryById(
      auditoriaToDelete.id
    );

    expect(auditoriaResult).toBeUndefined();
  });
});
