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
