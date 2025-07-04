export enum MessageType {
  Text,
  Image,
  File
}

export interface Message {
  id: string
  message: string
  senderId: string
  senderName: string
  chatRoomId: string
  senderAvatar?: string
  type: MessageType
  messageTimestamp: string
  isRead: boolean | null
}

export interface ChatRoom {
  id: string
  name: string
  memberCount: number
  createdAt: string
  lastMessage: string
  lastTimestamp: string
  lastUserId: string
  lastUserName: string
  members: {
    memberId: string
    memberName: string
    memberAvatar: string | null
  }[]
}
