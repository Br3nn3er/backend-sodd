import "reflect-metadata";
import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "../../../../../shared/errors/AppError";
import { ProfessoresRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/ProfessoresRepositoryTestMock";
import { HandleProfessorService } from "../HandleProfessorService";

let professoresRepositoryTest: ProfessoresRepositoryTestMock;
let handleProfessorService: HandleProfessorService;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD operations related to a Professor", () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider();
    professoresRepositoryTest = new ProfessoresRepositoryTestMock(dateProvider);
    handleProfessorService = new HandleProfessorService(
      professoresRepositoryTest,
      dateProvider
    );
  });

  it("Should be able to create a new professor", async () => {
    const professor = {
      siape: "0001",
      nome: "João Marcos",
      data_ingresso: new Date(1989, 9, 29),
      data_nasc: new Date(1988, 1, 7),
      afastado: true,
      regime: "de",
      carga_atual: 8,
      locacao: "udi",
      cnome: "JMarcos",
      data_aposentadoria: new Date(2017, 2, 1),
      status: "ativo",
    };

    const professorCreated = await handleProfessorService.create({
      siape: professor.siape,
      nome: professor.nome,
      data_ingresso: professor.data_ingresso,
      data_nasc: professor.data_nasc,
      afastado: professor.afastado,
      regime: professor.regime,
      carga_atual: professor.carga_atual,
      locacao: professor.locacao,
      cnome: professor.cnome,
      data_aposentadoria: professor.data_aposentadoria,
      data_saida: null,
      data_exoneracao: null,
      status: professor.status,
    });

    expect(professorCreated.siape).toBe(professor.siape);
  });

  it("Should be able to create an existent professor", async () => {
    expect(async () => {
      await handleProfessorService.create({
        siape: "0001",
        nome: "João Marcos",
        data_ingresso: new Date(1989, 9, 29),
        data_nasc: new Date(1988, 1, 7),
        afastado: true,
        regime: "de",
        carga_atual: 8,
        locacao: "udi",
        cnome: "JMarcos",
        data_aposentadoria: new Date(2017, 2, 1),
        data_saida: null,
        data_exoneracao: null,
        status: "ativo",
      });

      await handleProfessorService.create({
        siape: "0001",
        nome: "Marcos Joao",
        data_ingresso: new Date(1989, 9, 29),
        data_nasc: new Date(1988, 1, 7),
        afastado: true,
        regime: "de",
        carga_atual: 8,
        locacao: "udi",
        cnome: "MJoao",
        data_aposentadoria: new Date(2017, 2, 1),
        data_saida: null,
        data_exoneracao: null,
        status: "ativo",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to list all professores", async () => {
    const professor = await handleProfessorService.create({
      siape: "0001",
      nome: "João Marcos",
      data_ingresso: new Date(1989, 9, 29),
      data_nasc: new Date(1988, 1, 7),
      afastado: true,
      regime: "de",
      carga_atual: 8,
      locacao: "udi",
      cnome: "JMarcos",
      data_aposentadoria: new Date(2017, 2, 1),
      data_saida: null,
      data_exoneracao: null,
      status: "ativo",
    });

    const professores = await handleProfessorService.read();

    const listProfessoresResult = professores.find(
      (professor) => professor.siape
    );

    expect(listProfessoresResult.siape).toEqual(professor.siape);
  });

  it("Should be able to read only professor record", async () => {
    await handleProfessorService.create({
      siape: "0001",
      nome: "Professor 1",
      data_ingresso: new Date(1989, 9, 29),
      data_nasc: new Date(1988, 1, 7),
      afastado: true,
      regime: "de",
      carga_atual: 8,
      locacao: "udi",
      cnome: "P1",
      data_aposentadoria: new Date(2017, 2, 1),
      data_saida: null,
      data_exoneracao: null,
      status: "ativo",
    });

    const professor2 = await handleProfessorService.create({
      siape: "0002",
      nome: "Professor 2",
      data_ingresso: new Date(1989, 9, 29),
      data_nasc: new Date(1988, 1, 7),
      afastado: true,
      regime: "de",
      carga_atual: 8,
      locacao: "udi",
      cnome: "P2",
      data_aposentadoria: new Date(2017, 2, 1),
      data_saida: null,
      data_exoneracao: null,
      status: "ativo",
    });

    const result = await handleProfessorService.readBySiape(professor2.siape);

    expect(result.siape).toEqual(professor2.siape);
  });

  it("Should be able to update an existing professor", async () => {
    const professor = {
      siape: "827175",
      nome: "Helen Sims",
      data_ingresso: new Date(1989, 9, 29),
      data_nasc: new Date(1988, 1, 7),
      afastado: true,
      regime: "de",
      carga_atual: 8,
      locacao: "udi",
      cnome: "HSims",
      data_aposentadoria: new Date(2017, 2, 1),
      status: "ativo",
    };

    await handleProfessorService.create({
      siape: professor.siape,
      nome: professor.nome,
      data_ingresso: professor.data_ingresso,
      data_nasc: professor.data_nasc,
      afastado: professor.afastado,
      regime: professor.regime,
      carga_atual: professor.carga_atual,
      locacao: professor.locacao,
      cnome: professor.cnome,
      data_aposentadoria: professor.data_aposentadoria,
      data_saida: null,
      data_exoneracao: null,
      status: professor.status,
    });

    const dateToUpdate = dateProvider.processDateToUTC(new Date("1998-11-11"));

    const professorToUpdate = await handleProfessorService.update({
      siape: professor.siape,
      data_nasc: dateToUpdate,
      nome: "John Doe",
    });

    expect(professorToUpdate.nome).toBe("John Doe");
    expect(professorToUpdate.data_nasc).toStrictEqual(dateToUpdate);
  });

  it("Should not be able to update an non-existing professor", async () => {
    await expect(async () => {
      await handleProfessorService.update({
        siape: "8114418",
        nome: "John Doe",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a professor record", async () => {
    const professor = {
      siape: "827175",
      nome: "Helen Sims",
      data_ingresso: new Date(1989, 9, 29),
      data_nasc: new Date(1988, 1, 7),
      afastado: true,
      regime: "de",
      carga_atual: 8,
      locacao: "udi",
      cnome: "HSims",
      data_aposentadoria: new Date(2017, 2, 1),
      status: "ativo",
    };

    await handleProfessorService.create({
      siape: professor.siape,
      nome: professor.nome,
      data_ingresso: professor.data_ingresso,
      data_nasc: professor.data_nasc,
      afastado: professor.afastado,
      regime: professor.regime,
      carga_atual: professor.carga_atual,
      locacao: professor.locacao,
      cnome: professor.cnome,
      data_aposentadoria: professor.data_aposentadoria,
      data_saida: null,
      data_exoneracao: null,
      status: professor.status,
    });

    await handleProfessorService.delete(professor.siape);

    const result = await professoresRepositoryTest.queryBySiape(
      professor.siape
    );

    expect(result).toBeUndefined();
  });
});
