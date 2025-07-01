<script setup lang="ts">
import type { ChatMessageInterface } from '@/types/interfaces/chat.interface'
import ChatFooter from '@/components/chat/ChatFooter.vue'
import ChatBubble from '@/components/chat/ChatBubble.vue'

const { $socket } = useNuxtApp()
const user = await useSupabaseUser()
const supabase = useSupabaseClient()
const newMessage = ref('')

const {
  messages,
  isLoading,
  fetchChatMessages,
  addMessage,
  subscribeToMessages,
  scrollToBottom,
  sendMessage: sendChatMessage,
} = useChatMessages(supabase)

const channel = ref(null)

const sendMessage = () => {
  if (sendChatMessage($socket, newMessage.value, user.value)) {
    newMessage.value = ''
  }
}

onMounted(async () => {
  await fetchChatMessages()

  $socket.on('new-message', (msg: ChatMessageInterface) => {
    addMessage(msg)
  })

  channel.value = subscribeToMessages()
})

onUnmounted(() => {
  $socket.off('new-message')

  if (channel.value) {
    supabase.removeChannel(channel.value)
  }
})

watch(
  isLoading,
  (newValue: boolean) => {
    if (!newValue) {
      scrollToBottom()
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <UContainer>
    <UCard class="flex h-full w-full flex-col">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-xl font-bold">Chat</h2>
          <p v-if="user" class="text-sm text-gray-500">Logged in as {{ user.email }}</p>
        </div>
      </template>

      <div
        class="chat-messages flex flex-1 flex-col items-start space-y-1 overflow-y-auto p-4"
        :class="{ 'justify-center': isLoading }"
        style="height: calc(100vh - 14rem)"
      >
        <UProgress v-if="isLoading" animation="swing" />
        <template v-else-if="!isLoading && messages.length > 0">
          <TransitionGroup name="message">
            <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg" :user="user" />
          </TransitionGroup>
        </template>
        <ChatEmpty v-else />
      </div>

      <template #footer>
        <ChatFooter v-model="newMessage" @update="sendMessage" />
      </template>
    </UCard>
  </UContainer>
</template>

<style scoped></style>
