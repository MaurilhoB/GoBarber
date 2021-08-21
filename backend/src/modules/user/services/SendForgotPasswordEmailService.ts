import path from 'path';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

import { inject, injectable } from 'tsyringe';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError('User does not exists');

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    );

    await this.mailProvider.sendEmail({
      subject: 'Recuperação de senha',
      to: {
        email: user.email,
        name: user.name,
      },
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password/?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
