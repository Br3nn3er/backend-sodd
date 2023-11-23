import { Router } from "express";

import { atribuicaoManualRoutes } from "./atribuicaoManual.routes";
import { auditoriaFilaRoutes } from "./auditoriaFila.routes";
import { auditoriaFilaNewRoutes } from "./auditoriaFilaNew.routes";
import { auditoriaPrioridadeRoutes } from "./auditoriaPrioridade.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { cargasRoutes } from "./cargas.routes";
import { cenarioRoutes } from "./cenario.routes";
import { cenarioFilaTurmaRoutes } from "./cenarioFilaTurma.routes";
import { cursosRoutes } from "./cursos.routes";
import { disciplinasRoutes } from "./disciplinas.routes";
import { distRoutes } from "./distribuicaoCarga.routes";
import { distPossibilidadeRoutes } from "./distribuicoesPossibilidade.routes";
import { etapaRoutes } from "./etapa.routes";
import { filaRoutes } from "./fila.routes";
import { filaTurmaNewRoutes } from "./filaTurmaNew.routes";
import { horariosRoutes } from "./horarios.routes";
import { ministraRoutes } from "./ministra.routes";
import { ofertaRoutes } from "./oferta.routes";
import { passwordRoutes } from "./password.routes";
import { possibilidadeRoutes } from "./possibilidades.routes";
import { prioridadeRoutes } from "./prioridades.routes";
import { professoresRoutes } from "./professores.routes";
import { restricoesRoutes } from "./restricoes.routes";
import { semanasRoutes } from "./semanas.routes";
import { semestresRoutes } from "./semestres.routes";
import { statusDistribuicaoRoutes } from "./statusDistribuicao.routes";
import { statusPossibilidadesRoutes } from "./statusPossibilidades.routes";
import { turmasRoutes } from "./turmas.routes";
import { usersRoutes } from "./users.routes";

const mainRouter = Router();

// Gerenciamento
mainRouter.use("/users", usersRoutes);
mainRouter.use("/password", passwordRoutes);

// Estrutura
mainRouter.use("/professores", professoresRoutes);
mainRouter.use("/cursos", cursosRoutes);
mainRouter.use("/disciplinas", disciplinasRoutes);
mainRouter.use("/semestres", semestresRoutes);
mainRouter.use("/turmas", turmasRoutes);
mainRouter.use("/semanas", semanasRoutes);
mainRouter.use("/horarios", horariosRoutes);
mainRouter.use("/cargas", cargasRoutes);
mainRouter.use("/ministra", ministraRoutes);

// Dinamica
mainRouter.use("/auditoria_fila", auditoriaFilaRoutes);
mainRouter.use("/auditoria_new", auditoriaFilaNewRoutes);
mainRouter.use("/auditoria_prioridade", auditoriaPrioridadeRoutes);
mainRouter.use("/etapa", etapaRoutes);
mainRouter.use("/prioridade", prioridadeRoutes);
mainRouter.use("/status", statusDistribuicaoRoutes);
mainRouter.use("/cenario", cenarioRoutes);
mainRouter.use("/possibilidade", possibilidadeRoutes);
mainRouter.use("/atribuicao_manual", atribuicaoManualRoutes);
mainRouter.use("/oferta", ofertaRoutes);
mainRouter.use("/restricoes", restricoesRoutes);
mainRouter.use("/distribuicao_carga", distRoutes);
mainRouter.use("/distribuicoes_possibilidade", distPossibilidadeRoutes);
mainRouter.use("/fila", filaRoutes);
mainRouter.use("/fila_new", filaTurmaNewRoutes);
mainRouter.use("/cenario_fila_turma", cenarioFilaTurmaRoutes);
mainRouter.use("/status_possibilidades", statusPossibilidadesRoutes);

mainRouter.use(authenticateRoutes);

export { mainRouter };
