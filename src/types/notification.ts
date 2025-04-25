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

export interface SSEDataType extends NotificationType {
  startDate: string;
}
