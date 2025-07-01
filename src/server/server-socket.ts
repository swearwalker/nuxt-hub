import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { createClient } from '@supabase/supabase-js'
import type { RealtimeChannel } from '@supabase/realtime-js'

dotenv.config()

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err)
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or Service Role Key not provided!')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const setupRealtimeSubscription = async () => {
  console.log('Setting up realtime subscription to Supabase')

  return supabase
    .channel('public:chat')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat',
      },
      payload => {
        console.log('Change received!', payload)
      }
    )
    .subscribe(status => {
      console.log('Supabase realtime subscription status:', status)
    })
}

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})

let supabaseChannel: RealtimeChannel | null = null

io.on('connection', socket => {
  console.log('User connected:', socket.id)

  if (!supabaseChannel) {
    setupRealtimeSubscription()
      .then(channel => {
        supabaseChannel = channel
      })
      .catch(err => {
        console.error('Error setting up Supabase realtime:', err)
      })
  }

  socket.on('send-message', async ({ message, user_id, email, fullName, avatar }) => {
    try {
      const { data, error } = await supabase
        .from('chat')
        .insert({
          message,
          user_id,
          email,
          full_name: fullName,
          avatar,
          created_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      io.emit('new-message', data[0])
    } catch (error) {
      console.error('Error sending message:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

supabase
  .channel('public:chat')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'chat',
    },
    payload => {
      io.emit('new-message', payload.new)
    }
  )
  .subscribe()

httpServer.listen(3001, () => {
  console.log('Socket server running on port 3001')
  console.log('Connected to Supabase realtime')
})
