import { AppError } from "../../../../../shared/errors/AppError";
import { SemestresRepositoryTestMock } from "../../../../estrutura/infra/typeorm/repositories/mocks/SemestresRepositoryTestMock";
import { FilaRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/FilaRepositoryTestMock";
import { HandleFilaService } from "../HandleFilaService";

describe("Handle CRUD operations related to fila", () => {
  let filaRepositoryTest: FilaRepositoryTestMock;
  let handleFilaService: HandleFilaService;
  let semestresRepositoryTestMock: SemestresRepositoryTestMock;

  beforeEach(() => {
    filaRepositoryTest = new FilaRepositoryTestMock();
    semestresRepositoryTestMock = new SemestresRepositoryTestMock();
    handleFilaService = new HandleFilaService(
      filaRepositoryTest,
      semestresRepositoryTestMock
    );
  });

  it("Should be able to create a new fila record", async () => {
    const fila = await handleFilaService.create({
      siape: "1024389",
      codigo_disc: "FACOM33501",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: 2019,
      semestre: 1,
      status: -1,
      periodo_preferencial: false,
    });

    expect(fila.siape).toBe("1024389");
    expect(fila.prioridade).toBe(14);
  });

  it("Should not be able to create an existing fila record", async () => {
    await expect(async () => {
      await handleFilaService.create({
        siape: "1024389",
        codigo_disc: "FACOM33501",
        pos: 40,
        prioridade: 14,
        qte_ministrada: 0,
        qte_maximo: 4,
        ano: 2019,
        semestre: 1,
        status: -1,
        periodo_preferencial: false,
      });

      await handleFilaService.create({
        siape: "1024389",
        codigo_disc: "FACOM33501",
        pos: 40,
        prioridade: 14,
        qte_ministrada: 0,
        qte_maximo: 4,
        ano: 2019,
        semestre: 1,
        status: -1,
        periodo_preferencial: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all fila records", async () => {
    await handleFilaService.create({
      siape: "1024389",
      codigo_disc: "FACOM33501",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: 2019,
      semestre: 1,
      status: -1,
      periodo_preferencial: false,
    });

    await handleFilaService.create({
      siape: "00100100",
      codigo_disc: "FACOM33501",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: 2020,
      semestre: 1,
      status: -1,
      periodo_preferencial: false,
    });

    const filas = await handleFilaService.read();

    expect(filas).toHaveLength(2);
  });

  it("Should be able to read fila records by discipline and semester", async () => {
    const semester = await semestresRepositoryTestMock.createSemestre({
      ano: 2020,
      semestre: 1,
      status: true,
    });

    await handleFilaService.create({
      siape: "1024389",
      codigo_disc: "FACOM33502",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: semester.ano,
      semestre: semester.semestre,
      status: -1,
      periodo_preferencial: false,
    });

    const filaB = await handleFilaService.create({
      siape: "00100100",
      codigo_disc: "FACOM33501",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: semester.ano,
      semestre: semester.semestre,
      status: -1,
      periodo_preferencial: false,
    });

    const filas = await handleFilaService.readByDisciplinaESemestre(
      "FACOM33501",
      semester.id
    );

    expect(filas).toHaveLength(1);
    expect(filas[0].id).toStrictEqual(filaB.id);
  });

  it("Should be able to read fila records by professor and semester", async () => {
    const semester = await semestresRepositoryTestMock.createSemestre({
      ano: 2021,
      semestre: 1,
      status: true,
    });

    await handleFilaService.create({
      siape: "SIAPE20",
      codigo_disc: "FACOM33502",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: semester.ano,
      semestre: semester.semestre,
      status: -1,
      periodo_preferencial: false,
    });

    const filaB = await handleFilaService.create({
      siape: "SIAPE21",
      codigo_disc: "FACOM33501",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: semester.ano,
      semestre: semester.semestre,
      status: -1,
      periodo_preferencial: false,
    });

    const filas = await handleFilaService.readByProfessorESemestre(
      "SIAPE21",
      semester.id
    );

    expect(filas).toHaveLength(1);
    expect(filas[0].id).toStrictEqual(filaB.id);
  });

  it("Should be able to update an existing fila record", async () => {
    await handleFilaService.create({
      siape: "1024389",
      codigo_disc: "FACOM33501",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: 2019,
      semestre: 1,
      status: -1,
      periodo_preferencial: false,
    });

    const filaToUpdate = await filaRepositoryTest.queryById(1);

    await handleFilaService.update({
      id: filaToUpdate.id,
      qte_ministrada: 50,
      qte_maximo: 60,
    });

    const filaResult = await filaRepositoryTest.queryById(filaToUpdate.id);

    expect(filaResult.qte_ministrada).toBe(50);
    expect(filaResult.qte_maximo).toBe(60);
  });

  it("Should not be able to update an unexisting fila record", async () => {
    await expect(async () => {
      await handleFilaService.update({
        id: 500,
        semestre: 2,
        status: 5,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a fila record", async () => {
    await handleFilaService.create({
      siape: "1024389",
      codigo_disc: "FACOM33501",
      pos: 40,
      prioridade: 14,
      qte_ministrada: 0,
      qte_maximo: 4,
      ano: 2019,
      semestre: 1,
      status: -1,
      periodo_preferencial: false,
    });

    await handleFilaService.delete(1);

    const filas = await filaRepositoryTest.listFilas();

    expect(filas).toHaveLength(0);
  });
});
