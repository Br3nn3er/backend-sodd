import { AppError } from "../../../../../shared/errors/AppError";
import { PrioridadesRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/PrioridadesRepositoryTestMock";
import { HandlePrioridadeService } from "../HandlePrioridadeService";

describe("Handle CRUD operations related to prioridades", () => {
  let prioridadesRepositoryTest: PrioridadesRepositoryTestMock;
  let handlePrioridadeService: HandlePrioridadeService;

  beforeEach(() => {
    prioridadesRepositoryTest = new PrioridadesRepositoryTestMock();
    handlePrioridadeService = new HandlePrioridadeService(
      prioridadesRepositoryTest
    );
  });

  it("Should be able to create a new prioridades record", async () => {
    const prioridades = await handlePrioridadeService.create({
      prioridade: 1,
      codigo_disc: "codigo_001",
      siape: "000001",
    });

    expect(prioridades.prioridade).toBe(1);
    expect(prioridades.codigo_disc).toBe("codigo_001");
  });

  it("Should be able to read all prioridade records", async () => {
    await handlePrioridadeService.create({
      prioridade: 1,
      codigo_disc: "codigo_002",
      siape: "0000015",
    });

    await handlePrioridadeService.create({
      prioridade: 1,
      codigo_disc: "codigo_003",
      siape: "0000065",
    });

    const prioridades = await handlePrioridadeService.read();

    expect(prioridades).toHaveLength(2);
  });

  it("Should be able to update an existing prioridade record", async () => {
    await handlePrioridadeService.create({
      prioridade: 15,
      codigo_disc: "codigo_004",
      siape: "0000065",
    });

    const prioridadeToUpdate =
      await prioridadesRepositoryTest.queryBySiapeECodigo(
        "0000065",
        "codigo_004"
      );

    await handlePrioridadeService.update({
      id: prioridadeToUpdate.id,
      prioridade: 10,
    });

    const prioridadeResult = await prioridadesRepositoryTest.queryById(
      prioridadeToUpdate.id
    );

    expect(prioridadeResult.prioridade).toBe(10);
  });

  it("Should not be able to update an unexisting prioridade record", async () => {
    await expect(async () => {
      await handlePrioridadeService.update({
        id: "500",
        prioridade: 10,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a prioridade record", async () => {
    await handlePrioridadeService.create({
      prioridade: 1,
      codigo_disc: "codigo_005",
      siape: "0000015",
    });

    const prioridadeToDelete =
      await prioridadesRepositoryTest.queryBySiapeECodigo(
        "0000015",
        "codigo_005"
      );

    await handlePrioridadeService.delete(prioridadeToDelete.id);

    const prioridades = await prioridadesRepositoryTest.listAllPrioridades();

    expect(prioridades).toHaveLength(0);
  });
});
