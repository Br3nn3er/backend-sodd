import {
  ICreateUsersDTO,
  IPatchUserDTO,
} from "../../../../dtos/ICreateUpdateUsersDTO";
import { User } from "../../entities/User";

interface IUsersRepository {
  createUser(dto: ICreateUsersDTO): Promise<User>;
  listUsers(): Promise<User[]>;
  queryByEmail(email: string): Promise<User>;
  queryById(id: string): Promise<User>;
  updateById(userToPatch: IPatchUserDTO): Promise<User>;
  deleteById(id: string): Promise<void>;
}

export { IUsersRepository };
