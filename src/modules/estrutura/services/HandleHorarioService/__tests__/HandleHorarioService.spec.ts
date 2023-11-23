import { AppError } from "../../../../../shared/errors/AppError";
import { HorariosRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/HorariosRepositoryTestMock";
import { HandleHorarioService } from "../HandleHorarioService";

describe("Handle CRUD operations related to horarios", () => {
  let horariosTestMock: HorariosRepositoryTestMock;
  let handleHorarioService: HandleHorarioService;

  beforeEach(() => {
    horariosTestMock = new HorariosRepositoryTestMock();
    handleHorarioService = new HandleHorarioService(horariosTestMock);
  });

  it("Should be able to create a horario", async () => {
    const horario = await handleHorarioService.create({
      letra: "w",
      hora_inicio: "08:50:00",
      hora_fim: "09:40:00",
      turno: "MANHÃ",
    });

    expect(horario.letra).toBe("w");
    expect(horario.turno).toBe("MANHÃ");
  });

  it("Should not be able to create a horario with same letra", async () => {
    await expect(async () => {
      await handleHorarioService.create({
        letra: "w",
        hora_inicio: "08:50:00",
        hora_fim: "09:40:00",
        turno: "MANHÃ",
      });

      await handleHorarioService.create({
        letra: "w",
        hora_inicio: "10:40:00",
        hora_fim: "12:20:00",
        turno: "MANHÃ",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all horario records", async () => {
    await handleHorarioService.create({
      letra: "w",
      hora_inicio: "08:50:00",
      hora_fim: "09:40:00",
      turno: "MANHÃ",
    });

    await handleHorarioService.create({
      letra: "z",
      hora_inicio: "10:40:00",
      hora_fim: "12:20:00",
      turno: "MANHÃ",
    });

    const horarios = await handleHorarioService.read();

    expect(horarios).toHaveLength(2);
  });

  it("Should be able to update a horario record", async () => {
    await handleHorarioService.create({
      letra: "w",
      hora_inicio: "08:50:00",
      hora_fim: "09:40:00",
      turno: "MANHÃ",
    });

    const horario = await handleHorarioService.update({
      letra: "w",
      hora_inicio: "13:10:00",
      hora_fim: "14:50:00",
      turno: "TARDE",
    });

    expect(horario.letra).toBe("w");
    expect(horario.turno).toBe("TARDE");
  });

  it("Should not be able to update a nonexisting horario record", async () => {
    await expect(async () => {
      await handleHorarioService.update({
        letra: "z",
        hora_inicio: "13:10:00",
        hora_fim: "14:50:00",
        turno: "TARDE",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a horario record", async () => {
    await handleHorarioService.create({
      letra: "w",
      hora_inicio: "08:50:00",
      hora_fim: "09:40:00",
      turno: "MANHÃ",
    });

    await handleHorarioService.create({
      letra: "q",
      hora_inicio: "13:10:00",
      hora_fim: "14:50:00",
      turno: "TARDE",
    });

    await handleHorarioService.delete("w");

    const horarios = await handleHorarioService.read();

    expect(horarios).toHaveLength(1);
  });
});
