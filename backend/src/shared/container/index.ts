import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';

import UserTokensRepository from '@modules/user/infra/typeorm/repositories/UserTokensRepository';
import IUserTokensRepository from '@modules/user/repositories/IUserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

import '@modules/user/providers';
import './providers';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository
);
