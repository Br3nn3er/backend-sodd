import { AppError } from "../../../../../shared/errors/AppError";
import { DistribuicaoCargaRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/DistribuicaoRepositoryTestMock";
import { HandleDistribuicaoCargaService } from "../HandleDistribuicaoCargaService";

describe("Handle CRUD operations related to distribuicao_carga", () => {
  let distRepositoryTest: DistribuicaoCargaRepositoryTestMock;
  let handleDistribuicaoCargaService: HandleDistribuicaoCargaService;

  beforeEach(() => {
    distRepositoryTest = new DistribuicaoCargaRepositoryTestMock();
    handleDistribuicaoCargaService = new HandleDistribuicaoCargaService(
      distRepositoryTest
    );
  });

  it("Should be able to create a distribuicao_carga record", async () => {
    const dist = await handleDistribuicaoCargaService.create({
      cenario: 1,
      siape: "00001",
      regra: "rule_0001",
      carga: 5,
    });

    expect(dist.cenario).toBe(1);
    expect(dist.regra).toBe("rule_0001");
  });

  it("Should not be able to create an existing distribuicao_carga record", async () => {
    await expect(async () => {
      await handleDistribuicaoCargaService.create({
        cenario: 2,
        siape: "00002",
        regra: "rule_0002",
        carga: 5,
      });

      await handleDistribuicaoCargaService.create({
        cenario: 2,
        siape: "00002",
        regra: "rule_0002",
        carga: 5,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all dist records", async () => {
    await handleDistribuicaoCargaService.create({
      cenario: 2,
      siape: "00002",
      regra: "rule_0002",
      carga: 5,
    });

    await handleDistribuicaoCargaService.create({
      cenario: 3,
      siape: "00003",
      regra: "rule_0003",
      carga: 5,
    });

    await handleDistribuicaoCargaService.create({
      cenario: 4,
      siape: "00004",
      regra: "rule_0004",
      carga: 5,
    });

    const distList = await handleDistribuicaoCargaService.read();

    expect(distList).toHaveLength(3);
  });

  it("Should be able to update an existing distribuicao_carga record", async () => {
    await handleDistribuicaoCargaService.create({
      cenario: 5,
      siape: "00005",
      regra: "rule_0005",
      carga: 1,
    });

    await handleDistribuicaoCargaService.update({
      cenario: 5,
      siape: "00005",
      regra: "rule_0005",
      carga: 15,
    });

    const distResult = await distRepositoryTest.queryByCenarioESiapeERegra(
      5,
      "00005",
      "rule_0005"
    );

    expect(distResult.carga).toBe(15);
  });

  it("Should not be able to update an unexisting dist record", async () => {
    await expect(async () => {
      await handleDistribuicaoCargaService.update({
        cenario: 115,
        siape: "00005",
        regra: "rule_0005",
        carga: 15,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to delete a dist record", async () => {
    await handleDistribuicaoCargaService.create({
      cenario: 110,
      siape: "000110",
      regra: "rule_0110",
      carga: 10,
    });

    await handleDistribuicaoCargaService.delete(110, "000110", "rule_0110");

    const dists = await distRepositoryTest.listDistribuicoes();

    expect(dists).toHaveLength(0);
  });
});
