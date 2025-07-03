export enum MessageType {
  Text = 'Text',
  Image = 'Image',
  File = 'File'
}

export interface Message {
  id: string
  message: string
  senderId: string
  senderName: string
  chatRoomId: string
  senderAvatar?: string
  type: MessageType
  messageTimestamp: Date
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
