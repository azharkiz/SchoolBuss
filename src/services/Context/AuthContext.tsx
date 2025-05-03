import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  // Define the context type
  interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (state: boolean) => Promise<void>;
  }
  
  // Create context with default undefined value for safety
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  // Define props type
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedInState] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const loadAuthState = async () => {
        try {
          const savedState = await AsyncStorage.getItem('isLoggedIn');
          if (savedState !== null) {
            setIsLoggedInState(JSON.parse(savedState));
          }
        } catch (error) {
          console.error('Failed to load auth state:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadAuthState();
    }, []);
  
    const updateLoginState = async (state: boolean) => {
      try {
        setIsLoggedInState(state);
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to update login state:', error);
      }
    };
  
    if (loading) {
      return null;
    }
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn: updateLoginState }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Custom hook with safety check
  export const useAuthCheck = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuthCheck must be used within an AuthProvider');
    }
    return context;
  };
  