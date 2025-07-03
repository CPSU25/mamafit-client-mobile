import { api } from '~/lib/axios/axios'
import { ChatRoom } from '~/types/chat.type'
import { BaseResponse } from '~/types/common'

class ChatService {
  async getRooms() {
    const { data } = await api.get<BaseResponse<ChatRoom[]>>('Chat/my-rooms')

    return data.data?.sort((a, b) => {
      return new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
    })
  }
}

const chatService = new ChatService()
export default chatService
