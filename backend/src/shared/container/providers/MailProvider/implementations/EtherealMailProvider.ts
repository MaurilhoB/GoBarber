import nodemailer from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: nodemailer.Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {}

  public async sendEmail({
    subject,
    to,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    if (!this.client) {
      const account = await nodemailer.createTestAccount();
      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    }

    const message = await this.client.sendMail({
      from: {
        address: from?.email || 'gobarber@example.com',
        name: from?.name || 'Equipe Go Barber',
      },
      to: {
        address: to.email,
        name: to.name,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;
