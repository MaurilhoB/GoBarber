import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Email content';
  }
}

export default HandlebarsMailTemplateProvider;
