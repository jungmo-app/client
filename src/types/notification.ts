export interface NotificationType {
  notificationId: number;
  userId: number;
  message: string;
  gatheringId: number;
  title: string;
  profileImage: string | null;
  createdAt: string;
  read: boolean;
}

export interface InviteSSEType extends Omit<NotificationType, 'notificationId' | 'title' | 'profileImage'> {
  startDate: string;
}
