import { container } from "tsyringe";

import "./providers";

import { AtribuicaoManualRepository } from "../../modules/dinamica/infra/typeorm/repositories/AtribuicaoManualRepository";
import { AuditoriaFilaNewRepository } from "../../modules/dinamica/infra/typeorm/repositories/AuditoriaFilaNewRepository";
import { AuditoriaFilaRepository } from "../../modules/dinamica/infra/typeorm/repositories/AuditoriaFilaRepository";
import { AuditoriaPrioridadeRepository } from "../../modules/dinamica/infra/typeorm/repositories/AuditoriaPrioridadeRepository";
import { CenarioFilaTurmaRepository } from "../../modules/dinamica/infra/typeorm/repositories/CenarioFilaTurmaRepository";
import { CenarioRepository } from "../../modules/dinamica/infra/typeorm/repositories/CenarioRepository";
import { DistribuicaoCargaRepository } from "../../modules/dinamica/infra/typeorm/repositories/DistribuicaoCargaRepository";
import { DistribuicoesPossibilidadeRepository } from "../../modules/dinamica/infra/typeorm/repositories/DistribuicoesPossibilidadeRepository";
import { EtapaRepository } from "../../modules/dinamica/infra/typeorm/repositories/EtapaRepository";
import { FilaRepository } from "../../modules/dinamica/infra/typeorm/repositories/FilaRepository";
import { FilaTurmaNewRepository } from "../../modules/dinamica/infra/typeorm/repositories/FilaTurmaNewRepository";
import { IAtribuicaoManualRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IAtribuicaoManualRepository";
import { IAuditoriaFilaNewRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IAuditoriaFilaNewRepository";
import { IAuditoriaFilaRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IAuditoriaFilaRepository";
import { IAuditoriaPrioridadeRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IAuditoriaPrioridadeRepository";
import { ICenarioFilaTurmaRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/ICenarioFilaTurmaRepository";
import { ICenarioRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/ICenarioRepository";
import { IDistribuicaoCargaRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IDistribuicaoCargaRepository";
import { IDistribuicoesPossibilidadeRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IDistribuicoesPossibilidadeRepository";
import { IEtapaRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IEtapaRepository";
import { IFilaRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IFilaRepository";
import { IFilaTurmaNewRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IFilaTurmaNewRepository";
import { IOfertaRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IOfertaRepository";
import { IPossibilidadesRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IPossibilidadesRepository";
import { IPrioridadesRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IPrioridadesRepository";
import { IRestricoesRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IRestricoesRepository";
import { IStatusDistribuicaoRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IStatusDistribuicaoRepository";
import { IStatusPossibilidadesRepository } from "../../modules/dinamica/infra/typeorm/repositories/interfaces/IStatusPossibilidadesRepository";
import { OfertaRepository } from "../../modules/dinamica/infra/typeorm/repositories/OfertaRepository";
import { PossibilidadesRepository } from "../../modules/dinamica/infra/typeorm/repositories/PossibilidadesRepository";
import { PrioridadesRepository } from "../../modules/dinamica/infra/typeorm/repositories/PrioridadesRepository";
import { RestricoesRepository } from "../../modules/dinamica/infra/typeorm/repositories/RestricoesRepository";
import { StatusDistribuicaoRepository } from "../../modules/dinamica/infra/typeorm/repositories/StatusDistribuicaoRepository";
import { StatusPossibilidadesRepository } from "../../modules/dinamica/infra/typeorm/repositories/StatusPossibilidadesRepository";
import { CargaDocentesRepository } from "../../modules/estrutura/infra/typeorm/repositories/CargaDocentesRepository";
import { CursosRepository } from "../../modules/estrutura/infra/typeorm/repositories/CursosRepository";
import { DisciplinasRepository } from "../../modules/estrutura/infra/typeorm/repositories/DisciplinasRepository";
import { HorariosRepository } from "../../modules/estrutura/infra/typeorm/repositories/HorariosRepository";
import { ICargaDocentesRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/ICargaDocentesRepository";
import { ICursosRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/ICursosRepository";
import { IDisciplinasRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/IDisciplinasRepository";
import { IHorariosRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/IHorariosRepository";
import { IMinistraRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/IMinistraRepository";
import { IProfessoresRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/IProfessoresRepository";
import { ISemanasRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/ISemanasRepository";
import { ISemestresRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/ISemestresRepository";
import { ITurmasRepository } from "../../modules/estrutura/infra/typeorm/repositories/interfaces/ITurmasRepository";
import { MinistraRepository } from "../../modules/estrutura/infra/typeorm/repositories/MinistraRepository";
import { ProfessoresRepository } from "../../modules/estrutura/infra/typeorm/repositories/ProfessoresRepository";
import { SemanasRepository } from "../../modules/estrutura/infra/typeorm/repositories/SemanasRepository";
import { SemestresRepository } from "../../modules/estrutura/infra/typeorm/repositories/SemestresRepository";
import { TurmasRepository } from "../../modules/estrutura/infra/typeorm/repositories/TurmasRepository";
import { IUsersRepository } from "../../modules/gerenciamento/infra/typeorm/repositories/interfaces/IUsersRepository";
import { IUsersTokensRepository } from "../../modules/gerenciamento/infra/typeorm/repositories/interfaces/IUsersTokensRepository";
import { UsersRepository } from "../../modules/gerenciamento/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "../../modules/gerenciamento/infra/typeorm/repositories/UsersTokensRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IProfessoresRepository>(
  "ProfessoresRepository",
  ProfessoresRepository
);

container.registerSingleton<ICursosRepository>(
  "CursosRepository",
  CursosRepository
);

container.registerSingleton<IDisciplinasRepository>(
  "DisciplinasRepository",
  DisciplinasRepository
);

container.registerSingleton<ISemestresRepository>(
  "SemestresRepository",
  SemestresRepository
);

container.registerSingleton<ITurmasRepository>(
  "TurmasRepository",
  TurmasRepository
);

container.registerSingleton<ISemanasRepository>(
  "SemanasRepository",
  SemanasRepository
);

container.registerSingleton<IHorariosRepository>(
  "HorariosRepository",
  HorariosRepository
);

container.registerSingleton<ICargaDocentesRepository>(
  "CargaDocentesRepository",
  CargaDocentesRepository
);

container.registerSingleton<IMinistraRepository>(
  "MinistraRepository",
  MinistraRepository
);

container.registerSingleton<IUsersTokensRepository>(
  "UsersTokensRepository",
  UsersTokensRepository
);

container.registerSingleton<IAuditoriaFilaRepository>(
  "AuditoriaFilaRepository",
  AuditoriaFilaRepository
);

container.registerSingleton<IAuditoriaFilaNewRepository>(
  "AuditoriaFilaNewRepository",
  AuditoriaFilaNewRepository
);

container.registerSingleton<IAuditoriaPrioridadeRepository>(
  "AuditoriaPrioridadeRepository",
  AuditoriaPrioridadeRepository
);

container.registerSingleton<IEtapaRepository>(
  "EtapaRepository",
  EtapaRepository
);

container.registerSingleton<IPrioridadesRepository>(
  "PrioridadesRepository",
  PrioridadesRepository
);

container.registerSingleton<IStatusDistribuicaoRepository>(
  "StatusDistribuicaoRepository",
  StatusDistribuicaoRepository
);

container.registerSingleton<ICenarioRepository>(
  "CenarioRepository",
  CenarioRepository
);

container.registerSingleton<IPossibilidadesRepository>(
  "PossibilidadesRepository",
  PossibilidadesRepository
);

container.registerSingleton<IAtribuicaoManualRepository>(
  "AtribuicaoManualRepository",
  AtribuicaoManualRepository
);

container.registerSingleton<IOfertaRepository>(
  "OfertaRepository",
  OfertaRepository
);

container.registerSingleton<IRestricoesRepository>(
  "RestricoesRepository",
  RestricoesRepository
);

container.registerSingleton<IDistribuicaoCargaRepository>(
  "DistribuicaoCargaRepository",
  DistribuicaoCargaRepository
);

container.registerSingleton<IDistribuicoesPossibilidadeRepository>(
  "DistribuicoesPossibilidadeRepository",
  DistribuicoesPossibilidadeRepository
);

container.registerSingleton<IFilaRepository>("FilaRepository", FilaRepository);

container.registerSingleton<IFilaTurmaNewRepository>(
  "FilaTurmaNewRepository",
  FilaTurmaNewRepository
);

container.registerSingleton<ICenarioFilaTurmaRepository>(
  "CenarioFilaTurmaRepository",
  CenarioFilaTurmaRepository
);

container.registerSingleton<IStatusPossibilidadesRepository>(
  "StatusPossibilidadesRepository",
  StatusPossibilidadesRepository
);
