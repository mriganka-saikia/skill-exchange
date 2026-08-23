import { Navigate } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return (
            <Center minH="40vh">
                <Spinner size="lg" color="var(--gold)" />
            </Center>
        );
    }

    if (!token || !user) return <Navigate to="/login" replace />;
    if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" replace />;

    return children;
};

export default ProtectedRoute;