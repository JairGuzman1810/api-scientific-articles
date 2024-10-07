import { Auth } from "../helpers/type";
import { useUserStore } from "../store/auth";

const useAuth = () => {
  const auth = useUserStore((state) => state.auth);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const isAuth = !!auth;

  const handleLogin = (authData: Auth) => {
    login(authData);
  };

  const handleLogout = () => {
    logout();
  };

  return { auth, isAuth, handleLogin, handleLogout };
};

export default useAuth;
