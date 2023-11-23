import { AppError } from "../../../../../shared/errors/AppError";
import { CenarioRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/CenarioRepositoryTestMock";
import { HandleCenarioService } from "../HandleCenarioService";

describe("Handle CRUD operations related to cenario", () => {
  let cenarioRepositoryTest: CenarioRepositoryTestMock;
  let handleCenarioService: HandleCenarioService;

  beforeEach(() => {
    cenarioRepositoryTest = new CenarioRepositoryTestMock();
    handleCenarioService = new HandleCenarioService(cenarioRepositoryTest);
  });

  it("Should be able to create a cenario relationship", async () => {
    const cenario = await handleCenarioService.create({
      descricao_cenario: "Calculo III",
      ano: 2021,
      semestre: 2,
    });

    expect(cenario.descricao_cenario).toBe("Calculo III");
    expect(cenario.ano).toBe(2021);
  });

  it("Should be able to read all cenario records", async () => {
    await handleCenarioService.create({
      descricao_cenario: "Calculo I",
      ano: 2020,
      semestre: 1,
    });

    await handleCenarioService.create({
      descricao_cenario: "Calculo II",
      ano: 2020,
      semestre: 2,
    });

    await handleCenarioService.create({
      descricao_cenario: "Calculo III",
      ano: 2021,
      semestre: 1,
    });

    const cenarioList = await handleCenarioService.read();

    expect(cenarioList).toHaveLength(3);
  });

  it("Should be able to update an existing cenario record", async () => {
    await handleCenarioService.create({
      descricao_cenario: "Calculo III",
      ano: 2021,
      semestre: 1,
    });

    const cenarioToUpdate = await cenarioRepositoryTest.queryByAnoESemestre(
      2021,
      1
    );

    await handleCenarioService.update({
      num_cenario: cenarioToUpdate.num_cenario,
      ano: 2020,
      semestre: 2,
    });

    const cenarioResult = await cenarioRepositoryTest.queryByNumCenario(
      cenarioToUpdate.num_cenario
    );

    expect(cenarioResult.ano).toBe(2020);
    expect(cenarioResult.semestre).toBe(2);
  });

  it("Should not be able to update an unexisting cenario record", async () => {
    await expect(async () => {
      await handleCenarioService.update({
        num_cenario: "500",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a cenario record", async () => {
    await handleCenarioService.create({
      descricao_cenario: "Calculo III",
      ano: 2021,
      semestre: 1,
    });

    const cenarioToDelete = await cenarioRepositoryTest.queryByAnoESemestre(
      2021,
      1
    );

    await handleCenarioService.delete(cenarioToDelete.num_cenario);

    const cenarios = await cenarioRepositoryTest.listCenarios();

    expect(cenarios).toHaveLength(0);
  });
});
