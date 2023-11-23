import { AppError } from "../../../../../shared/errors/AppError";
import { SemestresRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/SemestresRepositoryTestMock";
import { HandleSemestreService } from "../HandleSemestreService";

describe("Handle CRUD operations related to a semestre", () => {
  let semestresRepositoryTest: SemestresRepositoryTestMock;
  let handleSemestreService: HandleSemestreService;

  beforeEach(() => {
    semestresRepositoryTest = new SemestresRepositoryTestMock();
    handleSemestreService = new HandleSemestreService(semestresRepositoryTest);
  });

  it("Should be able to create a semestre", async () => {
    const semestre = await handleSemestreService.create({
      ano: 2021,
      semestre: 1,
      status: true,
    });

    expect(semestre.ano).toBe(2021);
    expect(semestre.status).toBe(true);
  });

  it("Should not be able to create a semestre with same ano and semestre", async () => {
    await expect(async () => {
      await handleSemestreService.create({
        ano: 2021,
        semestre: 1,
        status: true,
      });

      await handleSemestreService.create({
        ano: 2021,
        semestre: 1,
        status: false,
      });

      await handleSemestreService.create({
        ano: 2021,
        semestre: 1,
        status: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all semestre records", async () => {
    await handleSemestreService.create({
      ano: 2021,
      semestre: 1,
      status: true,
    });

    await handleSemestreService.create({
      ano: 2021,
      semestre: 2,
      status: false,
    });
  });

  it("Should be able to read only semestre record", async () => {
    const semester = await handleSemestreService.create({
      ano: 2030,
      semestre: 1,
      status: true,
    });

    await handleSemestreService.create({
      ano: 2031,
      semestre: 1,
      status: true,
    });

    const response = await handleSemestreService.readById(semester.id);

    expect(response).toMatchObject(semester);
  });

  it("Should be able to update a semestre record", async () => {
    await handleSemestreService.create({
      ano: 2021,
      semestre: 1,
      status: true,
    });

    const semestreToUpdate = await semestresRepositoryTest.queryByAnoSemestre(
      2021,
      1
    );

    await handleSemestreService.update({
      id: semestreToUpdate.id,
      ano: 2021,
      semestre: 2,
      status: false,
    });

    expect(semestreToUpdate.ano).toBe(2021);
    expect(semestreToUpdate.semestre).toBe(2);
  });

  it("Should not be able to update a nonexisting semestre record", async () => {
    await expect(async () => {
      await handleSemestreService.update({
        id: 455,
        ano: 2021,
        semestre: 2,
        status: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a semestre record", async () => {
    await handleSemestreService.create({
      ano: 2021,
      semestre: 1,
      status: true,
    });

    await handleSemestreService.create({
      ano: 2021,
      semestre: 2,
      status: false,
    });

    const semestreToDelete = await semestresRepositoryTest.queryByAnoSemestre(
      2021,
      1
    );

    await semestresRepositoryTest.deleteById(semestreToDelete.id);

    const semestres = await handleSemestreService.read();

    expect(semestres).toHaveLength(1);
  });
});
