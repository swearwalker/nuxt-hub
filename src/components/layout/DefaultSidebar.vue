<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import ThemeSwitcher from '@/components/layout/ThemeSwitcher.vue'
import LangSwitcher from '@/components/layout/LangSwitcher.vue'

const { t } = useI18n()
const user = useSupabaseUser()

const signOut = async () => {
  const { error } = await useSupabaseClient().auth.signOut()
  if (error) console.log(error)
  navigateTo('/auth')
}

const items = ref<NavigationMenuItem[][]>([
  [
    {
      avatar: {
        src: user.value?.user_metadata.avatar_url || 'https://i.pravatar.cc/300',
        alt: user.value?.user_metadata.full_name || 'User Avatar',
        size: 'lg',
      },
      label: user.value?.user_metadata.full_name,
      tooltip: {
        text: user.value?.email,
      },
    },
  ],
  [
    {
      label: t('sidebar.nav.todo'),
      icon: 'lucide:list-todo',
      to: '/todo',
    },
    {
      label: t('sidebar.nav.chat'),
      icon: 'lucide:message-square',
      to: '/chat',
    },
  ],
])
</script>

<template>
  <aside class="flex h-screen flex-col gap-2 p-2">
    <h2 class="text-primary-500 text-2xl font-semibold">NuxtHub</h2>
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-48"
    />
    <ThemeSwitcher class="mt-auto" />
    <LangSwitcher />
    <UButton icon="lucide:log-out" color="error" variant="soft" size="lg" @click="signOut">{{
      t('sidebar.sign-out')
    }}</UButton>
  </aside>
</template>

<style scoped></style>
