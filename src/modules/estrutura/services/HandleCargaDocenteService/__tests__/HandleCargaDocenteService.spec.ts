import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "../../../../../shared/errors/AppError";
import { CargaDocentesRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/CargaDocentesRepositoryTestMock";
import { ProfessoresRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/ProfessoresRepositoryTestMock";
import { HandleCargaDocenteService } from "../HandleCargaDocenteService";

let cargaDocenteRepositoryTest: CargaDocentesRepositoryTestMock;
let cargaDocenteService: HandleCargaDocenteService;

let dateProvider: DayjsDateProvider;
let professorRepositoryTest: ProfessoresRepositoryTestMock;

describe("Handle CRUD operations related to carga docente", () => {
  beforeEach(async () => {
    dateProvider = new DayjsDateProvider();
    professorRepositoryTest = new ProfessoresRepositoryTestMock(dateProvider);
    cargaDocenteRepositoryTest = new CargaDocentesRepositoryTestMock();

    cargaDocenteService = new HandleCargaDocenteService(
      cargaDocenteRepositoryTest
    );

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

    await professorRepositoryTest.createProfessor({
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
  });

  it("Should be able to create a carga docente record", async () => {
    const carga = {
      siape: "0001",
      carga_atual: 16,
      ano: 2015,
      semestre: 2,
    };

    const cargaCreated = await cargaDocenteService.create({
      siape: carga.siape,
      carga_atual: carga.carga_atual,
      ano: carga.ano,
      semestre: carga.semestre,
    });

    expect(cargaCreated.carga_atual).toBe(16);
    expect(cargaCreated.ano).toBe(2015);
    expect(cargaCreated.semestre).toBe(2);
  });

  it("Should not be able to create more than one carga docente for the same siape", async () => {
    expect(async () => {
      const carga = {
        siape: "0001",
        carga_atual: 16,
        ano: 2015,
        semestre: 2,
      };

      await cargaDocenteService.create({
        siape: carga.siape,
        carga_atual: carga.carga_atual,
        ano: carga.ano,
        semestre: carga.semestre,
      });

      await cargaDocenteService.create({
        siape: carga.siape,
        carga_atual: 20,
        ano: 2021,
        semestre: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read carga docente records", async () => {
    const carga = {
      siape: "0001",
      carga_atual: 16,
      ano: 2015,
      semestre: 2,
    };

    await cargaDocenteService.create({
      siape: carga.siape,
      carga_atual: carga.carga_atual,
      ano: carga.ano,
      semestre: carga.semestre,
    });

    const cargaDocentes = await cargaDocenteService.read();

    expect(cargaDocentes).toHaveLength(1);
  });

  it("Should be able to update a carga docente record", async () => {
    const carga = {
      siape: "0001",
      carga_atual: 16,
      ano: 2015,
      semestre: 2,
    };

    await cargaDocenteService.create({
      siape: carga.siape,
      carga_atual: carga.carga_atual,
      ano: carga.ano,
      semestre: carga.semestre,
    });

    const cargaAfter = await cargaDocenteService.update({
      siape: carga.siape,
      carga_atual: 25,
      ano: 2021,
      semestre: 1,
    });

    expect(cargaAfter.carga_atual).toBe(25);
    expect(cargaAfter.ano).toBe(2021);
    expect(cargaAfter.semestre).toBe(1);
  });

  it("Should not be able to update a carga docente with a non existing siape", async () => {
    await expect(async () => {
      await cargaDocenteService.update({
        siape: "74628157",
        carga_atual: 25,
        ano: 2021,
        semestre: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a carga docente record", async () => {
    const carga = {
      siape: "0001",
      carga_atual: 16,
      ano: 2015,
      semestre: 2,
    };

    await cargaDocenteService.create({
      siape: carga.siape,
      carga_atual: carga.carga_atual,
      ano: carga.ano,
      semestre: carga.semestre,
    });

    await cargaDocenteService.deleteBySiape("0001");

    const cargas = await cargaDocenteService.read();

    expect(cargas).toHaveLength(0);
  });
});
