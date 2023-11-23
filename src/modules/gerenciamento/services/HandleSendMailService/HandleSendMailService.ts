import { hash } from "bcrypt";
import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../infra/typeorm/repositories/interfaces/IUsersRepository";
import { IUsersTokensRepository } from "../../infra/typeorm/repositories/interfaces/IUsersTokensRepository";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class HandleSendMailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,

    @inject("EtherealMailProvider")
    private mailProvider: IMailProvider
  ) {}

  async sendForgotPasswordMail(email: string): Promise<void> {
    const user = await this.usersRepository.queryByEmail(email);

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "forgotPassword.hbs"
    );

    if (!user) {
      throw new AppError("Usuario nao existe!");
    }

    const token = uuidV4();

    const expires_date = this.dateProvider.addHours(3);

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };

    await this.mailProvider.sendMail(
      email,
      "Recuperacao de senha",
      variables,
      templatePath
    );
  }

  async resetPassword({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.queryByRefreshToken(
      token
    );

    if (!userToken) {
      throw new AppError("Token invalido!");
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      throw new AppError("Token expirado!");
    }

    const user = await this.usersRepository.queryById(userToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.createUser(user);

    await this.usersTokensRepository.deleteById(userToken.user_id);
  }
}

export { HandleSendMailService };
