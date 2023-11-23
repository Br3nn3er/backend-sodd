import { AppError } from "../../../../../shared/errors/AppError";
import { PossibilidadesRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/PossibilidadesRepositoryTestMock";
import { HandlePossibilidadesService } from "../HandlePossibilidadesService";

describe("Handle CRUD operations related to possibilidades", () => {
  let possibilidadeRepositoryTest: PossibilidadesRepositoryTestMock;
  let handlePossibilidadesService: HandlePossibilidadesService;

  beforeEach(() => {
    possibilidadeRepositoryTest = new PossibilidadesRepositoryTestMock();
    handlePossibilidadesService = new HandlePossibilidadesService(
      possibilidadeRepositoryTest
    );
  });

  it("Should be able to create a possibilidade relationship", async () => {
    const possibilidade = await handlePossibilidadesService.create({
      num_cenario: 12,
      descricao: "descricao_001",
    });

    expect(possibilidade.num_cenario).toBe(12);
    expect(possibilidade.descricao).toBe("descricao_001");
  });

  it("Should be able to read all possibilidade records", async () => {
    await handlePossibilidadesService.create({
      num_cenario: 1,
      descricao: "descricao_001",
    });

    await handlePossibilidadesService.create({
      num_cenario: 2,
      descricao: "descricao_002",
    });

    await handlePossibilidadesService.create({
      num_cenario: 3,
      descricao: "descricao_003",
    });

    const possibilidadesList = await handlePossibilidadesService.read();

    expect(possibilidadesList).toHaveLength(3);
  });

  it("Should be able to update an existing possibilidade record", async () => {
    await handlePossibilidadesService.create({
      num_cenario: 1,
      descricao: "descricao_001",
    });

    const possibilidadeToUpdate =
      await possibilidadeRepositoryTest.queryByNumCenario(1);

    await handlePossibilidadesService.update({
      id: possibilidadeToUpdate.id,
      descricao: "nova descricao",
    });

    const possibilidadeResult = await possibilidadeRepositoryTest.queryById(
      possibilidadeToUpdate.id
    );

    expect(possibilidadeResult.descricao).toBe("nova descricao");
  });

  it("Should not be able to update an unexisting possibilidade record", async () => {
    await expect(async () => {
      await handlePossibilidadesService.update({
        id: "500",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a possibilidade record", async () => {
    await handlePossibilidadesService.create({
      num_cenario: 10,
      descricao: "descricao_001",
    });

    const possibilidadeToDelete =
      await possibilidadeRepositoryTest.queryByNumCenario(10);

    await handlePossibilidadesService.delete(possibilidadeToDelete.id);

    const possibilidades =
      await possibilidadeRepositoryTest.listPossibilidades();

    expect(possibilidades).toHaveLength(0);
  });
});
