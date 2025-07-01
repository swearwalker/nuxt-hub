import type { Database } from '@/types/interfaces'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)
  const body = await readBody(event)

  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { data, error } = await client.from('todo').insert({
    title: body.title,
    description: body.description || '',
    complete: body.complete || false,
    user_id: user.id,
  })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return data
})
