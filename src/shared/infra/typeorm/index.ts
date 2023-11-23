import { DataSource } from "typeorm";

import { AtribuicaoManual } from "../../../modules/dinamica/infra/typeorm/entities/AtribuicaoManual";
import { AuditoriaFila } from "../../../modules/dinamica/infra/typeorm/entities/AuditoriaFila";
import { AuditoriaFilaNew } from "../../../modules/dinamica/infra/typeorm/entities/AuditoriaFilaNew";
import { AuditoriaPrioridade } from "../../../modules/dinamica/infra/typeorm/entities/AuditoriaPrioridade";
import { Cenario } from "../../../modules/dinamica/infra/typeorm/entities/Cenario";
import { CenarioFilaTurma } from "../../../modules/dinamica/infra/typeorm/entities/CenarioFilaTurma";
import { DistribuicaoCarga } from "../../../modules/dinamica/infra/typeorm/entities/DistribuicaoCarga";
import { DistribuicoesPossibilidade } from "../../../modules/dinamica/infra/typeorm/entities/DistribuicoesPossibilidade";
import { Etapa } from "../../../modules/dinamica/infra/typeorm/entities/Etapa";
import { Fila } from "../../../modules/dinamica/infra/typeorm/entities/Fila";
import { FilaTurma } from "../../../modules/dinamica/infra/typeorm/entities/FilaTurma";
import { FilaTurmaNew } from "../../../modules/dinamica/infra/typeorm/entities/FilaTurmaNew";
import { Oferta } from "../../../modules/dinamica/infra/typeorm/entities/Oferta";
import { Possibilidades } from "../../../modules/dinamica/infra/typeorm/entities/Possibilidades";
import { Prioridades } from "../../../modules/dinamica/infra/typeorm/entities/Prioridades";
import { Restricoes } from "../../../modules/dinamica/infra/typeorm/entities/Restricoes";
import { StatusDistribuicao } from "../../../modules/dinamica/infra/typeorm/entities/StatusDistribuicao";
import { StatusPossibilidades } from "../../../modules/dinamica/infra/typeorm/entities/StatusPossibilidades";
import { CargaDocente } from "../../../modules/estrutura/infra/typeorm/entities/CargaDocente";
import { Curso } from "../../../modules/estrutura/infra/typeorm/entities/Curso";
import { Disciplina } from "../../../modules/estrutura/infra/typeorm/entities/Disciplina";
import { Horario } from "../../../modules/estrutura/infra/typeorm/entities/Horario";
import { Ministra } from "../../../modules/estrutura/infra/typeorm/entities/Ministra";
import { Professor } from "../../../modules/estrutura/infra/typeorm/entities/Professor";
import { Semana } from "../../../modules/estrutura/infra/typeorm/entities/Semana";
import { Semestre } from "../../../modules/estrutura/infra/typeorm/entities/Semestre";
import { Turma } from "../../../modules/estrutura/infra/typeorm/entities/Turma";
import { User } from "../../../modules/gerenciamento/infra/typeorm/entities/User";
import { UserTokens } from "../../../modules/gerenciamento/infra/typeorm/entities/UserTokens";
import { CreateUser1628620725509 } from "./migrations/1630774059682-CreateUser";
import { CreateProfessor1628703770650 } from "./migrations/1630774328927-CreateProfessor";
import { CreateCargaDocente1630151928753 } from "./migrations/1630776063267-CreateCargaDocente";
import { CreateCurso1629829824555 } from "./migrations/1630778469728-CreateCurso";
import { CreateDisciplina1629842575630 } from "./migrations/1630779661185-CreateDisciplina";
import { CreateHorario1630070405044 } from "./migrations/1630780868165-CreateHorario";
import { CreateSemana1630029377547 } from "./migrations/1630782202028-CreateSemana";
import { CreateSemestre1629978581031 } from "./migrations/1630782695141-CreateSemestres";
import { CreateTurma1629995830489 } from "./migrations/1630794708544-CreateTurma";
import { CreateMinistra1630258332236 } from "./migrations/1630797006420-CreateMinistra";
import { CreateUsersToken1630845113046 } from "./migrations/1630845113046-CreateUsersToken";
import { AlterTableCargaDocenteChangePrimaryKey1631207525145 } from "./migrations/1631207525145-AlterTableCargaDocenteChangePrimaryKey";
import { AlterTableMinistraChangePrimaryKey1631281746815 } from "./migrations/1631281746815-AlterTableMinistraChangePrimaryKey";
import { CreateAuditoriaFila1635634417497 } from "./migrations/1635634417497-CreateAuditoriaFila";
import { CreateAuditoriaFilaNew1635691339744 } from "./migrations/1635691339744-CreateAuditoriaFilaNew";
import { CreateAuditoriaPrioridade1635723667625 } from "./migrations/1635723667625-CreateAuditoriaPrioridade";
import { CreateEtapa1635785698510 } from "./migrations/1635785698510-CreateEtapa";
import { CreatePrioridades1635798864757 } from "./migrations/1635798864757-CreatePrioridades";
import { CreateStatusDistribuicao1635867934993 } from "./migrations/1635867934993-CreateStatusDistribuicao";
import { CreateCenario1635887937042 } from "./migrations/1635887937042-CreateCenario";
import { CreatePossibilidades1635944928644 } from "./migrations/1635944928644-CreatePossibilidades";
import { CreateAtribuicaoManual1635968706085 } from "./migrations/1635968706085-CreateAtribuicaoManual";
import { CreateOferta1636031790304 } from "./migrations/1636031790304-CreateOferta";
import { CreateRestricoes1636053364363 } from "./migrations/1636053364363-CreateRestricoes";
import { CreateDistribuicaoCarga1636063238625 } from "./migrations/1636063238625-CreateDistribuicaoCarga";
import { CreateDistribuicoesPossibilidade1636076744582 } from "./migrations/1636076744582-CreateDistribuicoesPossibilidade";
import { CreateFila1636122729594 } from "./migrations/1636122729594-CreateFila";
import { CreateFilaTurmaNew1636146045640 } from "./migrations/1636146045640-CreateFilaTurmaNew";
import { CreateCenarioFilaTurma1636196509376 } from "./migrations/1636196509376-CreateCenarioFilaTurma";
import { AlterTableIsUniqueStatusDistribuicao1636221018524 } from "./migrations/1636221018524-AlterTableIsUniqueStatusDistribuicao";
import { CreateStatusPossibilidades1636221364682 } from "./migrations/1636221364682-CreateStatusPossibilidades";
import { LigarUsuarioComProfessor1659541099710 } from "./migrations/1659541099710-LigarUsuarioComProfessor";

