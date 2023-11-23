import { AppError } from "../../../../../shared/errors/AppError";
import { FilaTurmaRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/FilaTurmaRepositoryTestMock";
import { HandleFilaTurmaService } from "../HandleFilaTurmaService";

describe("Handle CRUD operations related to fila_turma", () => {
  let filaRepositoryTest: FilaTurmaRepositoryTestMock;
  let handleFilaTurmaService: HandleFilaTurmaService;

  beforeEach(() => {
    filaRepositoryTest = new FilaTurmaRepositoryTestMock();
    handleFilaTurmaService = new HandleFilaTurmaService(filaRepositoryTest);
  });

  it("Should be able to create a new fila_turma record", async () => {
    const fila = await handleFilaTurmaService.create({
      siape: "111111",
      id_turma: 99991,
      codigo_disc: "ABC",
      turma: "C",
      pos: 1231,
      prioridade: 0,
      qte_ministrada: 1,
      qte_maximo: 1,
      status: 1,
      ch: 10,
      id: 11111,
      periodo_preferencial: false,
    });

    expect(fila.id_turma).toBe(1);
    expect(fila.id_turma).toBe(1);
  });

  it("Should not be able to create an existing fila_turma record", async () => {
    await expect(async () => {
      await handleFilaTurmaService.create({
        siape: "111112",
        id_turma: 99992,
        codigo_disc: "ABC",
        turma: "C",
        pos: 1232,
        prioridade: 0,
        qte_ministrada: 1,
        qte_maximo: 1,
        status: 1,
        ch: 10,
        id: 11112,
        periodo_preferencial: false,
      });

      await handleFilaTurmaService.create({
        siape: "111112",
        id_turma: 99992,
        codigo_disc: "ABC",
        turma: "C",
        pos: 1232,
        prioridade: 0,
        qte_ministrada: 1,
        qte_maximo: 1,
        status: 1,
        ch: 10,
        id: 11112,
        periodo_preferencial: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all fila_turma records", async () => {
    await handleFilaTurmaService.create({
      siape: "111113",
      id_turma: 99993,
      codigo_disc: "ABC",
      turma: "C",
      pos: 1233,
      prioridade: 0,
      qte_ministrada: 1,
      qte_maximo: 1,
      status: 1,
      ch: 10,
      id: 11113,
      periodo_preferencial: false,
    });

    await handleFilaTurmaService.create({
      siape: "111114",
      id_turma: 99994,
      codigo_disc: "ABC",
      turma: "C",
      pos: 1234,
      prioridade: 0,
      qte_ministrada: 1,
      qte_maximo: 1,
      status: 1,
      ch: 10,
      id: 11114,
      periodo_preferencial: false,
    });

    const filas = await handleFilaTurmaService.read();

    expect(filas).toHaveLength(2);
  });

  it("Should be able to update an existing fila_turma record", async () => {
    await handleFilaTurmaService.create({
      siape: "111115",
      id_turma: 99995,
      codigo_disc: "ABC",
      turma: "C",
      pos: 1235,
      prioridade: 0,
      qte_ministrada: 1,
      qte_maximo: 1,
      status: 1,
      ch: 10,
      id: 11115,
      periodo_preferencial: false,
    });

    await handleFilaTurmaService.update({
      siape: "111115",
      id_turma: 99995,
      codigo_disc: "ABC",
      turma: "XYZ",
      pos: 1235,
      prioridade: 0,
      qte_ministrada: 1,
      qte_maximo: 1,
      status: 0,
      ch: 10,
      id: 11115,
      periodo_preferencial: false,
    });

    const filaResult = await filaRepositoryTest.queryById(11115);

    expect(filaResult.prioridade).toBe(0);
  });

  it("Should not be able to update an unexisting fila_turma record", async () => {
    await expect(async () => {
      await handleFilaTurmaService.update({
        siape: "111116",
        id_turma: 99996,
        codigo_disc: "ABC",
        turma: "C",
        pos: 1236,
        prioridade: 0,
        qte_ministrada: 1,
        qte_maximo: 1,
        status: 1,
        ch: 10,
        id: 11116,
        periodo_preferencial: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a fila_turma record", async () => {
    await handleFilaTurmaService.create({
      siape: "111116",
      id_turma: 99996,
      codigo_disc: "ABC",
      turma: "C",
      pos: 1236,
      prioridade: 0,
      qte_ministrada: 1,
      qte_maximo: 1,
      status: 1,
      ch: 10,
      id: 11116,
      periodo_preferencial: false,
    });

    await handleFilaTurmaService.delete(11116);

    const filas = await filaRepositoryTest.listFilas();

    expect(filas).toHaveLength(0);
  });
});
