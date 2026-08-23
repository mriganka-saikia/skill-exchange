import { createContext, useContext, useEffect, useState } from "react";
import { getProfileApi } from "@/api/auth"; const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); useEffect(() => {
        const init = async () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) { setLoading(false); return; }
            try {
                const res = await getProfileApi();
                setToken(storedToken); setUser(res.data.user);
            } catch (error) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);
    const login = (userData, jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt); setUser(userData);
    };
    const updateUser = (userData) => setUser(userData);
    const loginWithToken = async (jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt); const res = await getProfileApi(); setUser(res.data.user);
    };
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };
    return (<AuthContext.Provider value={{ user, token, loading, login, loginWithToken, logout, updateUser }}> {children} </AuthContext.Provider>);
};
export const useAuth = () => useContext(AuthContext);