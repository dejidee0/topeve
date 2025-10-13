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
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          parent_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          parent_id?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          parent_id?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          title: string
          brand_id: string | null
          category_id: string | null
          description: string
          status: string
          price_cents: number
          compare_at_cents: number | null
          currency: string
          preorder: boolean
          in_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          brand_id?: string | null
          category_id?: string | null
          description?: string
          status?: string
          price_cents: number
          compare_at_cents?: number | null
          currency?: string
          preorder?: boolean
          in_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          brand_id?: string | null
          category_id?: string | null
          description?: string
          status?: string
          price_cents?: number
          compare_at_cents?: number | null
          currency?: string
          preorder?: boolean
          in_stock?: boolean
          created_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt?: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string
          sort_order?: number
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          hero_url: string
          published_at: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string
          hero_url?: string
          published_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string
          hero_url?: string
          published_at?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: string
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          line1: string
          line2: string
          city: string
          state: string
          country: string
          postal_code: string
          phone: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string
          line1?: string
          line2?: string
          city?: string
          state?: string
          country?: string
          postal_code?: string
          phone?: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          line1?: string
          line2?: string
          city?: string
          state?: string
          country?: string
          postal_code?: string
          phone?: string
          is_default?: boolean
          created_at?: string
        }
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

export type Product = Database['public']['Tables']['products']['Row'] & {
  brand?: Database['public']['Tables']['brands']['Row']
  images?: Database['public']['Tables']['product_images']['Row'][]
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Brand = Database['public']['Tables']['brands']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
