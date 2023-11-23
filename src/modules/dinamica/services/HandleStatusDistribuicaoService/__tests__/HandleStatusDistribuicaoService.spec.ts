import { AppError } from "../../../../../shared/errors/AppError";
import { StatusDistribuicaoRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/StatusDistruicaoRepositoryTestMock";
import { HandleStatusDistribuicaoService } from "../HandleStatusDistribuicaoService";

describe("Handle CRUD operations related to status_distribuicao", () => {
  let statusDistribuicaoRepositoryTest: StatusDistribuicaoRepositoryTestMock;
  let handleStatusDistribuicaoService: HandleStatusDistribuicaoService;

  beforeEach(() => {
    statusDistribuicaoRepositoryTest =
      new StatusDistribuicaoRepositoryTestMock();
    handleStatusDistribuicaoService = new HandleStatusDistribuicaoService(
      statusDistribuicaoRepositoryTest
    );
  });

  it("Should be able to create a new status_distribuicao record", async () => {
    const status = await handleStatusDistribuicaoService.create({
      id: 1,
      descricao: "a description",
    });

    expect(status.id).toBe(1);
    expect(status.descricao).toBe("a description");
  });

  it("Should be able to read all status_distribuicao records", async () => {
    await handleStatusDistribuicaoService.create({
      id: 2,
      descricao: "a description_002",
    });

    await handleStatusDistribuicaoService.create({
      id: 3,
      descricao: "a description_003",
    });

    await handleStatusDistribuicaoService.create({
      id: 4,
      descricao: "a description_004",
    });

    const listStatus = await handleStatusDistribuicaoService.read();

    expect(listStatus).toHaveLength(3);
  });

  it("Should be able to update an existing status_distribuicao record", async () => {
    await handleStatusDistribuicaoService.create({
      id: 5,
      descricao: "a description_005",
    });

    const statusToUpdate = await statusDistribuicaoRepositoryTest.queryById(5);

    await handleStatusDistribuicaoService.update({
      codigo: statusToUpdate.codigo,
      descricao: "a description_100",
    });

    const statusResult = await statusDistribuicaoRepositoryTest.queryByCodigo(
      statusToUpdate.codigo
    );

    expect(statusResult.descricao).toBe("a description_100");
  });

  it("Should not be able to update an unexisting status_distribuicao record", async () => {
    await expect(async () => {
      await handleStatusDistribuicaoService.update({
        codigo: "500",
        descricao: "nova descricao",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a status_distribuicao record", async () => {
    await handleStatusDistribuicaoService.create({
      id: 14,
      descricao: "a description_014",
    });

    const statusToDelete = await statusDistribuicaoRepositoryTest.queryById(14);

    await handleStatusDistribuicaoService.delete(statusToDelete.codigo);

    const statusResult = await statusDistribuicaoRepositoryTest.queryByCodigo(
      statusToDelete.codigo
    );

    expect(statusResult).toBeUndefined();
  });
});
