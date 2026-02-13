import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  type ReactNode 
} from 'react';
import { 
  type User, 
  onAuthStateChanged, 
  getAuth, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import app from '../services/firebase'; 

// 1. Ajustamos a interface para usar 'signOut'
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>; // Renomeado de 'logout' para 'signOut'
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // 2. Renomeamos a função interna para bater com a interface
  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signOut: handleSignOut // 3. Exportamos como 'signOut'
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);