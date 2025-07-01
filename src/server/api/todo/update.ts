import type { Database } from '@/types/interfaces'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)
  const body = await readBody(event)

  if (!user) throw createError({ statusCode: 401 })

  const { data, error } = await client
    .from('todo')
    .update({ title: body.title, description: body.description, complete: body.complete })
    .eq('id', body.id)
    .eq('user_id', user.id)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return data
})
