import { User } from "../modules/gerenciamento/infra/typeorm/entities/User";

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    user?: User;
  }
}
