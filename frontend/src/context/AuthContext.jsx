    const login = (userData, jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
        setUser(userData);
    };

    const updateUser = (userData) => setUser(userData);

    const loginWithToken = async (jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
        const res = await getProfileApi();
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, loginWithToken, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );