import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { toaster } from "@/components/ui/toaster";

const OAuthSuccess = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = params.get("token");
        if (!token) return navigate("/login");

        loginWithToken(token).then((user) => {
            if (!user?.phoneNumber) {
                toaster.create({
                    title: "One more thing",
                    description: "Add a phone number so helpers and seekers can reach you.",
                    type: "info",
                });
                navigate("/profile");
            } else {
                navigate("/dashboard");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Center minH="60vh"><Spinner size="lg" color="var(--gold)" /></Center>;
};

export default OAuthSuccess;