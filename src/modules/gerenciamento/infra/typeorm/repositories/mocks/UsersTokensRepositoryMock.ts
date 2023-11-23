import { ICreateUserTokenDTO } from "../../../../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../../entities/UserTokens";
import { IUsersTokensRepository } from "../interfaces/IUsersTokensRepository";

class UsersTokensRepositoryMock implements IUsersTokensRepository {
  private usersTokens: UserTokens[] = [];

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  async queryByUserIdAndRefToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (userTokenFounded) =>
        userTokenFounded.user_id === user_id &&
        userTokenFounded.refresh_token === refresh_token
    );

    return userToken;
  }

  async queryByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (userTokenFounded) => userTokenFounded.refresh_token === refresh_token
    );

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex(
      (userToken) => userToken.id === id
    );

    if (userTokenIndex > -1) {
      this.usersTokens.splice(userTokenIndex, 1);
    }
  }
}

export { UsersTokensRepositoryMock };
