import { AppError } from "../../../../../shared/errors/AppError";
import { EtapaRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/EtapaRepositoryTestMock";
import { HandleEtapaService } from "../HandleEtapaService";

describe("Handle CRUD operations related to etapa", () => {
  let etapaRepositoryTest: EtapaRepositoryTestMock;
  let handleEtapaService: HandleEtapaService;

  beforeEach(() => {
    etapaRepositoryTest = new EtapaRepositoryTestMock();
    handleEtapaService = new HandleEtapaService(etapaRepositoryTest);
  });

  it("Should be able to create a new etapa record", async () => {
    const etapa = await handleEtapaService.create({
      codigo: "restricoes",
      ativo: true,
      descricao: "Exibir restrições",
    });

    expect(etapa.codigo).toBe("restricoes");
    expect(etapa.ativo).toBe(true);
  });

  it("Should be able to read all etapa records", async () => {
    await handleEtapaService.create({
      codigo: "codigo",
      ativo: true,
      descricao: "Exibir codigo",
    });

    await handleEtapaService.create({
      codigo: "novo codigo",
      ativo: true,
      descricao: "Exibir novo codigo",
    });

    const etapas = await handleEtapaService.read();

    expect(etapas).toHaveLength(2);
  });

  it("Should be able to update an existing etapa record", async () => {
    await handleEtapaService.create({
      codigo: "codigo",
      ativo: true,
      descricao: "codigo",
    });

    const etapaToUpdate = await etapaRepositoryTest.queryByCodigo("codigo");

    await handleEtapaService.update({
      id: etapaToUpdate.id,
      ativo: false,
      descricao: "novo codigo",
    });

    const etapaResult = await etapaRepositoryTest.queryById(etapaToUpdate.id);

    expect(etapaResult.ativo).toBe(false);
    expect(etapaResult.descricao).toBe("novo codigo");
  });

  it("Should not be able to update an unexisting etapa_fila record", async () => {
    await expect(async () => {
      await handleEtapaService.update({
        id: "500",
        ativo: false,
        descricao: "novo codigo",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a etapa_fila record", async () => {
    await handleEtapaService.create({
      codigo: "a code",
      ativo: true,
      descricao: "code description",
    });

    const etapaToDelete = await etapaRepositoryTest.queryByCodigo("a code");

    await handleEtapaService.delete(etapaToDelete.id);

    const etapas = await etapaRepositoryTest.listEtapas();

    expect(etapas).toHaveLength(0);
  });
});
