'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  privyId: string;
  displayName?: string;
  profileImage?: string;
}

interface UserProfileState {
  profiles: Record<string, UserProfile>;
  updateProfile: (privyId: string, profile: Partial<UserProfile>) => void;
  getProfile: (privyId: string) => UserProfile | undefined;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist((set, get) => ({
    profiles: {},
    updateProfile: (privyId, profile) =>
      set((state) => ({ profiles: { ...state.profiles, [privyId]: { ...state.profiles[privyId], privyId, ...profile } } })),
    getProfile: (privyId) => get().profiles[privyId]
  }), { name: 'stratos-user-profiles' })
);
