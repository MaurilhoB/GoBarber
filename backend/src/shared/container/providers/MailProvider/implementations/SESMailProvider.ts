import nodemailer, { Transporter } from 'nodemailer';
import { SES } from 'aws-sdk';

import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';
import mailConfig from '@config/mail';

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION,
      }),
    });
  }

  public async sendEmail({
    subject,
    to,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    if (!email || !name) {
      throw new Error(
        "You shoud fill the enviroment variables named 'SEND_EMAIL_DOMAIN' and 'SENDER_NAME'"
      );
    }

    await this.client.sendMail({
      from: {
        address: email,
        name,
      },
      to: {
        address: to.email,
        name: to.name,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export default SESMailProvider;
