import { ObjectID } from 'mongodb';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationRepository from '../INotificationRepository';

export default class FakeNotificationRepository
  implements INotificationRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, {
      id: new ObjectID(),
      content,
      recipient_id,
    });
    this.notifications.push(notification);
    return notification;
  }
}
