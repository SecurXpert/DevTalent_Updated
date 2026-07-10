import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BASE_URL } from '../lib/api';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  setProfileData: (data: ProfileData) => void;
  refreshProfile: () => Promise<void>;
}

const defaultProfileData: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  location: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profileData, setProfileDataState] = useState<ProfileData>(defaultProfileData);

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("userToken");
      
      const userRole = localStorage.getItem("userRole");

      if (!token) return;

      let endpoint = `${BASE_URL}/auth/profile`;
      if (userRole === "super_admin") {
        endpoint = `${BASE_URL}/auth/profile`;
      } else if (userRole === "admin") {
        endpoint = `${BASE_URL}/auth/admin/profile`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const locParts = [data.city, data.state, data.country].filter(Boolean);
        const locationVal = locParts.length > 0 ? locParts.join(", ") : "";

        setProfileDataState({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || (userRole === "super_admin" ? "Super Admin" : "Admin"),
          location: locationVal,
        });
      }
    } catch (error) {
      console.error("Error fetching profile globally:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const refreshProfile = async () => {
    await fetchProfile();
  };

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
      setProfileData,
      refreshProfile
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
