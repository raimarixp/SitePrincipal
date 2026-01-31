import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Importação direta do SDK
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = verificando
  const db = getFirestore(); // Inicializa o DB

  useEffect(() => {
    const checkAdminStatus = async () => {
      // 1. Se o Auth ainda está carregando, aguarda
      if (loading) return;

      // 2. Se não tem usuário logado, com certeza não é admin
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        // 3. Busca o documento do usuário na coleção 'users' pelo UID
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        // 4. Verifica se o campo 'role' é 'admin'
        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          console.warn("Acesso negado: Usuário não tem permissão de admin.");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao verificar permissão de admin:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, loading, db]);

  // === ESTADO DE CARREGAMENTO ===
  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Verificando permissões...</p>
      </div>
    );
  }

  // === ACESSO NEGADO ===
  if (!isAdmin) {
    // Redireciona para Home e substitui o histórico para evitar botão "voltar" infinito
    return <Navigate to="/" replace />;
  }

  // === ACESSO PERMITIDO ===
  return <>{children}</>;
};