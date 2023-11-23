import { AppError } from "../../../../../shared/errors/AppError";
import { SemestresRepositoryTestMock } from "../../../../estrutura/infra/typeorm/repositories/mocks/SemestresRepositoryTestMock";
import { OfertaRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/OfertaRepositoryTestMock";
import { HandleOfertaService } from "../HandleOfertaService";

describe("Handle CRUD operations related to oferta", () => {
  let ofertaRepositoryTest: OfertaRepositoryTestMock;
  let semestreRepositoryTest: SemestresRepositoryTestMock;
  let handleOfertaService: HandleOfertaService;

  beforeEach(() => {
    ofertaRepositoryTest = new OfertaRepositoryTestMock();
    semestreRepositoryTest = new SemestresRepositoryTestMock();
    handleOfertaService = new HandleOfertaService(
      ofertaRepositoryTest,
      semestreRepositoryTest
    );
  });

  it("Should be able to create a oferta relationship", async () => {
    const oferta = await handleOfertaService.create({
      dia: "1",
      letra: "B",
      id_turma: 5,
    });

    expect(oferta.dia).toBe("1");
    expect(oferta.id_turma).toBe(5);
  });

  it("Should not be able to create an existing oferta record", async () => {
    await expect(async () => {
      await handleOfertaService.create({
        dia: "1",
        letra: "B",
        id_turma: 5,
      });

      await handleOfertaService.create({
        dia: "1",
        letra: "B",
        id_turma: 5,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to read all oferta records", async () => {
    await handleOfertaService.create({
      dia: "1",
      letra: "B",
      id_turma: 5,
    });

    await handleOfertaService.create({
      dia: "2",
      letra: "C",
      id_turma: 6,
    });

    await handleOfertaService.create({
      dia: "3",
      letra: "B",
      id_turma: 4,
    });

    const ofertaList = await handleOfertaService.read();

    expect(ofertaList).toHaveLength(3);
  });

  it("Should be able to delete a oferta record", async () => {
    await handleOfertaService.create({
      dia: "3",
      letra: "B",
      id_turma: 4,
    });

    await handleOfertaService.delete("1");

    const ofertas = await ofertaRepositoryTest.listOfertas();

    expect(ofertas).toHaveLength(0);
  });
});
