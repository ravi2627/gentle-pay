export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          delivered_at: string | null
          failed_at: string | null
          failure_reason: string | null
          id: string
          invoice_id: string
          open_count: number | null
          opened_at: string | null
          recipient_email: string
          reminder_id: string | null
          resend_message_id: string | null
          sent_at: string | null
          status: string
          subject: string
          template_type: string
          tracking_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          invoice_id: string
          open_count?: number | null
          opened_at?: string | null
          recipient_email: string
          reminder_id?: string | null
          resend_message_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_type?: string
          tracking_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          invoice_id?: string
          open_count?: number | null
          opened_at?: string | null
          recipient_email?: string
          reminder_id?: string | null
          resend_message_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_type?: string
          tracking_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "invoice_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_activity_logs: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          invoice_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          invoice_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          invoice_id?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_reminders: {
        Row: {
          channel: string
          created_at: string
          failure_reason: string | null
          id: string
          invoice_id: string
          open_count: number | null
          opened_at: string | null
          scheduled_for: string | null
          sent_at: string | null
          sort_order: number
          status: string
          timing_days: number
          timing_type: string
          tone: string
          tracking_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string
          failure_reason?: string | null
          id?: string
          invoice_id: string
          open_count?: number | null
          opened_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          sort_order?: number
          status?: string
          timing_days?: number
          timing_type: string
          tone: string
          tracking_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          failure_reason?: string | null
          id?: string
          invoice_id?: string
          open_count?: number | null
          opened_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          sort_order?: number
          status?: string
          timing_days?: number
          timing_type?: string
          tone?: string
          tracking_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoice_reminders_invoice"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_email: string | null
          client_id: string | null
          created_at: string
          currency: string
          description: string | null
          due_date: string
          email_3_days_after: boolean
          email_3_days_before: boolean
          email_7_days_after: boolean
          email_on_due_date: boolean
          id: string
          invoice_number: string
          payment_link_id: string | null
          reminder_enabled: boolean
          reminder_tone: string
          sms_days_after_due: number | null
          sms_enabled: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          client_email?: string | null
          client_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          due_date: string
          email_3_days_after?: boolean
          email_3_days_before?: boolean
          email_7_days_after?: boolean
          email_on_due_date?: boolean
          id?: string
          invoice_number: string
          payment_link_id?: string | null
          reminder_enabled?: boolean
          reminder_tone?: string
          sms_days_after_due?: number | null
          sms_enabled?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string
          email_3_days_after?: boolean
          email_3_days_before?: boolean
          email_7_days_after?: boolean
          email_on_due_date?: boolean
          id?: string
          invoice_number?: string
          payment_link_id?: string | null
          reminder_enabled?: boolean
          reminder_tone?: string
          sms_days_after_due?: number | null
          sms_enabled?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_attempts: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          is_default: boolean
          label: string
          short_code: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          label?: string
          short_code?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          label?: string
          short_code?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          id: string
          invoice_id: string
          opened_at: string | null
          recipient_email: string | null
          recipient_phone: string | null
          reminder_type: string | null
          scheduled_for: string | null
          sent_at: string
          status: string
          template_used: string | null
          tone: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_id: string
          opened_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          reminder_type?: string | null
          scheduled_for?: string | null
          sent_at?: string
          status?: string
          template_used?: string | null
          tone?: string | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_id?: string
          opened_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          reminder_type?: string | null
          scheduled_for?: string | null
          sent_at?: string
          status?: string
          template_used?: string | null
          tone?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_logs: {
        Row: {
          created_at: string
          delivered_at: string | null
          failed_at: string | null
          failure_reason: string | null
          id: string
          invoice_id: string
          message_body: string
          recipient_phone: string
          reminder_id: string | null
          sent_at: string | null
          status: string
          twilio_sid: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          invoice_id: string
          message_body: string
          recipient_phone: string
          reminder_id?: string | null
          sent_at?: string | null
          status?: string
          twilio_sid?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          invoice_id?: string
          message_body?: string
          recipient_phone?: string
          reminder_id?: string | null
          sent_at?: string | null
          status?: string
          twilio_sid?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "invoice_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
