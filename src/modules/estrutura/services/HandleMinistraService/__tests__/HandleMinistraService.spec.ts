import { AppError } from "../../../../../shared/errors/AppError";
import { MinistraRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/MinistraRepositoryTestMock";
import { SemestresRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/SemestresRepositoryTestMock";
import { TurmasRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/TurmasRepositoryTestMock";
import { HandleMinistraService } from "../HandleMinistraService";

describe("Handle CRUD operations related to ministra", () => {
  let turmasTestMock: TurmasRepositoryTestMock;
  let ministraTestMock: MinistraRepositoryTestMock;
  let semestresTestMock: SemestresRepositoryTestMock;
  let handleMinistraService: HandleMinistraService;

  beforeEach(() => {
    turmasTestMock = new TurmasRepositoryTestMock();
    ministraTestMock = new MinistraRepositoryTestMock();
    handleMinistraService = new HandleMinistraService(
      ministraTestMock,
      turmasTestMock,
      semestresTestMock
    );
  });

  it("Should be able to create a ministra relationship", async () => {
    const ministra = await handleMinistraService.create({
      siape: "124050",
      id_turma: "760",
    });

    expect(ministra.siape).toBe("124050");
    expect(ministra.id_turma).toBe("760");
  });

  it("Should not be able to create two ministra relationships", async () => {
    await expect(async () => {
      await handleMinistraService.create({
        siape: "124050",
        id_turma: "760",
      });

      await handleMinistraService.create({
        siape: "124050",
        id_turma: "760",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all ministra records", async () => {
    await handleMinistraService.create({
      siape: "124050",
      id_turma: "760",
    });

    await handleMinistraService.create({
      siape: "124050",
      id_turma: "761",
    });

    await handleMinistraService.create({
      siape: "124050",
      id_turma: "762",
    });

    const ministraList = await handleMinistraService.read();

    expect(ministraList).toHaveLength(3);
  });

  it("Should be able to delete a ministra relationship", async () => {
    await handleMinistraService.create({
      siape: "124050",
      id_turma: "760",
    });

    await handleMinistraService.create({
      siape: "124050",
      id_turma: "761",
    });

    await handleMinistraService.delete("124050", "760");

    const ministraList = await ministraTestMock.listAllMinistra();

    expect(ministraList).toHaveLength(1);
  });
});
