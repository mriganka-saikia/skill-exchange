import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

const OAuthSuccess = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = params.get("token");
        if (!token) return navigate("/login");
        loginWithToken(token).then(() => navigate("/dashboard"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Center minH="60vh"><Spinner size="lg" color="var(--gold)" /></Center>;
};

export default OAuthSuccess;