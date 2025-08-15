import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PreferencesContextType {
  preferences: Record<string, string[]>;
  setPreferences: (preferences: Record<string, string[]>) => void;
  clearPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferencesState] = useState<Record<string, string[]>>({});

  const setPreferences = (newPreferences: Record<string, string[]>) => {
    setPreferencesState(newPreferences);
    // 可以在这里添加本地存储逻辑
    localStorage.setItem('hopa-preferences', JSON.stringify(newPreferences));
  };

  const clearPreferences = () => {
    setPreferencesState({});
    localStorage.removeItem('hopa-preferences');
  };

  // 从本地存储加载偏好设置
  React.useEffect(() => {
    const savedPreferences = localStorage.getItem('hopa-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferencesState(parsed);
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences, clearPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
