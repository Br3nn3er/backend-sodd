import { AppError } from "../../../../../shared/errors/AppError";
import { SemanasRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/SemanasRepositoryTestMock";
import { HandleSemanaService } from "../HandleSemanaService";

describe("Handle CRUD operations related to semana", () => {
  let semanasRepository: SemanasRepositoryTestMock;
  let handleSemanaService: HandleSemanaService;

  beforeEach(() => {
    semanasRepository = new SemanasRepositoryTestMock();
    handleSemanaService = new HandleSemanaService(semanasRepository);
  });

  it("Should be able to create a semana", async () => {
    const semana = await handleSemanaService.create({
      dia: "0",
      descricao: "Domingo",
    });

    expect(semana.dia).toBe("0");
    expect(semana.descricao).toBe("Domingo");
  });

  it("Should not be able to create a semana with same dia", async () => {
    await expect(async () => {
      await handleSemanaService.create({
        dia: "1",
        descricao: "Domingo",
      });

      await handleSemanaService.create({
        dia: "1",
        descricao: "Segunda",
      });

      await handleSemanaService.create({
        dia: "1",
        descricao: "Segunda",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all semana records", async () => {
    await handleSemanaService.create({
      dia: "0",
      descricao: "Domingo",
    });

    await handleSemanaService.create({
      dia: "1",
      descricao: "Segunda-feira",
    });

    const semanas = await handleSemanaService.read();

    expect(semanas).toHaveLength(2);
  });

  it("Should be able to update a semana record", async () => {
    await handleSemanaService.create({
      dia: "0",
      descricao: "Domingo",
    });

    const semana = await handleSemanaService.update({
      dia: "0",
      descricao: "Segunda-feira",
    });

    expect(semana.descricao).toBe("Segunda-feira");
  });

  it("Should not be able to update a nonexisting semana record", async () => {
    await expect(async () => {
      await handleSemanaService.update({
        dia: "0",
        descricao: "Segunda-feira",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a semana record", async () => {
    await handleSemanaService.create({
      dia: "0",
      descricao: "Domingo",
    });

    await handleSemanaService.create({
      dia: "1",
      descricao: "Segunda-feira",
    });

    await handleSemanaService.delete("1");

    const semanas = await handleSemanaService.read();

    expect(semanas).toHaveLength(1);
  });
});
