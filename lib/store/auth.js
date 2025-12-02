import { createClient } from "@/supabase/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const supabase = createClient();
/**
 * Auth Store
 * Manages user authentication state with Supabase
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // =====================================================
      // STATE
      // =====================================================
      user: null,
      session: null,
      loading: false,
      error: null,

      // =====================================================
      // COMPUTED VALUES
      // =====================================================

      /**
       * Check if user is authenticated
       */
      isAuthenticated: () => {
        const { user, session } = get();
        return !!(user && session);
      },

      /**
       * Get user email
       */
      getUserEmail: () => {
        const { user } = get();
        return user?.email || null;
      },

      /**
       * Get user ID
       */
      getUserId: () => {
        const { user } = get();
        return user?.id || null;
      },

      // =====================================================
      // ACTIONS
      // =====================================================

      /**
       * Initialize auth state
       * Call this on app mount to check for existing session
       */
      initialize: async () => {
        try {
          set({ loading: true, error: null });

          // Get current session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("❌ Error getting session:", error);
            set({
              user: null,
              session: null,
              loading: false,
              error: error.message,
            });
            return;
          }

          if (session) {
            set({
              user: session.user,
              session: session,
              loading: false,
              error: null,
            });
            console.log("✅ User session restored:", session.user.email);
          } else {
            set({ user: null, session: null, loading: false, error: null });
            console.log("ℹ️ No active session");
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              user: session?.user || null,
              session: session || null,
              loading: false,
            });
            console.log("🔄 Auth state changed:", _event);
          });
        } catch (error) {
          console.error("❌ Error initializing auth:", error);
          set({
            user: null,
            session: null,
            loading: false,
            error: error.message,
          });
        }
      },

      /**
       * Sign up with email and password
       */
      signUp: async (email, password, metadata = {}) => {
        try {
          set({ loading: true, error: null });

          // 1. Create the user in Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata, // this stores metadata in auth.user.user_metadata
            },
          });

          if (error) {
            console.error("❌ Sign up error:", error);
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
          }

          const user = data?.user;

          // 2. Insert user metadata into the "customers" table
          // Make sure your customers table has RLS: user_id = auth.uid()
          const { error: insertError } = await supabase
            .from("customers")
            .insert({
              id: user.id,
              email,
              ...metadata, // store gender, name, phone, etc.
            });

          if (insertError) {
            console.error("❌ Customer insert error:", insertError.message);
            // Do not block signup flow — user is created but metadata failed
            return {
              success: true,
              warning: "Account created but customer record failed.",
              insertError: insertError.message,
            };
          }

          // 3. Update store state
          set({
            user: user,
            session: data.session,
            loading: false,
            error: null,
          });

          console.log("✅ Sign up successful:", user.email);

          return {
            success: true,
            data,
          };
        } catch (error) {
          console.error("❌ Sign up error:", error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Sign in with email and password
       */
      signIn: async (email, password) => {
        try {
          set({ loading: true, error: null });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("❌ Sign in error:", error);
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
          }

          set({
            user: data.user,
            session: data.session,
            loading: false,
            error: null,
          });

          console.log("✅ Sign in successful:", data.user?.email);
          return { success: true, data };
        } catch (error) {
          console.error("❌ Sign in error:", error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Sign in with OAuth provider (Google, Facebook, etc.)
       */
      signInWithOAuth: async (provider) => {
        try {
          set({ loading: true, error: null });

          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            console.error("❌ OAuth sign in error:", error);
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
          }

          console.log("✅ OAuth sign in initiated");
          return { success: true, data };
        } catch (error) {
          console.error("❌ OAuth sign in error:", error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Sign out
       */
      signOut: async () => {
        try {
          set({ loading: true, error: null });

          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error("❌ Sign out error:", error);
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
          }

          set({
            user: null,
            session: null,
            loading: false,
            error: null,
          });

          console.log("✅ Sign out successful");
          return { success: true };
        } catch (error) {
          console.error("❌ Sign out error:", error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Reset password (send reset email)
       */
      resetPassword: async (email) => {
        try {
          set({ loading: true, error: null });

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });

          if (error) {
            console.error("❌ Password reset error:", error);
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
          }

          set({ loading: false, error: null });
          console.log("✅ Password reset email sent");
          return { success: true };
        } catch (error) {
          console.error("❌ Password reset error:", error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Update password
       */
      updatePassword: async (newPassword) => {
        try {
          set({ loading: true, error: null });

          const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            console.error("❌ Password update error:", error);
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
          }

          set({ loading: false, error: null });
          console.log("✅ Password updated successfully");
          return { success: true, data };
        } catch (error) {
          console.error("❌ Password update error:", error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Update user profile metadata
       */
      updateProfile: async (updates) => {
        try {
          set({ loading: true, error: null });

          const { data, error } = await supabase.auth.updateUser({
            data: updates,
          });

          if (error) {
            console.error("❌ Profile update error:", error);
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
          }

          set({
            user: data.user,
            loading: false,
            error: null,
          });

          console.log("✅ Profile updated successfully");
          return { success: true, data };
        } catch (error) {
          console.error("❌ Profile update error:", error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Clear error
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "topeve-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user and session, not loading/error states
        user: state.user,
        session: state.session,
      }),
    }
  )
);
