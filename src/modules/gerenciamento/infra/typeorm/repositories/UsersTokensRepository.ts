import { getRepository, Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateUserTokenDTO } from "../../../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../entities/UserTokens";
import { IUsersTokensRepository } from "./interfaces/IUsersTokensRepository";

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = dataSource.getRepository(UserTokens);
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async queryByUserIdAndRefToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    return this.repository.findOne({
      where: {
        user_id,
        refresh_token,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async queryByRefreshToken(refresh_token: string): Promise<UserTokens> {
    return this.repository.findOneBy({ refresh_token });
  }
}

export { UsersTokensRepository };
