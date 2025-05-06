export interface ChatType {
  id: number;
  userId: number;
  profileImage: string | null;
  userName: string;
  text: string;
  date: string;
  unReadCount: number;
}

export interface GroupChatType extends Omit<ChatType, 'text'> {
  text: string[];
}
