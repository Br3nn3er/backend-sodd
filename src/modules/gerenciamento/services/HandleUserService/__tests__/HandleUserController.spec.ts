import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { User } from "../../../infra/typeorm/entities/User";

let connection: Connection;

describe("Handle CRUD operations related to user", () => {
  beforeAll(async () => {
    connection = await dataSource.initialize();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
      values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate an user", async () => {
    const response = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("sodd_tcc@outlook.com");
  });

  it("Should not be able to authenticate an user with unexisting email", async () => {
    const response = await request(app).post("/sessions").send({
      email: "zuos@nav.lc",
      password: "admin",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email ou senha incorreta");
  });

  it("Should not be able to authenticate an user with wrong password", async () => {
    const response = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "notmypassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email ou senha incorreta");
  });

  it("Should be able to create a new user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/users")
      .send({
        name: "Tyler Stanley",
        email: "hu@abuhoh.fm",
        password: "password",
        isAdmin: false,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const user = response.body;

    expect(response.status).toBe(201);
    expect(user.message).toBe("Usuario criado com sucesso!");
  });

  it("Should not be able to create an existing user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/users")
      .send({
        name: "Tyler Stanley",
        email: "hu@abuhoh.fm",
        password: "password",
        isAdmin: false,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const user = response.body;

    expect(user.message).toBe("Usuario ja existe!");
    expect(response.status).toBe(401);
  });

  it("Should be able to read all users records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const user = new User();
    user.name = "Gertrude Moss";
    user.email = "ridjobed@pej.lu";
    user.password = "43967724873645";
    user.isAdmin = false;

    await connection.manager.save(user);

    const response = await request(app)
      .get("/users")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const users = response.body as User[];

    expect(response.status).toBe(200);
    expect(users).toHaveLength(3);
  });

  it("Should be able to read user by id", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/users")
      .send({
        name: "User 1",
        email: "user_1@pej.lu",
        password: "43967724873645",
        isAdmin: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/users")
      .send({
        name: "Other User",
        email: "other_user@pej.lu",
        password: "43967724873645",
        isAdmin: false,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { body: users } = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const otherUser = (users as User[]).find(
      (user) => user.email === "other_user@pej.lu"
    );

    const response = await request(app)
      .get(`/users/${otherUser.id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const userResonse = response.body as User;

    expect(response.status).toBe(200);
    expect(userResonse.id).toStrictEqual(otherUser.id);
  });

  it("Should return error because logged user is not admin", async () => {
    const {
      body: { token: firstToken },
    } = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    await request(app)
      .post("/users")
      .send({
        name: "Logged User",
        email: "logged_user@pej.lu",
        password: "43967724873645",
        isAdmin: false,
      })
      .set({
        Authorization: `Bearer ${firstToken}`,
      });

    await request(app)
      .post("/users")
      .send({
        name: "Other_User_2",
        email: "other_user_2@pej.lu",
        password: "43967724873645",
        isAdmin: false,
      })
      .set({
        Authorization: `Bearer ${firstToken}`,
      });

    const { body: users } = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer ${firstToken}`,
      });

    const loggedUser = (users as User[]).find(
      (user) => user.email === "logged_user@pej.lu"
    );
    const otherUser = (users as User[]).find(
      (user) => user.email === "other_user_2@pej.lu"
    );

    const responseToken = await request(app).post("/sessions").send({
      email: loggedUser.email,
      password: loggedUser.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get(`/users/${otherUser.id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.message).toBe("Token invalido!");
    expect(response.status).toBe(401);
  });

  it("Should be able to update an user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const user = new User();
    user.name = "Lenora Alvarez";
    user.email = "re@jel.ba";
    user.password = "41376861";
    user.isAdmin = false;

    await connection.manager.save(user);

    const response = await request(app)
      .get("/users")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const users = response.body as User[];

    const userToUpdate = users.find(
      (user) => user.email === "re@jel.ba" && user.name === "Lenora Alvarez"
    );

    const responseUpdate = await request(app)
      .patch("/users")
      .send({
        id: userToUpdate.id,
        name: "Lenora Alvarez Suarez",
        isAdmin: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const userUpdated = responseUpdate.body as User;

    expect(responseUpdate.status).toBe(201);
    expect(userUpdated.name).toBe("Lenora Alvarez Suarez");
    expect(userUpdated.isAdmin).toBe(true);
  });

  it("Should not able to update an unexisting user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const responseUpdate = await request(app)
      .patch("/users")
      .send({
        id: "de8696a0-0a3b-4a61-a012-d98dbfd5e142",
        name: "Fail test update",
        isAdmin: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseUpdate.body.message).toBe(
      "Este usuário não está cadastrado!"
    );
    expect(responseUpdate.status).toBe(401);
  });

  it("Should be able to delete an user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const user = new User();
    user.name = "Gavin Douglas";
    user.email = "hej@zugegsa.mo";
    user.password = "41376861";
    user.isAdmin = false;

    await connection.manager.save(user);

    const responseGet = await request(app)
      .get("/users")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const users = responseGet.body as User[];

    const userToDelete = users.find(
      (user) => user.email === "hej@zugegsa.mo" && user.name === "Gavin Douglas"
    );

    const response = await request(app)
      .delete(`/users/${userToDelete.id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Usuario removido com sucesso!");
  });
});
