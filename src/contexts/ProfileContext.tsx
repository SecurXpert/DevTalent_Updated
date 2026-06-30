import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  bio: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  setProfileData: (data: ProfileData) => void;
}

const defaultProfileData: ProfileData = {
  fullName: "Admin User",
  email: "admin@devtalent.com",
  phone: "",
  role: "Platform Administrator",
  location: "San Francisco, CA",
  bio: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profileData, setProfileDataState] = useState<ProfileData>(defaultProfileData);

  const updateProfile = (newData: Partial<ProfileData>) => {
    setProfileDataState(prev => ({ ...prev, ...newData }));
  };

  const setProfileData = (data: ProfileData) => {
    setProfileDataState(data);
  };

  return (
    <ProfileContext.Provider value={{
      profileData,
      updateProfile,
      setProfileData
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
