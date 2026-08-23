import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { loginApi } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await loginApi(form);
        login(res.data.user, res.data.token);
        navigate("/dashboard");
    };

    <Button
    type="button"
    variant="outline"
    borderColor="var(--line)"
    onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)}
>
    Continue with Google
</Button>

    return (
        <Box className="app-main" maxW="400px" py={16}>
            <form onSubmit={handleSubmit}>
                <VStack gap={4}>
                    <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Button type="submit" bg="var(--gold)" color="white">Log in</Button>
                </VStack>
            </form>
        </Box>
    );
};

export default Login;