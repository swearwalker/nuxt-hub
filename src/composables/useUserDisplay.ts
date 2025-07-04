import { format, type Locale } from 'date-fns'
import { enUS, uk } from 'date-fns/locale'
import type { ChatMessageInterface } from '@/types/interfaces/chat.interface.ts'
import type { UserInterface } from '@/types/interfaces/user.interface.ts'

export function useUserDisplay() {
  const getUserDisplayName = (message: ChatMessageInterface, currentUser: UserInterface | null) => {
    if (currentUser && message.user_id === currentUser.id) {
      return 'You'
    }

    if (message.full_name) {
      return message.full_name
    }

    if (message.email) {
      return message.email
    }

    return message.user_id.substring(0, 6) + '...'
  }

  const getAvatarInitials = (message: ChatMessageInterface, currentUser: UserInterface | null) => {
    if (currentUser && message.user_id === currentUser.id) {
      if (currentUser?.user_metadata?.full_name) {
        return currentUser.user_metadata.full_name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
      }
      return currentUser?.email?.substring(0, 2).toUpperCase() || 'ME'
    }

    if (message.full_name) {
      const name = message.full_name || ''
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    }

    if (message.email) {
      return message.email.substring(0, 2).toUpperCase()
    }

    return message.user_id.substring(0, 2).toUpperCase()
  }

  const getAvatarUrl = (message: ChatMessageInterface, currentUser: UserInterface | null) => {
    if (currentUser && message.user_id === currentUser.id) {
      return currentUser?.user_metadata?.avatar_url
    }

    return message.avatar
  }

  const isCurrentUser = (message: ChatMessageInterface, currentUser: UserInterface | null) => {
    return currentUser ? message.user_id === currentUser.id : false
  }

  const formatMessageTime = (timestamp: string, formatStr = 'dd MMM, HH:mm') => {
    try {
      type SupportedLocales = 'en' | 'uk'

      const { locale: currentLocale } = useI18n()

      const localeMap: Record<SupportedLocales, Locale> = {
        en: enUS,
        uk: uk,
      }

      const dateLocale = localeMap[currentLocale.value as SupportedLocales] || uk

      const date = new Date(timestamp)
      const today = new Date()

      if (date.toDateString() === today.toDateString()) {
        return format(date, 'HH:mm', { locale: dateLocale })
      }

      return format(date, formatStr, { locale: dateLocale })
    } catch (e) {
      console.error('Error formatting date:', e)
      return timestamp
    }
  }

  return {
    getUserDisplayName,
    getAvatarInitials,
    getAvatarUrl,
    isCurrentUser,
    formatMessageTime,
  }
}
