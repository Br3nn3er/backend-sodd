import { AppError } from "../../../../../shared/errors/AppError";
import { RestricoesRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/RestricoesRepositoryTestMock";
import { HandleRestricoesService } from "../HandleRestricoesService";

describe("Handle CRUD operations related to restricoes", () => {
  let restricoesRepositoryTest: RestricoesRepositoryTestMock;
  let handleRestricoesService: HandleRestricoesService;

  beforeEach(() => {
    restricoesRepositoryTest = new RestricoesRepositoryTestMock();
    handleRestricoesService = new HandleRestricoesService(
      restricoesRepositoryTest
    );
  });

  it("Should be able to create a new restricoes record", async () => {
    const restricoes = await handleRestricoesService.create({
      siape: "000001",
      dia: "1",
      letra: "a",
    });

    expect(restricoes.dia).toBe("1");
    expect(restricoes.letra).toBe("a");
  });

  it("Should not be able to create an existing restricoes record", async () => {
    await expect(async () => {
      await handleRestricoesService.create({
        siape: "000002",
        dia: "2",
        letra: "b",
      });

      await handleRestricoesService.create({
        siape: "000002",
        dia: "2",
        letra: "b",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all restricoes records", async () => {
    await handleRestricoesService.create({
      siape: "000003",
      dia: "3",
      letra: "c",
    });

    await handleRestricoesService.create({
      siape: "000004",
      dia: "4",
      letra: "d",
    });

    const restricoess = await handleRestricoesService.read();

    expect(restricoess).toHaveLength(2);
  });

  it("Should be able to delete a restricoes record", async () => {
    await handleRestricoesService.create({
      siape: "000004",
      dia: "4",
      letra: "d",
    });

    await handleRestricoesService.delete("000004", "4", "d");

    const restricoess = await restricoesRepositoryTest.listRestricoes();

    expect(restricoess).toHaveLength(0);
  });
});
