export interface ChatMessageInterface {
  id: number
  created_at: string
  message: string
  user_id: string
  email?: string
  full_name?: string
  avatar?: string
}
