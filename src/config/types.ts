import { Request } from "express";

import { User } from "../modules/gerenciamento/infra/typeorm/entities/User";

export interface IRequestWithUser extends Request {
  user: User;
}
