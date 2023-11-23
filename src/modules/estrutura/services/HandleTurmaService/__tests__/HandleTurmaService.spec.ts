import { AppError } from "../../../../../shared/errors/AppError";
import { SemestresRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/SemestresRepositoryTestMock";
import { TurmasRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/TurmasRepositoryTestMock";
import { HandleTurmaService } from "../HandleTurmaService";

describe("Handle CRUD operations related to turma", () => {
  let turmasRepositoryTest: TurmasRepositoryTestMock;
  let semestresRepositoryTestMock: SemestresRepositoryTestMock;
  let handleTurmaService: HandleTurmaService;

  beforeEach(() => {
    turmasRepositoryTest = new TurmasRepositoryTestMock();
    semestresRepositoryTestMock = new SemestresRepositoryTestMock();
    handleTurmaService = new HandleTurmaService(
      turmasRepositoryTest,
      semestresRepositoryTestMock
    );
  });

  it("Should be able to create a new turma record", async () => {
    const createdTurma = await handleTurmaService.create({
      codigo_disc: "FACOM0001",
      turma: "Z",
      ch: 5,
      ano: 2020,
      semestre: 1,
    });

    expect(createdTurma.ch).toBe(5);
    expect(createdTurma.codigo_disc).toBe("FACOM0001");
  });

  it("Should not be able to create an existing turma", async () => {
    await expect(async () => {
      await handleTurmaService.create({
        codigo_disc: "FACOM0001",
        turma: "Z",
        ch: 5,
        ano: 2020,
        semestre: 1,
      });

      await handleTurmaService.create({
        codigo_disc: "FACOM0001",
        turma: "Z",
        ch: 4,
        ano: 2020,
        semestre: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all turma records", async () => {
    await handleTurmaService.create({
      codigo_disc: "FACOM0001",
      turma: "Z",
      ch: 5,
      ano: 2020,
      semestre: 1,
    });

    await handleTurmaService.create({
      codigo_disc: "FACOM0001",
      turma: "Z",
      ch: 5,
      ano: 2020,
      semestre: 2,
    });

    const turmas = await handleTurmaService.read();

    expect(turmas).toHaveLength(2);
  });

  it("Should be able to update and turma record", async () => {
    const turma = await handleTurmaService.create({
      codigo_disc: "FACOM0001",
      turma: "Z",
      ch: 5,
      ano: 2020,
      semestre: 1,
    });

    const turmaToUpdate =
      await turmasRepositoryTest.queryByCodigoTurmaAnoSemestre(
        turma.codigo_disc,
        turma.turma,
        turma.ano,
        turma.semestre
      );

    await handleTurmaService.update({
      id: turmaToUpdate.id,
      ano: 2021,
      semestre: 2,
    });

    const turmaResult = await turmasRepositoryTest.queryById(turmaToUpdate.id);

    expect(turmaResult.ano).toBe(2021);
    expect(turmaResult.semestre).toBe(2);
  });

  it("Should not be able to update an unexisting turma", async () => {
    await expect(async () => {
      await handleTurmaService.update({
        id: "75",
        ano: 2021,
        semestre: 2,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a turma record", async () => {
    const turma = await handleTurmaService.create({
      codigo_disc: "FACOM0001",
      turma: "Z",
      ch: 5,
      ano: 2020,
      semestre: 1,
    });

    await handleTurmaService.create({
      codigo_disc: "FACOM0001",
      turma: "Z",
      ch: 5,
      ano: 2020,
      semestre: 2,
    });

    const turmaToDelete =
      await turmasRepositoryTest.queryByCodigoTurmaAnoSemestre(
        turma.codigo_disc,
        turma.turma,
        turma.ano,
        turma.semestre
      );

    await handleTurmaService.delete(turmaToDelete.id);

    const turmas = await turmasRepositoryTest.listAllTurmas();

    expect(turmas).toHaveLength(1);
  });
});
