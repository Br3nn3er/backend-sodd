import { AppError } from "../../../../../shared/errors/AppError";
import { AtribuicaoManualRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/AtribuicaoManualRepositoryTestMock";
import { HandleAtribuicaoManualService } from "../HandleAtribuicaoManualService";

describe("Handle CRUD operations related to atribuicao_manual", () => {
  let atribuicaoManualRepositoryTest: AtribuicaoManualRepositoryTestMock;
  let handleAtribuicaoManualService: HandleAtribuicaoManualService;

  beforeEach(() => {
    atribuicaoManualRepositoryTest = new AtribuicaoManualRepositoryTestMock();
    handleAtribuicaoManualService = new HandleAtribuicaoManualService(
      atribuicaoManualRepositoryTest
    );
  });

  it("Should be able to create a new atribuicao_manual record", async () => {
    const auditoriaNew = await handleAtribuicaoManualService.create({
      num_cenario: 1,
      siape: "00001",
      id_turma: 15,
    });

    expect(auditoriaNew.num_cenario).toBe(1);
    expect(auditoriaNew.id_turma).toBe(15);
  });

  it("Should not be able to create an existing atribuicao_manual record", async () => {
    await expect(async () => {
      await handleAtribuicaoManualService.create({
        num_cenario: 1,
        siape: "001001001",
        id_turma: 2,
      });

      await handleAtribuicaoManualService.create({
        num_cenario: 1,
        siape: "100100100",
        id_turma: 2,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all atribuicao_manual records", async () => {
    await handleAtribuicaoManualService.create({
      num_cenario: 2,
      siape: "00002",
      id_turma: 20,
    });

    await handleAtribuicaoManualService.create({
      num_cenario: 3,
      siape: "00003",
      id_turma: 25,
    });

    await handleAtribuicaoManualService.create({
      num_cenario: 4,
      siape: "00004",
      id_turma: 30,
    });

    const atribuicoes = await handleAtribuicaoManualService.read();

    expect(atribuicoes).toHaveLength(3);
  });

  it("Should be able to delete a atribuicao_manual record", async () => {
    await handleAtribuicaoManualService.create({
      num_cenario: 20,
      siape: "001001001",
      id_turma: 15,
    });

    await handleAtribuicaoManualService.delete(20, 15);

    const auditoriaResult =
      await atribuicaoManualRepositoryTest.queryByCenarioETurma(20, 15);

    expect(auditoriaResult).toBeUndefined();
  });
});
