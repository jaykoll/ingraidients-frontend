// src/context/AuthContext.tsx
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
  } from 'react';
  import api, { getToken, removeToken, saveToken } from '../services/api'; // Adjust path if needed
  import { AxiosError } from 'axios';
  
  interface User {
    // Define your user structure based on what /users/me returns
    id?: string; // Or number
    email?: string;
    // Add other relevant user fields
  }
  
  interface AuthContextData {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean; // Loading state for initial check
    login: (emailOrUsername: string, password: string) => Promise<boolean>;
    signup: (userData: any) => Promise<boolean>; // Define specific type for userData later
    verifyOtp: (identifier: string, otp: string) => Promise<boolean>;
    logout: () => Promise<void>;
  }
  
  const AuthContext = createContext<AuthContextData | undefined>(undefined);
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      // Check for token on initial load
      const loadAuthData = async () => {
        setIsLoading(true);
        try {
          const storedToken = await getToken();
          console.log('AuthProvider: Found stored token:', !!storedToken);
          if (storedToken) {
            // **Crucial:** Set token for subsequent API calls *before* validating
             api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  
            // Optional but Recommended: Validate token with backend
            try {
              console.log('AuthProvider: Validating token with /users/me');
              const response = await api.get('/users/me'); // Adjust endpoint if needed
              if (response.data) {
                console.log('AuthProvider: Token valid, user data:', response.data);
                setUser(response.data);
                setToken(storedToken);
              } else {
                  console.log('AuthProvider: /users/me returned no data, clearing token.');
                  await removeToken(); // Clear invalid token
              }
            } catch (validationError) {
               console.error('AuthProvider: Token validation failed:', validationError);
               await removeToken(); // Clear invalid token
            }
          } else {
              console.log('AuthProvider: No stored token found.');
          }
        } catch (error) {
          console.error('AuthProvider: Failed to load auth data:', error);
          // Ensure token is cleared if loading fails
          await removeToken();
        } finally {
          setIsLoading(false);
          console.log('AuthProvider: Initial loading complete.');
        }
      };
  
      loadAuthData();
    }, []);
  
    const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
      try {
        console.log('AuthContext: Attempting login for', emailOrUsername);
        // FastAPI's OAuth2PasswordRequestForm expects form data
        const formData = new URLSearchParams();
        formData.append('username', emailOrUsername); // FastAPI default is 'username'
        formData.append('password', password);
  
        const response = await api.post('/auth/token', formData, { // Adjust endpoint if needed
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        const { access_token } = response.data;
        if (access_token) {
          console.log('AuthContext: Login successful, token received.');
          await saveToken(access_token);
          setToken(access_token);
          // Optionally fetch user data after login
          try {
              const userResponse = await api.get('/users/me');
              setUser(userResponse.data);
              console.log('AuthContext: User data fetched after login:', userResponse.data);
          } catch (e) {
              console.error("AuthContext: Failed to fetch user data after login", e)
              // Still consider login successful even if /me fails immediately
          }
          return true;
        }
        console.warn('AuthContext: Login response did not contain access_token.');
        return false;
      } catch (error) {
        const axiosError = error as AxiosError;
         console.error('AuthContext: Login failed:', axiosError.response?.data || axiosError.message);
        // Handle specific errors (e.g., 401 Unauthorized) if needed
        return false;
      }
    };
  
     const signup = async (userData: any): Promise<boolean> => {
      try {
        console.log('AuthContext: Attempting signup with data:', userData);
        // Assuming /users/ endpoint takes JSON
        const response = await api.post('/users/', userData); // Adjust endpoint as needed
  
        console.log('AuthContext: Signup successful:', response.data);
        // Depending on your backend flow:
        // 1. If signup returns a token directly:
        //    const { access_token } = response.data;
        //    if (access_token) { await saveToken(access_token); setToken(access_token); ... return true; }
        // 2. If signup requires OTP verification next (more common):
        //    return true; // Indicate success to navigate to OTP screen
        // 3. If signup requires login after:
             return true; // Indicate success to navigate to login screen
  
        // For this example, let's assume signup requires OTP or Login next
        return true;
  
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('AuthContext: Signup failed:', axiosError.response?.data || axiosError.message);
        // Handle specific errors (e.g., 400 Bad Request for duplicate email)
        return false;
      }
    };
  
      const verifyOtp = async (identifier: string, otp: string): Promise<boolean> => {
      try {
        console.log(`AuthContext: Verifying OTP ${otp} for ${identifier}`);
        // Assuming endpoint takes JSON
        const response = await api.post('/auth/verify-otp', { identifier, otp }); // Adjust endpoint/payload
  
        console.log('AuthContext: OTP verification successful:', response.data);
        // If OTP verification grants a token:
         const { access_token } = response.data;
         if (access_token) {
             console.log('AuthContext: Token received after OTP verification.');
             await saveToken(access_token);
             setToken(access_token);
             // Optionally fetch user data
             try {
                 const userResponse = await api.get('/users/me');
                 setUser(userResponse.data);
                 console.log('AuthContext: User data fetched after OTP verification:', userResponse.data);
             } catch (e) {
                  console.error("AuthContext: Failed to fetch user data after OTP verification", e)
             }
             return true;
         }
         // If OTP verification only confirms the account but doesn't log in:
         // return true; // Indicate success, maybe navigate to login
  
        return false; // If no token was granted
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('AuthContext: OTP verification failed:', axiosError.response?.data || axiosError.message);
        return false;
      }
    };
  
  
    const logout = async (): Promise<void> => {
      console.log('AuthContext: Logging out.');
      await removeToken();
      setUser(null);
      setToken(null);
      // Optional: Call a backend /logout endpoint if it exists (e.g., to invalidate refresh tokens)
      // try { await api.post('/auth/logout'); } catch (e) {}
    };
  
    const isAuthenticated = !!token; // Determine auth state based on token presence
  
    return (
      <AuthContext.Provider
        value={{ isAuthenticated, user, token, isLoading, login, signup, verifyOtp, logout }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Custom hook to use the Auth Context
  export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };