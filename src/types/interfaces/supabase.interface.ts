export interface Database {
  public: {
    Tables: {
      todo: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          complete: boolean
          user_id: string
        }
        Insert: {
          title: string
          description?: string
          complete?: boolean
          user_id: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          complete?: boolean
          user_id?: string
        }
      }
    }
  }
}
