export interface NotificationType {
  notificationId: number;
  userId: number;
  message: string;
  gatheringId: number;
  createdAt: string;
  read: boolean;
}

export type InviteSSEType = Omit<NotificationType, 'notificationId'>;
