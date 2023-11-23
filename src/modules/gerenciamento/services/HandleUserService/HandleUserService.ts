import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "../../../../config/auth";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import {
  ICreateUsersDTO,
  IPatchUserDTO,
} from "../../dtos/ICreateUpdateUsersDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../infra/typeorm/repositories/interfaces/IUsersRepository";
import { IUsersTokensRepository } from "../../infra/typeorm/repositories/interfaces/IUsersTokensRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
    isAdmin: boolean;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class HandleUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async authenticate({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.queryByEmail(email);
    const {
      expires_in_token,
      expires_in_refresh_token,
      secret_token,
      secret_refresh_token,
      expires_refresh_token_days,
    } = auth;

    if (!user) {
      throw new AppError("Email incorreta", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Senha incorreta", 401);
    }

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    return {
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      refresh_token,
    };
  }

  async create({
    name,
    email,
    password,
    isAdmin,
    siape,
  }: ICreateUsersDTO): Promise<User> {
    const hashedPassword = await hash(password, 8);

    const userExists = await this.usersRepository.queryByEmail(email);

    if (userExists) {
      throw new AppError("Usuario ja existe!", 401);
    }

    return this.usersRepository.createUser({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      siape,
    });
  }

  async list(): Promise<User[]> {
    const listUsers = await this.usersRepository.listUsers();

    listUsers.forEach((user) => {
      // eslint-disable-next-line no-param-reassign
      delete user.password;
    });

    return listUsers;
  }

  async getCurrentUserInfo(id: string): Promise<User> {
    const user = await this.usersRepository.queryById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 401);
    }

    delete user.password;

    return user;
  }

  async update({ id, name, isAdmin }: IPatchUserDTO): Promise<User> {
    const professorExists = await this.usersRepository.queryById(id);

    if (!professorExists) {
      throw new AppError("Este usuário não está cadastrado!", 401);
    }

    return this.usersRepository.updateById({
      id,
      name,
      isAdmin,
    });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }
}

export { HandleUserService };
