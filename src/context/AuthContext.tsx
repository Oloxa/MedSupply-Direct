import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DeliveryAddress, UserOrganization } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockInitialData';

export const DEMO_ORGANIZATIONS: Record<'Hospital' | 'Pharmacy' | 'Clinic', UserOrganization> = {
  Hospital: {
    id: 'org-hosp-01',
    name: 'St. Jude Metropolitan Hospital',
    type: 'Hospital',
    registrationNumber: 'NHS-TR-88192',
    taxId: 'GB-VAT-90214829',
    creditLimit: 150000,
    creditUsed: 38450,
    accountManager: {
      name: 'Marcus Holloway',
      email: 'm.holloway@medsupplydirect.com',
      phone: '+44 (0) 20 7946 0912',
    },
  },
  Pharmacy: {
    id: 'org-pharm-02',
    name: 'Apex Care Community Pharmacy Group',
    type: 'Pharmacy',
    registrationNumber: 'GPHC-901248',
    taxId: 'GB-VAT-44128901',
    creditLimit: 45000,
    creditUsed: 12800,
    accountManager: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@medsupplydirect.com',
      phone: '+44 (0) 20 7946 0841',
    },
  },
  Clinic: {
    id: 'org-clinic-03',
    name: 'Wellspring Ambulatory Surgery & Family Clinic',
    type: 'Clinic',
    registrationNumber: 'CQC-1-849204',
    taxId: 'GB-VAT-77192034',
    creditLimit: 30000,
    creditUsed: 6240,
    accountManager: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@medsupplydirect.com',
      phone: '+44 (0) 20 7946 0841',
    },
  },
};

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email?: string, orgType?: 'Hospital' | 'Pharmacy' | 'Clinic') => void;
  logout: () => void;
  updateOrganizationType: (type: 'Hospital' | 'Pharmacy' | 'Clinic') => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addDeliveryAddress: (address: DeliveryAddress) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (orgType: 'Hospital' | 'Pharmacy' | 'Clinic') => void;
}

const STORAGE_KEY_USER = 'medsupply_user_profile';
const STORAGE_KEY_ONBOARDING = 'medsupply_onboarding_done';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_USER_PROFILE;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_ONBOARDING) === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const login = (email: string = 'e.vance@stjude-health.org', orgType: 'Hospital' | 'Pharmacy' | 'Clinic' = 'Hospital') => {
    const org = DEMO_ORGANIZATIONS[orgType];
    const newUser: UserProfile = {
      ...INITIAL_USER_PROFILE,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      organization: org,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateOrganizationType = (type: 'Hospital' | 'Pharmacy' | 'Clinic') => {
    if (!user) return;
    const org = DEMO_ORGANIZATIONS[type];
    setUser({
      ...user,
      organization: org,
    });
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser({
      ...user,
      ...updated,
    });
  };

  const addDeliveryAddress = (address: DeliveryAddress) => {
    if (!user) return;
    setUser({
      ...user,
      savedAddresses: [...user.savedAddresses, address],
    });
  };

  const completeOnboarding = (orgType: 'Hospital' | 'Pharmacy' | 'Clinic') => {
    updateOrganizationType(orgType);
    setHasCompletedOnboarding(true);
    localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateOrganizationType,
        updateProfile,
        addDeliveryAddress,
        hasCompletedOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
