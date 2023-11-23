import {
  ICreateUsersDTO,
  IPatchUserDTO,
} from "../../../../dtos/ICreateUpdateUsersDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../interfaces/IUsersRepository";

class UsersRepositoryTestMock implements IUsersRepository {
  users: User[] = [];

  async createUser({
    name,
    email,
    password,
    isAdmin,
  }: ICreateUsersDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { name, email, password, isAdmin });

    this.users.push(user);

    return user;
  }

  async queryByEmail(email: string): Promise<User> {
    const foundedUser = this.users.find((user) => user.email === email);

    return foundedUser;
  }

  async queryById(id: string): Promise<User> {
    const foundedUser = this.users.find((user) => user.id === id);

    return foundedUser;
  }

  async listUsers(): Promise<User[]> {
    return this.users;
  }

  async updateById({ id, name, isAdmin }: IPatchUserDTO): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    Object.assign(user, {
      name: name || user.name,
      isAdmin:
        isAdmin === null || isAdmin === undefined ? user.isAdmin : isAdmin,
    });

    this.users.push(user);

    return user;
  }

  async deleteById(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex > -1) {
      this.users.splice(userIndex, 1);
    }
  }
}

export { UsersRepositoryTestMock };
