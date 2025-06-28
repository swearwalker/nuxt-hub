import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const { id } = await readBody(event)

  if (!user) throw createError({ statusCode: 401 })

  const { error } = await client.from('todo').delete().eq('id', id).eq('user_id', user.id)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { success: true }
})
