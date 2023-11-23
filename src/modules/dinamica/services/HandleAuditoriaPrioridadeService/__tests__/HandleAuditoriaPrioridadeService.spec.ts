import { AppError } from "../../../../../shared/errors/AppError";
import { AuditoriaPrioridadeRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/AuditoriaPrioridadeRepositoryTestMock";
import { HandleAuditoriaPrioridadeService } from "../HandleAuditoriaPrioridadeService";

describe("Handle CRUD operations related to auditoria_prioridade", () => {
  let auditoriaPrioridadeRepositoryTest: AuditoriaPrioridadeRepositoryTestMock;
  let handleAuditoriaPrioridadeService: HandleAuditoriaPrioridadeService;

  beforeEach(() => {
    auditoriaPrioridadeRepositoryTest =
      new AuditoriaPrioridadeRepositoryTestMock();
    handleAuditoriaPrioridadeService = new HandleAuditoriaPrioridadeService(
      auditoriaPrioridadeRepositoryTest
    );
  });

  it("Should be able to create a new auditoria_prioridade record", async () => {
    const auditoria = await handleAuditoriaPrioridadeService.create({
      siape: "111111",
      codigo_disc: "14",
      prioridade_antiga: 1,
      prioridade_nova: 2,
      stamp: new Date(),
    });

    expect(auditoria.siape).toBe("111111");
    expect(auditoria.prioridade_antiga).toBe(1);
  });

  it("Should be able to read all auditoria_prioridade records", async () => {
    await handleAuditoriaPrioridadeService.create({
      siape: "111110",
      codigo_disc: "20",
      prioridade_antiga: 5,
      prioridade_nova: 3,
      stamp: new Date(),
    });

    await handleAuditoriaPrioridadeService.create({
      siape: "111125",
      codigo_disc: "25",
      prioridade_antiga: 10,
      prioridade_nova: 1,
      stamp: new Date(),
    });

    const auditorias = await handleAuditoriaPrioridadeService.read();

    expect(auditorias).toHaveLength(2);
  });

  it("Should be able to update an existing auditoria_prioridade record", async () => {
    await handleAuditoriaPrioridadeService.create({
      siape: "15111125",
      codigo_disc: "50",
      prioridade_antiga: 2,
      prioridade_nova: 1,
      stamp: new Date(),
    });

    const auditoriaToUpdate =
      await auditoriaPrioridadeRepositoryTest.queryBySiape("15111125");

    await handleAuditoriaPrioridadeService.update({
      id: auditoriaToUpdate.id,
      prioridade_antiga: 1,
      prioridade_nova: 5,
    });

    const auditoriaResult = await auditoriaPrioridadeRepositoryTest.queryById(
      auditoriaToUpdate.id
    );

    expect(auditoriaResult.prioridade_antiga).toBe(1);
    expect(auditoriaResult.prioridade_nova).toBe(5);
  });

  it("Should not be able to update an unexisting auditoria_prioridade record", async () => {
    await expect(async () => {
      await handleAuditoriaPrioridadeService.update({
        id: "500",
        prioridade_antiga: 1,
        prioridade_nova: 5,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a auditoria_prioridade record", async () => {
    await handleAuditoriaPrioridadeService.create({
      siape: "15112125",
      codigo_disc: "50",
      prioridade_antiga: 2,
      prioridade_nova: 1,
      stamp: new Date(),
    });

    const auditoriaToDelete =
      await auditoriaPrioridadeRepositoryTest.queryBySiape("15112125");

    await handleAuditoriaPrioridadeService.delete(auditoriaToDelete.id);

    const auditorias =
      await auditoriaPrioridadeRepositoryTest.listAllAuditorias();

    expect(auditorias).toHaveLength(0);
  });
});
