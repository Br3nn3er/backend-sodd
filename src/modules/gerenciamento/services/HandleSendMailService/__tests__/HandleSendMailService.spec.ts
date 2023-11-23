import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderMock } from "../../../../../shared/container/providers/MailProvider/mocks/MailProviderMock";
import { AppError } from "../../../../../shared/errors/AppError";
import { UsersRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/UsersRepositoryTestMock";
import { UsersTokensRepositoryMock } from "../../../infra/typeorm/repositories/mocks/UsersTokensRepositoryMock";
import { HandleSendMailService } from "../HandleSendMailService";

let handleSendMailService: HandleSendMailService;
let usersRepositoryMock: UsersRepositoryTestMock;
let usersTokensRepositoryMock: UsersTokensRepositoryMock;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderMock;

describe("Handle Send Mail Service", () => {
  beforeEach(() => {
    usersRepositoryMock = new UsersRepositoryTestMock();
    usersTokensRepositoryMock = new UsersTokensRepositoryMock();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderMock();

    handleSendMailService = new HandleSendMailService(
      usersRepositoryMock,
      usersTokensRepositoryMock,
      dateProvider,
      mailProvider
    );
  });

  it("Should be able to send a forgot password mail to a user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryMock.createUser({
      name: "Myrtle Malone",
      email: "wa@lebi.eu",
      password: "699505",
      isAdmin: false,
    });

    await handleSendMailService.sendForgotPasswordMail("wa@lebi.eu");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should be able to send an email if user does not exist", async () => {
    await expect(
      handleSendMailService.sendForgotPasswordMail("awfacpew@cihkewos.gb")
    ).rejects.toEqual(new AppError("Usuario nao existe!"));
  });

  it("Should be able to create an user token", async () => {
    const generatedTokenMail = jest.spyOn(usersTokensRepositoryMock, "create");

    await usersRepositoryMock.createUser({
      name: "Noah Robinson",
      email: "viifab@duhvuaf.bb",
      password: "010139",
      isAdmin: false,
    });

    await handleSendMailService.sendForgotPasswordMail("viifab@duhvuaf.bb");

    expect(generatedTokenMail).toHaveBeenCalled();
  });
});
