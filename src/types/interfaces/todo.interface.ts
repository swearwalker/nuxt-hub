export interface TodoInterface {
  id: number
  title: string
  description: string
  complete: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface TodoNewInterface {
  title: string
  description?: string
  complete: boolean
}

export interface TodoUpdateInterface {
  id: number
  title?: string
  description?: string
  complete?: boolean
}
