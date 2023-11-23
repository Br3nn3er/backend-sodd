import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
  async sendMail(
    to: string,
    subject: string,
    variables: unknown,
    path: string
  ): Promise<void> {
    const templateFileCOntent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFileCOntent);

    const templateHTML = templateParse(variables);

    const userTransporter = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: userTransporter.smtp.host,
      port: userTransporter.smtp.port,
      secure: userTransporter.smtp.secure,
      auth: {
        user: userTransporter.user,
        pass: userTransporter.pass,
      },
    });

    const message = await transporter.sendMail({
      to,
      from: "Sistema Online de Distribuicao de Disciplinas <naoresponder@sodd.com.br>",
      subject,
      html: templateHTML,
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
