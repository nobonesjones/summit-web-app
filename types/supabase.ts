export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
          last_active: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      business_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          business_idea: string
          location: string
          category: string
          sections: Json
          details: Json
          metadata: Json
          status: string
          version: number
          is_public: boolean
          tags: string[]
          created_at: string
          updated_at?: string
        }
        Insert: Omit<Database['public']['Tables']['business_plans']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['business_plans']['Insert']>
      }
      outputs: {
        Row: {
          id: string
          user_id: string
          mini_app_id: string
          title: string
          content: Json
          formatted_content: string
          created_at: string
          updated_at: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          mini_app_id: string
          title: string
          content: Json
          formatted_content: string
          created_at?: string
          updated_at?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          mini_app_id?: string
          title?: string
          content?: Json
          formatted_content?: string
          created_at?: string
          updated_at?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "outputs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outputs_mini_app_id_fkey"
            columns: ["mini_app_id"]
            referencedRelation: "app_templates"
            referencedColumns: ["id"]
          }
        ]
      }
      answers: {
        Row: {
          id: string
          output_id: string
          question_id: string
          value: Json
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          output_id: string
          question_id: string
          value: Json
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          output_id?: string
          question_id?: string
          value?: Json
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_output_id_fkey"
            columns: ["output_id"]
            referencedRelation: "outputs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts: {
        Row: {
          id: string
          mini_app_id: string
          type: string
          content: string
          parameters: string[]
          version: number
          created_at: string
          updated_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          mini_app_id: string
          type: string
          content: string
          parameters?: string[]
          version?: number
          created_at?: string
          updated_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          mini_app_id?: string
          type?: string
          content?: string
          parameters?: string[]
          version?: number
          created_at?: string
          updated_at?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "prompts_mini_app_id_fkey"
            columns: ["mini_app_id"]
            referencedRelation: "app_templates"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_responses: {
        Row: {
          id: string
          prompt_id: string
          input: Json
          output: string
          model: string
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          prompt_id: string
          input: Json
          output: string
          model: string
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          prompt_id?: string
          input?: Json
          output?: string
          model?: string
          created_at?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_responses_prompt_id_fkey"
            columns: ["prompt_id"]
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          }
        ]
      }
      research_data: {
        Row: {
          id: string
          output_id: string
          topic: string
          source: string
          content: string
          created_at: string
          url: string | null
        }
        Insert: {
          id?: string
          output_id: string
          topic: string
          source: string
          content: string
          created_at?: string
          url?: string | null
        }
        Update: {
          id?: string
          output_id?: string
          topic?: string
          source?: string
          content?: string
          created_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_data_output_id_fkey"
            columns: ["output_id"]
            referencedRelation: "outputs"
            referencedColumns: ["id"]
          }
        ]
      }
      app_templates: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          icon: string
          is_active: boolean
          order: number
          created_at: string
          updated_at: string | null
          config: Json
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          icon: string
          is_active?: boolean
          order: number
          created_at?: string
          updated_at?: string | null
          config?: Json
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          icon?: string
          is_active?: boolean
          order?: number
          created_at?: string
          updated_at?: string | null
          config?: Json
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          mini_app_id: string
          text: string
          input_type: string
          placeholder: string | null
          required: boolean
          order: number
          options: string[] | null
          next_question_logic: Json | null
        }
        Insert: {
          id?: string
          mini_app_id: string
          text: string
          input_type: string
          placeholder?: string | null
          required?: boolean
          order: number
          options?: string[] | null
          next_question_logic?: Json | null
        }
        Update: {
          id?: string
          mini_app_id?: string
          text?: string
          input_type?: string
          placeholder?: string | null
          required?: boolean
          order?: number
          options?: string[] | null
          next_question_logic?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_mini_app_id_fkey"
            columns: ["mini_app_id"]
            referencedRelation: "app_templates"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 