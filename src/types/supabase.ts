export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          gender: 'female' | 'male'
          country: string
          phone_number: string | null
          user_type: 'individual' | 'organization' | 'vendor'
          created_at: string
          updated_at: string
          age_group: '12-18' | '19-25' | '26-30' | '31-35' | '35+' // Add age_group here
        }
        Insert: {
          id: string
          username: string
          gender: 'female' | 'male'
          country: string
          phone_number?: string | null
          user_type?: 'individual' | 'organization' | 'vendor'
          created_at?: string
          updated_at?: string
          age_group: '12-18' | '19-25' | '26-30' | '31-35' | '35+' // Ensure it's present in Insert type
        }
        Update: {
          username?: string
          gender?: 'female' | 'male'
          country?: string
          phone_number?: string | null
          user_type?: 'individual' | 'organization' | 'vendor'
          updated_at?: string
          age_group?: '12-18' | '19-25' | '26-30' | '31-35' | '35+' // Add it here too
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          content: string
          topic: string
          anonymous: boolean
          anonymous_id: string | null
          likes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          topic: string
          anonymous?: boolean
          anonymous_id?: string | null
          likes_count?: number
          created_at?: string
        }
        Update: {
          content?: string
          anonymous?: boolean
          anonymous_id?: string | null
          likes_count?: number
        }
      }
    }
  }
}
