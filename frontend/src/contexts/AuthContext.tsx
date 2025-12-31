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
  signOut // 1. Importar o signOut
} from 'firebase/auth';
import app from '../services/firebase'; // Certifique-se que o caminho está certo

// 2. Adicionar logout na tipagem
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>; // <--- ADICIONADO AQUI
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

  // 3. Criar a função de logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout // 4. Passar a função no value
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);