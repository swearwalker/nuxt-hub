import type { SupabaseClient } from '@supabase/supabase-js'
import type { Socket } from 'socket.io-client'
import type { ChatMessageInterface } from '@/types/interfaces/chat.interface.ts'
import type { ApiError } from '@/types/interfaces/errors.interface.ts'
import type { UserInterface } from '@/types/interfaces/user.interface.js'

export function useChatMessages(supabase: SupabaseClient) {
  const messages = ref<ChatMessageInterface[]>([])
  const isLoading = ref(true)

  const fetchChatMessages = async (limit = 50) => {
    try {
      isLoading.value = true
      const { data, error } = await supabase
        .from('chat')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      messages.value = data?.reverse() || []
    } catch (e: unknown) {
      const error = e as ApiError
      console.error('Error fetching messages:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addMessage = (message: ChatMessageInterface) => {
    const exists = messages.value.some(
      existingMsg =>
        existingMsg.id === message.id ||
        (existingMsg.message === message.message &&
          existingMsg.user_id === message.user_id &&
          Math.abs(
            new Date(existingMsg.created_at).getTime() - new Date(message.created_at).getTime()
          ) < 1000)
    )

    if (!exists) {
      messages.value.push(message)
      scrollToBottom()
    }
  }

  const subscribeToMessages = () => {
    return supabase
      .channel('public:chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat',
        },
        payload => {
          addMessage(payload.new as ChatMessageInterface)
        }
      )
      .subscribe()
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages')

      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 50)
  }

  const sendMessage = (socket: Socket, messageContent: string, user: UserInterface) => {
    if (!messageContent.trim() || !user) return false

    socket.emit('send-message', {
      message: messageContent,
      user_id: user.id,
      email: user.email,
      fullName: user?.user_metadata?.full_name,
      avatar: user?.user_metadata?.avatar_url,
    })

    return true
  }

  return {
    messages,
    isLoading,
    fetchChatMessages,
    addMessage,
    subscribeToMessages,
    scrollToBottom,
    sendMessage,
  }
}
