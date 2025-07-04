import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const socketUrl = config.public.socketUrl || 'http://localhost:3001'
  const socket = io(socketUrl)
  return { provide: { socket } }
})
