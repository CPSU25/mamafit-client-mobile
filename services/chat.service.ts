import { api } from '~/lib/axios/axios'
import { ChatRoom, Message, MessageTypeDB } from '~/types/chat.type'
import { BaseResponse } from '~/types/common'

class ChatService {
  async getRooms() {
    const { data } = await api.get<BaseResponse<ChatRoom[]>>('Chat/my-rooms')

    return data.data?.sort((a, b) => {
      return new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
    })
  }

  async getRoom(roomId: string) {
    const { data } = await api.get<BaseResponse<ChatRoom>>(`Chat/rooms/${roomId}`)

    return data.data
  }

  async getRoomMessages(roomId: string, index: number = 1, pageSize: number = 30) {
    const { data } = await api.get<BaseResponse<Message<MessageTypeDB>[]>>(
      `Chat/rooms/${roomId}/messages?index=${index}&pageSize=${pageSize}`
    )

    return data.data?.sort((a, b) => {
      return new Date(a.messageTimestamp).getTime() - new Date(b.messageTimestamp).getTime()
    })
  }
}

const chatService = new ChatService()
export default chatService
