import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "../../../../../shared/errors/AppError";
import { UsersRepositoryTestMock } from "../../../infra/typeorm/repositories/mocks/UsersRepositoryTestMock";
import { UsersTokensRepositoryMock } from "../../../infra/typeorm/repositories/mocks/UsersTokensRepositoryMock";
import { HandleUserService } from "../HandleUserService";

let dateProvider: DayjsDateProvider;
let usersRepositoryTest: UsersRepositoryTestMock;
let usersTokensRepositoryTest: UsersTokensRepositoryMock;

let handleUserService: HandleUserService;

describe("Handle Users Operations", () => {
  beforeEach(() => {
    usersRepositoryTest = new UsersRepositoryTestMock();
    usersTokensRepositoryTest = new UsersTokensRepositoryMock();
    dateProvider = new DayjsDateProvider();

    handleUserService = new HandleUserService(
      usersRepositoryTest,
      usersTokensRepositoryTest,
      dateProvider
    );
  });

  it("Should be able to authenticate an user", async () => {
    const user = {
      name: "User Test Auth 1",
      email: "test1@auth.com",
      password: "hispassword",
    };

    await handleUserService.create({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: false,
    });

    const authentication = await handleUserService.authenticate({
      email: user.email,
      password: user.password,
    });

    expect(authentication).toHaveProperty("token");
  });

  it("Should not be able to authenticate an nonexisting user", () => {
    expect(async () => {
      await handleUserService.authenticate({
        email: "fail@fail.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate an user with incorrect password", async () => {
    await expect(async () => {
      await handleUserService.create({
        name: "Jeffery Ford",
        email: "tinusomu@ni.me",
        password: "841692",
        isAdmin: true,
      });

      await handleUserService.authenticate({
        email: "tinusomu@ni.me",
        password: "8098654840",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "Leroy Jensen",
      email: "bew@peulu.dm",
      password: "627979696",
    };

    await handleUserService.create({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: false,
    });

    const userCreated = await usersRepositoryTest.queryByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });

  it("Should list all users", async () => {
    const user = {
      name: "Henry Powell",
      email: "pikfaru@fina.tw",
      password: "73420613",
    };

    await handleUserService.create({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: false,
    });

    const listUsers = await handleUserService.list();

    const listUserResult = listUsers.find((user) => user.name);

    expect(listUserResult.name).toEqual(user.name);
  });

  it("Should be able to update an user", async () => {
    const user = {
      name: "Leroy Jensen",
      email: "bew@peulu.dm",
      password: "627979696",
    };

    await handleUserService.create({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: false,
    });

    const userCreated = await usersRepositoryTest.queryByEmail(user.email);

    const userToUpdate = await handleUserService.update({
      id: userCreated.id,
      isAdmin: true,
    });

    expect(userToUpdate.isAdmin).toBe(true);
  });

  it("Should not be able to update an user that is not registered", async () => {
    await expect(async () => {
      await handleUserService.update({
        id: "fake_id",
        isAdmin: true,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should delete an user", async () => {
    const user = {
      name: "Jackson Frazier",
      email: "vef@vujta.sh",
      password: "39701523",
    };

    await handleUserService.create({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: false,
    });

    const userToDelete = await usersRepositoryTest.queryByEmail(user.email);

    await handleUserService.delete(userToDelete.id);

    const result = await usersRepositoryTest.queryByEmail(user.email);

    expect(result).toBeUndefined();
  });

  it("Should not be able to create an existing user", async () => {
    await expect(async () => {
      const user = {
        name: "Helena Cox",
        email: "dikbi@hogacma.kw",
        password: "47527307",
      };

      await handleUserService.create({
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: false,
      });

      await handleUserService.create({
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: false,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
