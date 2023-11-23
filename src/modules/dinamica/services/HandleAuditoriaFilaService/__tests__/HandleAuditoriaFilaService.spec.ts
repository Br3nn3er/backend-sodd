import { AppError } from "../../../../../shared/errors/AppError";
import { AuditoriaFilaRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/AuditoriaFilaRepositoryTestMock";
import { HandleAuditoriaFilaService } from "../HandleAuditoriaFilaService";

describe("Handle CRUD operations related to auditoria_fila", () => {
  let auditoriaFilaRepositoryTest: AuditoriaFilaRepositoryTestMock;
  let handleAuditoriaFilaService: HandleAuditoriaFilaService;

  beforeEach(() => {
    auditoriaFilaRepositoryTest = new AuditoriaFilaRepositoryTestMock();
    handleAuditoriaFilaService = new HandleAuditoriaFilaService(
      auditoriaFilaRepositoryTest
    );
  });

  it("Should be able to create a new auditoria_fila record", async () => {
    const auditoria = await handleAuditoriaFilaService.create({
      siape: "413286",
      codigo_disc: "FACOM31701",
      pos: 1,
      prioridade: 1,
      qte_ministrada: 1,
      qte_maximo: 6,
      ano: 2021,
      semestre: 1,
      status: -1,
      periodo_preferencial: true,
      comando: "D",
      stamp: new Date(),
    });

    expect(auditoria.siape).toBe("413286");
    expect(auditoria.qte_maximo).toBe(6);
  });

  it("Should be able to read all auditoria_fila records", async () => {
    await handleAuditoriaFilaService.create({
      siape: "413286",
      codigo_disc: "FACOM31701",
      pos: 1,
      prioridade: 1,
      qte_ministrada: 1,
      qte_maximo: 6,
      ano: 2021,
      semestre: 1,
      status: -1,
      periodo_preferencial: true,
      comando: "D",
      stamp: new Date(),
    });

    await handleAuditoriaFilaService.create({
      siape: "113286",
      codigo_disc: "FACOM31700",
      pos: 1,
      prioridade: 1,
      qte_ministrada: 1,
      qte_maximo: 6,
      ano: 2021,
      semestre: 1,
      status: -1,
      periodo_preferencial: true,
      comando: "D",
      stamp: new Date(),
    });

    const auditorias = await handleAuditoriaFilaService.read();

    expect(auditorias).toHaveLength(2);
  });

  it("Should be able to update an existing auditoria_fila record", async () => {
    await handleAuditoriaFilaService.create({
      siape: "000001",
      codigo_disc: "FACOM31701",
      pos: 1,
      prioridade: 1,
      qte_ministrada: 1,
      qte_maximo: 6,
      ano: 2021,
      semestre: 1,
      status: -1,
      periodo_preferencial: true,
      comando: "D",
      stamp: new Date(),
    });

    const auditoriaToUpdate = await auditoriaFilaRepositoryTest.queryBySiape(
      "000001"
    );

    await handleAuditoriaFilaService.update({
      id: auditoriaToUpdate.id,
      periodo_preferencial: false,
      comando: "S",
    });

    const auditoriaResult = await auditoriaFilaRepositoryTest.queryById(
      auditoriaToUpdate.id
    );

    expect(auditoriaResult.periodo_preferencial).toBe(false);
    expect(auditoriaResult.comando).toBe("S");
  });

  it("Should not be able to update an unexisting auditoria_fila record", async () => {
    await expect(async () => {
      await handleAuditoriaFilaService.update({
        id: "500",
        periodo_preferencial: false,
        comando: "S",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a auditoria_fila record", async () => {
    await handleAuditoriaFilaService.create({
      siape: "00000002",
      codigo_disc: "FACOM31701",
      pos: 1,
      prioridade: 1,
      qte_ministrada: 1,
      qte_maximo: 6,
      ano: 2021,
      semestre: 1,
      status: -1,
      periodo_preferencial: true,
      comando: "D",
      stamp: new Date(),
    });

    const auditoriaToDelete = await auditoriaFilaRepositoryTest.queryBySiape(
      "00000002"
    );

    await handleAuditoriaFilaService.delete(auditoriaToDelete.id);

    const auditorias = await auditoriaFilaRepositoryTest.listAllAuditorias();

    expect(auditorias).toHaveLength(0);
  });
});
