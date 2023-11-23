import { AppError } from "../../../../../shared/errors/AppError";
import { DistribuicoesPossibilidadeRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/DistribuicoesPossibilidadeRepositoryTestMock";
import { HandleDistribuicoesPossibilidadeService } from "../HandleDistribuicoesPossibilidadeService";

describe("Handle CRUD operations related to distribuicoes_possibilidade", () => {
  let distRepositoryTest: DistribuicoesPossibilidadeRepositoryTestMock;
  let handleDistribuicoesPossibilidadeService: HandleDistribuicoesPossibilidadeService;

  beforeEach(() => {
    distRepositoryTest = new DistribuicoesPossibilidadeRepositoryTestMock();
    handleDistribuicoesPossibilidadeService =
      new HandleDistribuicoesPossibilidadeService(distRepositoryTest);
  });

  it("Should be able to create a distribuicoes_possibilidade record", async () => {
    const dist = await handleDistribuicoesPossibilidadeService.create({
      id_possibilidade: 1,
      siape: "001001001",
      id_turma: 5,
    });

    expect(dist.id_possibilidade).toBe(1);
    expect(dist.siape).toBe("001001001");
  });

  it("Should not be able to create an existing distribuicoes_possibilidade record", async () => {
    await expect(async () => {
      await handleDistribuicoesPossibilidadeService.create({
        id_possibilidade: 1,
        siape: "001001001",
        id_turma: 5,
      });

      await handleDistribuicoesPossibilidadeService.create({
        id_possibilidade: 1,
        siape: "001001001",
        id_turma: 5,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all distribuicoes_possibilidade records", async () => {
    await handleDistribuicoesPossibilidadeService.create({
      id_possibilidade: 1,
      siape: "001001001",
      id_turma: 5,
    });

    await handleDistribuicoesPossibilidadeService.create({
      id_possibilidade: 2,
      siape: "001001002",
      id_turma: 15,
    });

    await handleDistribuicoesPossibilidadeService.create({
      id_possibilidade: 3,
      siape: "001001003",
      id_turma: 25,
    });

    const distList = await handleDistribuicoesPossibilidadeService.read();

    expect(distList).toHaveLength(3);
  });

  it("Should be able to delete a distribuicoes_possibilidade record", async () => {
    await handleDistribuicoesPossibilidadeService.create({
      id_possibilidade: 5,
      siape: "001001005",
      id_turma: 5,
    });

    await handleDistribuicoesPossibilidadeService.delete(5, "001001005", 5);

    const dists = await distRepositoryTest.listDistribuicoes();

    expect(dists).toHaveLength(0);
  });
});
