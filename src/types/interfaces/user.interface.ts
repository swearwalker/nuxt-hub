export interface UserMetadataInterface {
  full_name?: string
  avatar_url?: string
}

export interface UserInterface {
  id: string
  email?: string
  user_metadata?: UserMetadataInterface
}
