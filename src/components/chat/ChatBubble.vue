<script setup lang="ts">
import type { ChatMessageInterface } from '@/types/interfaces/chat.interface'
import type { UserInterface } from '@/types/interfaces/user.interface'

interface Props {
  message: ChatMessageInterface
  user?: UserInterface
}

const { user = null, message } = defineProps<Props>()

const { getUserDisplayName, getAvatarInitials, getAvatarUrl, isCurrentUser, formatMessageTime } =
  useUserDisplay()

const isSelf = computed(() => isCurrentUser(message, user))
</script>

<template>
  <div class="" :class="{ 'self-end': isSelf }">
    <div class="mb-1 flex items-start gap-2">
      <UAvatar
        v-if="!isSelf"
        :src="getAvatarUrl(message, user)"
        :alt="getUserDisplayName(message, user)"
        :initials="getAvatarInitials(message, user)"
        :color="isSelf ? 'primary' : 'gray'"
        size="sm"
      />
      <div class="flex-1 rounded-2xl px-4 py-2" :class="isSelf ? 'bg-zinc-900' : 'bg-zinc-800'">
        <span v-if="!isSelf" class="text-sm font-bold">{{
          getUserDisplayName(message, user)
        }}</span>
        <p class="mt-1 text-sm">{{ message.message }}</p>
        <span class="inline-block w-full text-right text-xs text-zinc-500">{{
          formatMessageTime(message.created_at)
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
