import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = ainda verificando

  useEffect(() => {
    const checkAdminStatus = async () => {
      // 1. Se o Auth ainda está carregando ou não tem usuário, não faz nada
      if (loading) return;
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        // 2. Busca o documento do usuário na coleção 'users' pelo UID
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        // 3. Verifica se o documento existe e se a role é 'admin'
        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, loading]);

  // Enquanto verifica a autenticação OU a permissão no banco
  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, chuta para a Home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Se for admin, libera o acesso
  return <>{children}</>;
};