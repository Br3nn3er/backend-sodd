import { hash } from "bcrypt";
import { createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

async function create() {
  const connection = await createConnection();

  const id = uuidV4();
  const password = await hash("admin", 8);

  await connection.query(
    `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
    values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
  );

  await connection.close;
}

create().then(() => console.log("Usuario administrador criado com sucesso!"));
