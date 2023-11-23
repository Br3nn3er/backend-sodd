import { AppError } from "../../../../../shared/errors/AppError";
import { StatusPossibilidadesRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/StatusPossibilidadesRepositoryTestMock";
import { HandleStatusPossibilidadesService } from "../HandleStatusPossibilidadesService";

describe("Handle CRUD operations related to status_possibilidades", () => {
  let statusDistribuicaoRepositoryTest: StatusPossibilidadesRepositoryTestMock;
  let handleStatusPossibilidadesService: HandleStatusPossibilidadesService;

  beforeEach(() => {
    statusDistribuicaoRepositoryTest =
      new StatusPossibilidadesRepositoryTestMock();
    handleStatusPossibilidadesService = new HandleStatusPossibilidadesService(
      statusDistribuicaoRepositoryTest
    );
  });

  it("Should be able to create a new status_possibilidades record", async () => {
    const status = await handleStatusPossibilidadesService.create({
      id_fila: 1,
      id_possibilidade: 1,
      status: 1,
    });

    expect(status.id_fila).toBe(1);
    expect(status.id_possibilidade).toBe(1);
  });

  it("Should not be able to create an existing status_possibilidades record", async () => {
    await expect(async () => {
      await handleStatusPossibilidadesService.create({
        id_fila: 1,
        id_possibilidade: 1,
        status: 1,
      });

      await handleStatusPossibilidadesService.create({
        id_fila: 1,
        id_possibilidade: 1,
        status: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all status_possibilidades records", async () => {
    await handleStatusPossibilidadesService.create({
      id_fila: 1,
      id_possibilidade: 1,
      status: 1,
    });

    await handleStatusPossibilidadesService.create({
      id_fila: 1,
      id_possibilidade: 2,
      status: 11,
    });

    await handleStatusPossibilidadesService.create({
      id_fila: 2,
      id_possibilidade: 2,
      status: -1,
    });

    const listStatus = await handleStatusPossibilidadesService.read();

    expect(listStatus).toHaveLength(3);
  });

  it("Should be able to delete a status_possibilidades record", async () => {
    await handleStatusPossibilidadesService.create({
      id_fila: 3,
      id_possibilidade: 3,
      status: -1,
    });

    await handleStatusPossibilidadesService.delete(3, 3);

    const statusResult =
      await statusDistribuicaoRepositoryTest.queryByFilaEPossibilidade(3, 3);

    expect(statusResult).toBeUndefined();
  });
});
