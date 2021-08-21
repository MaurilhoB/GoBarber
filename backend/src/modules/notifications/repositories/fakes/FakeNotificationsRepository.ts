import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { ObjectId } from 'mongodb'

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];
  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectId(),
      recipient_id,
      content,
    });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