require("dotenv").config();

export const dataSource = new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL ||
    "postgres://postgres:a1s2d3@localhost:5432/disciplinas",
  host: process.env.TYPEORM_HOST || "localhost",
  port: (process.env.TYPEORM_PORT as unknown as number) || 5432,
  username: process.env.TYPEORM_USERNAME || "postgres",
  password: process.env.TYPEORM_PASSWORD || "a1s2d3",
  database: process.env.TYPEORM_DATABASE || "disciplinas",
  logging: true,
  migrations: [
    CreateUser1628620725509,
    CreateProfessor1628703770650,
    CreateCargaDocente1630151928753,
    CreateCurso1629829824555,
    CreateDisciplina1629842575630,
    CreateHorario1630070405044,
    CreateSemana1630029377547,
    CreateSemestre1629978581031,
    CreateTurma1629995830489,
    CreateMinistra1630258332236,
    CreateUsersToken1630845113046,
    AlterTableCargaDocenteChangePrimaryKey1631207525145,
    AlterTableMinistraChangePrimaryKey1631281746815,
    CreateAuditoriaFila1635634417497,
    CreateAuditoriaFilaNew1635691339744,
    CreateAuditoriaPrioridade1635723667625,
    CreateEtapa1635785698510,
    CreatePrioridades1635798864757,
    CreateStatusDistribuicao1635867934993,
    CreateCenario1635887937042,
    CreatePossibilidades1635944928644,
    CreateAtribuicaoManual1635968706085,
    CreateOferta1636031790304,
    CreateRestricoes1636053364363,
    CreateDistribuicaoCarga1636063238625,
    CreateDistribuicoesPossibilidade1636076744582,
    CreateFila1636122729594,
    CreateFilaTurmaNew1636146045640,
    CreateCenarioFilaTurma1636196509376,
    AlterTableIsUniqueStatusDistribuicao1636221018524,
    CreateStatusPossibilidades1636221364682,
    LigarUsuarioComProfessor1659541099710,
  ],
  entities: [
    User,
    UserTokens,
    CargaDocente,
    Curso,
    Disciplina,
    Horario,
    Ministra,
    Professor,
    Semana,
    Semestre,
    Turma,
    AtribuicaoManual,
    AuditoriaFila,
    AuditoriaFilaNew,
    AuditoriaPrioridade,
    Cenario,
    CenarioFilaTurma,
    DistribuicaoCarga,
    DistribuicoesPossibilidade,
    Etapa,
    Fila,
    FilaTurma,
    FilaTurmaNew,
    Oferta,
    Possibilidades,
    Prioridades,
    Restricoes,
    StatusDistribuicao,
    StatusPossibilidades,
  ],
});

// export default async (host = config.host): Promise<Connection> => {
//   const defaultOptions = await getConnectionOptions();
//
//   return createConnection(
//     Object.assign(config, {
//       host,
//       database:
//         process.env.NODE_ENV === "test"
//           ? "disciplinas_test"
//           : defaultOptions.database,
//     })
//   );
// };
