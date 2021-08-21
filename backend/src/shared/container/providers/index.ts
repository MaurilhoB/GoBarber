import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import uploadConfig from '@config/upload';

import MailProviders from './MailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';

import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';

import StorageProvider from './StorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';

import ICacheProvider from './CacheProvider/models/ICacheProvider';
import CacheProvider from './CacheProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  StorageProvider[uploadConfig.driver]
);

container.registerSingleton<IMailProvider>(
  'MailProvider',
  MailProviders[mailConfig.driver]
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider
);

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  CacheProvider.redis
);
